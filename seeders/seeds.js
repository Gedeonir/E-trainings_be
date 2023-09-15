const Admin =require("../models/adminModel");
const dbConnect = require("../config/dbConnect");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const memberModel = require("../models/memberModel");

dotenv.config();

const membersDummyData=[
{
    fullNames:"Ishimwe Fillette Honorine",
    mobile:"0780000001",
    gender:"Female",
    district:"AUCA",
    church:"AUCA",
    ID:"1199870000000001",
},
{
    fullNames:"Ishimwe Fillette",
    mobile:"0780000002",
    gender:"Female",
    district:"Remera",
    church:"Remera",
    ID:"1198870000000002",
},
{
    fullNames:"Ishimwe Claude",
    mobile:"0780000003",
    gender:"Male",
    district:"AUCA",
    church:"AUCA",
    ID:"1196980000000003",
},
{
    fullNames:"Cyiza Samson",
    mobile:"0780000004",
    gender:"Male",
    district:"Remera",
    church:"Bibare",
    ID:"1200580000000004",
},
{
    fullNames:"Shami Elba",
    mobile:"0780000095",
    gender:"Male",
    district:"Remera",
    church:"Nyabisindu",
    ID:"1200580000000005",
},
{
    fullNames:"Ishimwe Vicky",
    mobile:"0780000005",
    gender:"Female",
    district:"Rusororo",
    church:"Masaka",
    ID:"1199670000000015",
},
{
    fullNames:"Emime Ntanganda",
    mobile:"0780000800",
    gender:"Male",
    district:"Cyirabo",
    church:"Rukoro",
    ID:"1199680000005315",
},
{
    fullNames:"Alice Ingabire",
    mobile:"0780000020",
    gender:"Female",
    district:"Mayange",
    church:"Rukoro",
    ID:"1200370000005375",
},
{
    fullNames:"Aline Uwamahoro",
    mobile:"0780000020",
    gender:"Female",
    district:"Mayange",
    church:"Rukoro",
    ID:"1194570000005375",
},
{
    fullNames:"Mbabazi Mariyana",
    mobile:"0780000020",
    gender:"Female",
    district:"Mayange",
    church:"Rukoro",
    ID:"1196970000025375",
},
{
    fullNames:"Irakoze Divine",
    mobile:"0780000020",
    gender:"Female",
    district:"Mayange",
    church:"Rukoro",
    ID:"1199870000015375",
},
{
    fullNames:"Bampire Marie Aime",
    mobile:"0780000020",
    gender:"Female",
    district:"Mayange",
    church:"Rukoro",
    ID:"1198670000015375",
}



]

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
        await memberModel.deleteMany({})
        await Admin.insertMany(adminUser);
        await memberModel.insertMany(membersDummyData);
        console.log("success")
    } catch (error) {

        console.log("seeds failed\n",error);
        
    }

}

dbConnect().then(() => {
    console.log("Database connected!");
    seedUser().then(()=>{
        mongoose.connection.close();
    });
})

