//import required tools
import { createRequire } from "module"; //allows us to use require and import at the same time
import express from "express";
import cors from "cors"; //used to have different ports communicate with eachother
import connectDB from "./config/db.js"
import UserRouter from "./routes/UserRouter.js"
import setupPDFRoute from "./routes/pdfRoute.js";
import axios from "axios";
import mongoose from "mongoose";
//test to add users to DB
import User from './models/User.js';


//create Express application
//will use app to define routes, use middleware, start the server and more
const app = express();
//if environment variable PORT is available, use it. else, use port 3000 as fallback
const port =  5000;

app.use(cors()); //express will now use CORS

app.get('/api/test', (req, res) => {
    res.json({ message: 'CORS is working!' });
});
//middleware
app.use(express.json());
app.use("/api", UserRouter);

//set up multer for file uploads
// const upload = multer({dest: 'uploads/'});



setupPDFRoute(app);
//start server 
app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
})

// const newUser = new User({userId:"5", userName:'baaaefigaea', userEmail:'bx@gmail.com', quizzes:[]});
// newUser.save();
// console.log(newUser);

//test if server works, need to use localhost.3000
connectDB();
app.get('/', (req, res) => {
    res.send('Hello World! Express server is running.');
  });

