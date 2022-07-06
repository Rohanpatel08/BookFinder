const connectToMongo = require('./DB');
const express = require('express')
connectToMongo();

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())

app.get('/',(req,res)=>{
  res.send("Welcome to Book Finder and Learning App");
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/books',require('./routes/books'))

app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDoc));
const swaggerJsDoc = require("swagger-jsdoc");

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})