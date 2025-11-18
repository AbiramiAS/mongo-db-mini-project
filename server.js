import express from "express";
import path from "path";
import userRoutes from "./routes/authRoutes.js";
import cors from "cors";
import corsOptions from "./configs/corsOptions.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import registerNewUser from "./routes/registerRoutes.js";
import refreshRoutes from "./routes/refreshRoutes.js";
import verifyJWT from "./middlewares/verifyJWT.js";
import cookieParser from "cookie-parser";
import credentials from "./middlewares/credentials.js";
import mongoose from "mongoose";
import connectDB from "./configs/dbconnection.js";
// dotenv.config();
const __dirname = path.resolve();
//connect this app to mongoose
connectDB();

//port configuration
const PORT = process.env.PORT || 4000;

//express app initialization
const app = express();

app.use(express.json());

app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//middleware for cookies
app.use(cookieParser());


//route middleware
app.use("/employees", employeeRoutes); 
app.use("/auth", userRoutes);
app.use("/register", registerNewUser);

app.use("/refresh", refreshRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use(verifyJWT);


mongoose.connection.once("open", () => {
  console.log("Connection to MongoDB is successful");
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});