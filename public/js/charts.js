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
let myChart;
function renderChart(data, labels) {
    const chartEl = $('#myChart')
    $('#chart-title').html(`<h2>${state.timeframe.charAt(0).toUpperCase() + state.timeframe.slice(1)} ${state.data.charAt(0).toUpperCase() + state.data.slice(1)}</h2>`)
    if (myChart) {
        myChart.destroy();
      }
    myChart = new Chart(chartEl, {
        type: 'bar',
        data: {
            labels: labels,
            datasets:[{
                data: data,
                backgroundColor: "rgba(255,0,0,0.8)",
            }]
        },
        options: {
            scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: state.data.charAt(0).toUpperCase() + state.data.slice(1)
                  }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: state.timelabel.charAt(0).toUpperCase() + state.timelabel.slice(1)
                    }
                }]
            } ,
            legend: {
                display: false
            },
        }
    })
}

function getData(timeframe, type){
    return new Promise((resolve, reject) => {
        let dataObj = data[type][timeframe].data;
        $.ajax({
            url: data[type][timeframe].url,
            success: function(result){
                result.forEach(item => {
                    for (const key in item) {
                        if (key === 'date'){
                            let str = item.hour ? `${item[key].slice(0,10)}-${item.hour}:00` : item[key].slice(0,10)
                            dataObj[key].push(str)
                        } else if (key === 'hour') {
                            dataObj[key].push(item.hour+':00')
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
    } else renderChart(data[state.type][state.timeframe].data[state.data], data[state.type][state.timeframe].data[state.timelabel])
}

$(document).ready(()=>{
    getData(state.timeframe, state.type)
    .then(() => {
        renderChart(data[state.type][state.timeframe].data[state.data], data[state.type][state.timeframe].data[state.timelabel])
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
$('.radio').on('change', () => {
    dataType = $('input[name=type]:checked').val();
    if (dataType === 'events') {
        state.type = 'events'
        state.data = 'events'
    } else {
        state.type = 'stats'
        state.data = dataType
    }
    getDataAndUpdate()
})