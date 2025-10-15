import express from "express";
import useragent from 'express-useragent';
import cookieParser from "cookie-parser";
const app = express();
 
import { PORT } from "./config/env.js"; // port
import connectDB from "./config/db.js"; // db



import limiterMiddleware from "./middlewares/rateLimitMiddleware.js"; // limit the request in specifice duration
import corsMiddleware from "./middlewares/corsMiddleware.js"; // cors
import helmetMiddleware from './middlewares/helmetMiddleware.js'; // helment
import compressionMiddleware from "./middlewares/compressionMiddleware.js"; // request response compresor 

import swaggerDocs from "./config/swagger.js"; //  documentation
// import winstonMiddleware from "./middlewares/winstonMiddleware.js";  // logger  
// import logRoutes from "./routes/logsRouters.js"; // logs
// import userRoutes  from "./routes/userRoutes.js"; // user routes

import employeeRoutes from "./routes/employeeRouters.js";
 
// make directory accessible for public use
app.use(express.static("public"));
app.use(express.static('logs'));

// Connect to Databse
connectDB();

// ejs
app.set('view engine', 'ejs');

// allows it to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// parse cookies from the Cookie header in HTTP requests
app.use(cookieParser());

// Middleware - Parse incoming JSON
app.use(express.json());

// Middleware to parse user-agent
app.use(useragent.express());

// Middleware - compression
app.use(compressionMiddleware);

// Middleware -  limiter
app.use(limiterMiddleware);

// Middleware - cors
app.use(corsMiddleware);

// Middleware - helmet 
app.use(helmetMiddleware);

// documentation 
swaggerDocs(app);

// Attach logger to each request
// app.use(winstonMiddleware); 



// main route
app.get('/', (req, res) => {
  res.send("Hello from JWT Auth Server");
 // res.redirect("/users")
});

// routes
app.use("/emp", employeeRoutes);

app.use((req, res, next) => {
  console.log("Cookies accessToken: ", req.cookies.accessToken);
  console.log("Cookies refreshToken: ", req.cookies.refreshToken);
  next();
});

 
 
 
//404 page
app.use((req, res, next) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
    message: "Oops! The page you're looking for doesn't exist."
  });
});

// run to the server on the port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});