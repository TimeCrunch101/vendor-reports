if (process.env.NODE_ENV !== 'production') require('dotenv').config()
  if (process.env.NODE_ENV === 'production') {
    console.warn('Server running in PRODUCTION mode')
  } else {
    console.warn('Server running in DEV mode')
  }
  // require("./socket")
  const opts = require("./config/options.json")
  const express = require('express')
  const rateLimit = require('express-rate-limit');
  const initGetRouter = require('./routes/getRouter')
  const initPostRouter = require('./routes/postRouter')
  const cors = require('cors')
  const app = express()
  
  const apiLimiter = rateLimit({
    windowMs: opts.api_limits.window_ms,
    max: opts.api_limits.max,
    standardHeaders: true,
    legacyHeaders: false,
  })
  
  app.use(express.urlencoded({extended: false}))
  app.use(express.json())
  app.use((req, res, next) => {
      res.locals.user = res.user
      next()
  })
  
  if (process.env.NODE_ENV !== 'production') {
    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true
    }))
  }
  
  if (process.env.NODE_ENV === 'production') {
    app.use('/*', apiLimiter)
  }
  
  initGetRouter(app)
  initPostRouter(app)
  
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/public'))
    app.get(/.*/, (req, res) => {
      res.sendFile(__dirname + '/public/index.html')
    })
  }
  
  app.listen(8080, console.info(`API: http://localhost:8080`))