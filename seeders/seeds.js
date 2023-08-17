const Admin =require("../models/adminModel");
const dbConnect = require("../config/dbConnect");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const seedUser=async()=>{
    const salt = await bcrypt.genSaltSync(10);

    const adminUser=[{
        fullNames: "Administartor",
        email: process.env.USER_EMAIL,
        mobile:"070000000",
        password:await bcrypt.hash(process.env.USER_PASSWORD, salt)
    }]
    try {
        await Admin.deleteMany({});
        await Admin.insertMany(adminUser);
        console.log("Default user created succesfully")
    } catch (error) {

        console.log("Creating default user failed\n",error);
        
    }

}

dbConnect().then(() => {
    console.log("Database connected!");
    seedUser().then(()=>{
        mongoose.connection.close();
    });
})

