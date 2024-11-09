
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const mediaRoute = require('./routes/media')
const multer = require('multer')
const path = require("path")

dotenv.config();
mongoose.connect(process.env.MONGO_URL);

const app = express();

// Enable CORS
app.use(cors()); // This will allow all origins. You can customize this if needed.
app.use("/images", express.static(path.join(__dirname,"public/images")))
// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/images");
//     },
//     filename: (req, file, cb) => {
//         const fileName = req.body.name || file.originalname; // Use the name from the request or fall back to the original name
//         cb(null, fileName);
//     }
// });

// const upload = multer({ storage });

app.use("/api/media", mediaRoute);



app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
