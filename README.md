# COVID-19 API

[Base URI](https://warm-coast-62507.herokuapp.com/)

## How does it work?
By fetching data from an official [JHU CSSE repository](https://github.com/CSSEGISandData/COVID-19) and converting CSV data to JSON format.

## How do I use it?
There are two ways.

To get data for the past 2-3 days (depending whether the list is recently updated), combine **Base URI** with `/api/entries/` 

To get data for a specific period of time, combine **Base URI** with `api/entries/{starting date}_{ending date}`, with both dates in **YYYY-MM-DD** format. Example: `/api/entries/2020-04-20_2020-04-30`

## Response example
```json
[
    {
        country: "Afghanistan",
        province: "",
        imp: false,
        cases: [
            {
                1/7/21: 53207
            },
            {
                1/8/21: 53332
            },
            {
                1/9/21: 53400
            }
        ],
        status: "rising"
    },
    ...
]
```
Bear in mind that the date format in the response is **M/D/YY**.


## Is it free?
**This is important!** It's as free as Heroku dynos it's hosted on, so keep that in mind. There's both an uptime limit and a per-user request limit. Meaning, **it can be used for small MVPs at most**. That was it's purpose after all! *If you intend to redistribute, modify or commercialize this code in any way other than personal make sure to have my consent.*


## Any questions?
Feel free to either contact me here, or on [Telegram](https://t.me/felipemaersk). Pull requests, suggestions  welcome. Cheers!