console.log('Initializing...')

const express = require('express')
const axios = require('axios')
const csv = require('csvtojson')
const dayjs = require('dayjs')
const app = express()

const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
let arr2 = []
let obj = {}
let jsondata

const dateFn = (i) => {
    if (i === null) {
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
                    imp: /Russia|US|Germany|Canada/.test(a['Country/Region']) ? true : false,
                    cases:
                        Object.entries(a).filter(key => dateCheck.test(key)).map(([ key, val ]) => y = {
                            [key]: Number(val)
                        })
                }

                obj.cases.sort((a, b) => Object.values(a) > Object.values(b) ? obj.status = 'rising' : Object.values(a) < Object.values(b) ? obj.status = 'falling' : obj.status = 'stable')

                arr2.push(obj)
           
                obj = {}
}

const getterFn = async () => {
    axios
    .get(url)
    .then(r => {
        arr2 = []
        csv({
            output: "json"
        })
        .fromString(r.data)
        .then(r => jsondata = r)
        .catch((e) => console.log(`${e} __err csv`)) 
    })
    .catch((e) => console.log(`${e} __err fetch`))
}


app.get('/', (req, res) => {
    res.send(
        `<h1>Hello world!</h1>
        <p>This is a COVID-19 status API</p>
        `
    )
})

app.get('/api/entries', (req, res) => {
    getterFn()
        .then(() => {
            jsondata.map(i => objMake(i, null))
            res.json(arr2)
            res.end()
        })
        .catch(e => res.status(404).send('The content is being prepared or under maintenance. Try again in a moment.'))
})

app.get('/api/entries/:id', (req, res) => {
    getterFn()
        .then(() => {
            jsondata.map(i => objMake(i, req.params.id))
            res.json(arr2)
            res.end()
        })
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