const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env. PORT || 5000;
const {memberRoutes,adminRoutes} = require("./routes/usersRoute");
const categoryRoutes=require("./routes/CategoryRoutes")
const tutorsRoutes=require("./routes/TutorRoutes")
const lessonRoutes=require("./routes/LessonRoutes")

const morgan = require("morgan");
const cors = require("cors");

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/member", memberRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/category",categoryRoutes);
app.use("/api/tutor",tutorsRoutes);
app.use("api/course",lessonRoutes);


app.use(notFound);
app.use(errorHandler);

dbConnect().then(()=>{
  console.log("Database connected sucessfully");
  app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
  })
}
);
