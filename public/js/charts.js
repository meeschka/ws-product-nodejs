let data = {
    events: {
        hourly: {
            url: '/events/hourly',
            data: {
                date: [],
                hour: [],
                events: []
            }
        },
        daily: {
            url: '/events/daily',
            data: {
                date: [],
                events: []
            }
        }
    },
    stats: {
        hourly: {
            url: '/stats/hourly',
            data: {
                date: [],
                hour: [],
                impressions: [],
                clicks: [],
                revenue: []
            }
        },
        daily: {
            url: '/stats/daily',
            data: {
                date: [],
                impressions: [],
                clicks: [],
                revenue: []
            }
        }
    }
}
let state = {
    type: 'events',
    timeframe: 'hourly',
    data: 'events',
    timelabel: 'date'
}
function renderChart(data, labels) {
    const chartEl = $('#myChart')
    let myChart = new Chart(chartEl, {
        type: 'bar',
        data: {
            labels: labels,
            datasets:[{
                data: data,
            }]
        }
    })
}

function getData(timeframe, type){
    return new Promise((resolve, reject) => {
        let dataObj = data[type][timeframe].data;
        console.log(dataObj)
        $.ajax({
            url: data[type][timeframe].url,
            success: function(result){
                result.forEach(item => {
                    for (const key in item) {
                        if (key === 'date'){
                            dataObj[key].push(item[key].slice(0,10))
                        } else {
                            dataObj[key].push(item[key])
                        }
                      }
                })
                resolve();
            },
            error: function(err){
                reject(err)
            }
        })
    })  
}

function getDataAndUpdate() {
    if (data[state.type][state.timeframe].data.date.length === 0) {
        getData(state.timeframe, state.type)
        .then(() => {
            renderChart(data[state.type][state.timeframe].data[state.data], data[state.type][state.timeframe].data[state.timelabel])
        })
        console.log(data)
    } else renderChart(data[state.type][state.timeframe].data[state.data], data[state.type][state.timeframe].data[state.timelabel])
}

$(document).ready(()=>{
    getData(state.timeframe, state.type)
    .then(() => {
        renderChart(data[state.type][state.timeframe].data[state.data], data[state.type][state.timeframe].data[state.timelabel])
    })
    .catch(err => {
         console.log(err)
        // $('#message').innerHtml(`Unable to retrieve data: ${err}`)
    })
})

$('#daily-btn').on('click', ()=> {
    state.timeframe = 'daily'
    getDataAndUpdate();
})
$('#hourly-btn').on('click', ()=> {
    state.timeframe = 'hourly'
    getDataAndUpdate();
})
$('#events-btn').on('click', ()=> {
    state.tpye = 'events'
    getDataAndUpdate();
})
$('#stats-btn').on('click', ()=> {
    state.tpye = 'stats'
    getDataAndUpdate();
})