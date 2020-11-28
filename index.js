console.log('Hi worlda .. !')

const express = require('express')
const axios = require('axios')
const csv = require('csvtojson')

const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
let arr2 = []
let obj = {}

axios
    .get(url)
    .then(r => {
        let data = r.data

        csv({
            output: "json"
        })
        .fromString(data)
        .then(jsondata => { 
            jsondata.map(i => {

                let date = new Date()
                let year = date.getFullYear().toString()
                year = year.slice(year.length - 2, year.length)
        
                const dateCheck = new RegExp(`${date.getMonth() + 1}/(${date.getDate()}|${date.getDate() - 1}|${date.getDate() - 2}|${date.getDate() - 3})/${year}`)

                obj = {
                    country: i['Country/Region'],
                    province: i['Province/State'],
                    cases:
                        Object.entries(i).filter(key => dateCheck.test(key)).map(([ key, val ]) => obj = {
                            [key]: val
                        }) 
                }

                arr2.push(obj)
                
                obj = {}
            })
        }) 
    })


const app = express()

app.get('/', (req, res) => {
    res.send(
        `<h1>Hello world!</h1>
        <p>The api is at ./api/entries</p>
        `
    )
})

app.get('/api/entries', (req, res) => {
    res.json(arr2)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})