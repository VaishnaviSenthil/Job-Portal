const express = require('express');
const mongoose = require('mongoose');
const app = express();
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
var cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');


// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Portal API Documentation',
      version: '1.0.0',
      description: 'API documentation for job portal application.',
    },
    servers: [
      {
        url: "http://localhost:9000"
      }
    ],
    securityDefinitions: {
      BearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Use Bearer Token (JWT) for authentication'
      }
    },
  },
  apis: ['./routes/*.js'],
};

  
  // Initialize Swagger
  const swaggerSpec = swaggerJSDoc(swaggerOptions);



// Routes
const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/userRoutes');
const jobTypeRoutes = require('./routes/jobTypeRoute');
const jobsRoutes = require('./routes/jobsRoutes');

//port
const port = process.env.PORT || 9000;


mongoose.connect(process.env.DATABASE,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>console.log("Db is connected"))
.catch((err)=>console.log(err));


// middleWare
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(cors());


// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// routes

app.use('/api',authRoutes)
app.use('/api',userRoutes)
app.use('/api',jobTypeRoutes)
app.use('/api',jobsRoutes)





// error middleware
app.use(errorHandler)






app.listen(port,()=>{
    console.log(`App is running in port ${port}`);
})
