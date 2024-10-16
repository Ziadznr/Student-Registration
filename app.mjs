import express from "express";
import cors from "cors";
import router from "./routes/api.mjs"
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import config, { MAX_JSON_SIZE } from './App/config/config.mjs';
const { DATABASE, PORT, REQUEST_NUMBER, REQUEST_TIME, URL_ENCODE } = config;



const app = express();
const authRoutes = require('./routes/api');
const studentRoutes = require('./routes/student');
const fileRoutes = require('./routes/file');

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/file', fileRoutes);


// App use default middleware
app.use(cors())
app.use(express.json({
    limit: MAX_JSON_SIZE
}))
app.use(express.urlencoded({
    extended: URL_ENCODE
}))
app.use(helmet())


//App use limiter
const limiter = rateLimit({ windowMs: REQUEST_TIME, max: REQUEST_NUMBER })
app.use(limiter)


//Cache
import { WEB_CACHE } from './App/config/config.mjs';

// Set WEB_CACHE in your app
app.set('etag', WEB_CACHE);




//Database connect
mongoose.connect(DATABASE, { autoIndex: true }).then(() => {
    console.log("MongoDB connected")
}).catch(() => {
    console.log("MongoDB disconnected")
})

//Router
app.use("/api", router)


app.listen(PORT, () => {

    console.log("Server is running on port " + PORT)
})