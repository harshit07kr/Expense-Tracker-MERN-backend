const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const cookieParser = require('cookie-parser');
const app = express()

require('dotenv').config()

const PORT = process.env.PORT || 5000;


//middlewares
app.use(express.json())
const allowedOrigins = [
  'https://main--sweet-monstera-672ffa.netlify.app',
  'https://sweet-monstera-672ffa.netlify.app', // Add this line
  // Add other origins as needed
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // If you are using cookies
}));
  
app.use(cookieParser());


//routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)))

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })
}

server()