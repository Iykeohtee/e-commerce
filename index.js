import express from 'express'
import dotenv from 'dotenv'



// intialize dotenv 
dotenv.config();
// initialize our express application
const app = express();

const port = process.env.PORT  


app.use('/about', (req, res) => {
   res.send("about")   
})

app.use('/', (req, res) => {
   res.send("Hello")   
})


app.listen(port, () => {
    console.log(`Port running on port ${port}`)  
})


// Gd4WjypDVtHk6RLG

