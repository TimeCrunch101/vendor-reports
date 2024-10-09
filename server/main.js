if (process.env.NODE_ENV !== 'production') require('dotenv').config()
  if (process.env.NODE_ENV === 'production') {
    console.warn('Server running in PRODUCTION mode')
  } else {
    console.warn('Server running in DEV mode')
  }
  // require("./socket")
  const opts = require("./config/options.json")
  const express = require('express')
  // const rateLimit = require('express-rate-limit');
  const initGetRouter = require('./routes/getRouter')
  const initPostRouter = require('./routes/postRouter')
  const cors = require('cors')
  const path = require("path")
  const app = express()
  
  // const apiLimiter = rateLimit({
  //   windowMs: opts.api_limits.window_ms,
  //   max: opts.api_limits.max,
  //   standardHeaders: true,
  //   legacyHeaders: false,
  // })
  
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
  } else {
    app.use(cors({
      origin: 'https://app.cincitechlabs.com',
      credentials: true
    }))
  }
  
  // if (process.env.NODE_ENV === 'production') {
  //   app.use('/*', apiLimiter)
  // }
  
  initGetRouter(app)
  initPostRouter(app)
  
    // JSON response for a 404 error
  // app.use((req, res) => {
  //   res.status(404).json({ error: 'Resource not found' });
  // });

  
  if (process.env.NODE_ENV === 'production') {
    // Serve static files from the 'public' directory
    app.use(express.static(path.join(__dirname, 'public')));
  
    // Catch all routes and serve 'index.html' for SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  }
  
  app.listen(8080, console.info(`API: http://localhost:8080`))