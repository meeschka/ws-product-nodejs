Work Sample for Product Aspect, Node.js Variant
---

[What is this for?](https://github.com/EQWorks/work-samples#what-is-this)

### Setup and Run

The following are the recommended options, but you're free to use any means to get started.

#### Local Option: Node.js 6.10+

1. Clone this repository
2. Install Node.js dependencies `$ npm install`
3. Set environment variables given in the problem set we send to you through email and run `$ npm run dev`
4. Ensure you have a running Redis client, and add the Redis url to the environment variables.
4. Open your browser and point to `localhost:5555` and you should see `Welcome to EQ Works 😎`

#### Remote Option

This project is hosted on heroku [here](https://eq-works-project.herokuapp.com/).

### Solution Notes

The [Redis documentation](https://redis.io/topics/quickstart) states that Redis lack encryption and is vulnerable to exploits if it is exposed to the web without protection. I have used Heroku for deployment, which [recommends](https://devcenter.heroku.com/articles/securing-heroku-redis) using SSL encryption via Stunnel Buildpack. This is only available for production level plans, so I considered it outside the scope of this exercise. In a production environment, it would be necessary to protect the Redis instance.

