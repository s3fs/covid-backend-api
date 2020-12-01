console.log('Hi worlda .. !')

const express = require('express')
const axios = require('axios')
const csv = require('csvtojson')
const dayjs = require('dayjs')

const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
let arr2 = []
let obj = {}
let jsondata

//console.log(dayjs().format('DD/MM/YY'), dayjs().subtract(1, 'day').format('DD/MM/YY'))

const dateFn = (i) => {
    if (!i) {
        return ([dayjs().format('M/D/YY'), dayjs().subtract(1, 'day').format('M/D/YY'), dayjs().subtract(2, 'day').format('M/D/YY'), dayjs().subtract(3, 'day').format('M/D/YY')])
    } else if (i) {
        i = i.split('_')

        let dates = []
        let currDate = dayjs(i[0])
        let lastDate = dayjs(i[1])

        while (currDate.isBefore(lastDate)) {
            dates.push(currDate.format('M/D/YY'))
            currDate = currDate.add(1, 'day')
        }
        return dates
    }
}


const objMake = (a, e) => {
    const dateCheck = new RegExp(dateFn(e).join('|'))

                obj = {
                    country: a['Country/Region'],
                    province: a['Province/State'],
                    cases:
                        Object.entries(a).filter(key => dateCheck.test(key)).map(([ key, val ]) => obj = {
                            [key]: val
                        }) 
                }

                arr2.push(obj)
                
                obj = {}
}

const getterFn = async () => {
    axios
    .get(url)
    .then(r => {
        let data = r.data

        csv({
            output: "json"
        })
        .fromString(data)
        .then(r => { 
            jsondata = r
        }) 
    })
}

getterFn()

const app = express()

app.get('/', (req, res) => {
    res.send(
        `<h1>Hello world!</h1>
        <p>The api is at ./api/entries</p>
        `
    )
})

app.get('/api/entries', async (req, res) => {

    await getterFn()
        .then(() => jsondata.map(i => objMake(i)))
        .then(() => res.json(arr2))
        .catch(e => res.status(404).send('The content is being prepared or under maintenance. Try again in a moment.'))
})

app.get('/api/entries/:id', async (req, res) => {
    await getterFn()
        .then(() => jsondata.map(i => objMake(i, req.params.id)))
        .then(() => res.json(arr2))
        .catch(e => res.status(404).send('The content is being prepared or under maintenance. Try again in a moment.'))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})