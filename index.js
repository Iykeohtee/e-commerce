import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/v1/authRoutes.js';
import productRoutes from './routes/v1/productRoutes.js'
import cookieParser from 'cookie-parser';
// const express = require('express');



// intialize dotenv 
dotenv.config();
// initialize our express application
const app = express();

app.use(cookieParser());

const port = process.env.PORT  

app.use(express.json()); // to parse JSON bodies

// mount your routes
app.use('/api/v1/auth', authRoutes);       
app.use('/api/v1', productRoutes);       


app.listen(port, () => {
    console.log(`Port running on port ${port}`)  
})


// Gd4WjypDVtHk6RLG

