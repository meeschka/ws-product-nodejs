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
}
const containerEl = $('.table-container')

function getData(){
    return new Promise((resolve, reject) => {
        let dataObj = data[state.type][state.timeframe].data;
        $.ajax({
            url: data[state.type][state.timeframe].url,
            success: function(result){
                result.forEach(item => {
                    for (const key in item) {
                        if (key === 'date'){
                            dataObj[key].push(item[key].slice(0,10))
                        } else if (key === 'hour') {
                            dataObj[key].push(item.hour+':00')
                        } else if (key === 'revenue') {
                            dataObj[key].push(`$${(parseFloat(item[key])).toFixed(2)}`)
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
function renderTable(){
    containerEl.empty;
    const dataObj = data[state.type][state.timeframe].data
    const numObjs = data[state.type][state.timeframe].data.date.length
    $('#table-title').html(`<h1>${state.timeframe.charAt(0).toUpperCase() + state.timeframe.slice(1)} ${state.type.charAt(0).toUpperCase() + state.type.slice(1)}</h1>`)
    let tableHtml = '<table class="table"><thead>'
    for (const key in dataObj) {
        tableHtml += `<th>${key}</th>`
    }
    tableHtml += `</thead><tbody>`
    for (i = 0; i< numObjs; i++){
        tableHtml += `<tr>`
        for (const key in dataObj) {
            tableHtml += `<td>${dataObj[key][i]}</td>`
        }
        tableHtml += `</tr>`
    }
    tableHtml += '</tbody></table>'
    containerEl.html(tableHtml)
}
function getDataAndUpdate() {
    if (data[state.type][state.timeframe].data.date.length === 0) {
        getData(state.timeframe, state.type)
        .then(() => {
            renderTable()
        })
    } else renderTable()
}

$(document).ready(()=>{
    getData(state.timeframe, state.type)
    .then(() => {
        renderTable()
    })
    .catch(err => {
        console.log(err)
        $('#message').html(`Unable to retrieve data: ${err}`)
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
    state.type = 'events'
    getDataAndUpdate();
})
$('#stats-btn').on('click', ()=> {
    state.type = 'stats'
    getDataAndUpdate();
})