const redis = require('redis')
const os = require('os')
const client = redis.createClient(process.env.REDIS_URL)

client.on('error', err => console.log(`Error ${err}`))

const timeWindow = 60 ; //time limit window in seconds
const dataLimit = 10; //number of requests allowed in time window

const rateLimiter = (req, res, next) => {
    const user = req.header('x-forwarded-for') || req.connection.remoteAddress
    const currentTime = new Date().getTime() / 1000
    const cutoffTime = currentTime - timeWindow
    //in production, an api key could be used to identify individual users
    client.exists(user, (err, reply) => {
        if (err) {
            return res.json({error: 504, message: "redis server not responding"})
        } else if (reply === 1) {
            client.get(user, (err, reply) => {
                const data = JSON.parse(reply)
                
                //get all batches of requests within window
                const requestsInWindow = data.filter((item) => {
                    return item.requestTime > cutoffTime;
                })

                //total number of requests in all batches within window
                let threshold = 0;
                requestsInWindow.forEach(item => {
                    threshold +=item.counter
                })

                if( threshold > dataLimit) {
                    return res.json({error: 429, message: "throttle limit exceeded"})
                } else {
                    let sameTime = false;
                    let dataLength = data.length;
                    let i = 0;
                    while (sameTime === false && i < dataLength) {
                        //if request batch already exists, increment counter
                        if (data[i].requestTime === currentTime) {
                            sameTime = true;
                            data[i].counter++
                        }
                        i++
                    }
                    //otherwise, create request batch with 1 request
                    if (!sameTime){
                        data.push({
                            requestTime: currentTime,
                            counter: 1
                        })
                    }
                    client.set(user, JSON.stringify(data))
                    next();
                }
            })
        } else {
            //create user with single request batch
            const data = [{
                requestTime: currentTime,
                counter: 1
            }]
            client.set(user, JSON.stringify(data))
            next();
        }
    })
}
module.exports = {rateLimiter}