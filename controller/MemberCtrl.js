const Member = require("../models/memberModel");
const Courses = require("../models/coursesModel")
const uniqid = require("uniqid");
const bcrypt = require("bcrypt");

const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendSMS=require("../utils/sendSms");
const { memberRoutes } = require("../routes/usersRoute");


const getMemberCategory=(yearOfMarriage)=>{
  const yearsOfMarriage = new Date().getFullYear() - yearOfMarriage;

  if(yearsOfMarriage <= 10) return "Flowers"
  if(yearsOfMarriage > 10 && yearsOfMarriage <=20) return 'Eagle'
  if(yearsOfMarriage > 20 && yearsOfMarriage <=30) return 'Excellent'
  if(yearsOfMarriage > 30) return 'Golden'
  
}


// Create a Member ----------------------------------------------

const createMember = asyncHandler(async (req, res) => {
  const {isMarried,yearOfMarriage,fullNames,age,mobile,password,district,church} = req.body

  try{

    if(!fullNames||!age||!mobile||!password || !district || !church ||!isMarried) throw new Error("All fields are required");

    if(isMarried && !yearOfMarriage) throw new Error("Please specify year of Marriage");

    /**
     * TODO:With the help of email find the Member exists or not
     */
    const findMember = await Member.findOne({ mobile: mobile });

    if (!findMember) {
      /**
       * TODO:if Member not found Member create a new Member
       */
      const newMember = await Member.create(
        {
          fullNames:fullNames,
          age:age,
          mobile:mobile,
          isMarried:isMarried,
          yearOfMarriage:yearOfMarriage,
          password:password,
          memberCategory:isMarried?getMemberCategory(yearOfMarriage):"Junior",
          district:district,
          church: church,
        },
      );
      res.json({
        message:"Member registered",
        newMember
      });
    } else {
      /**
       * TODO:if Member found then thow an error: Member already exists
       */
      throw new Error("Member Already Exists");
    }
  }catch(error){
    throw new Error("Unable to register member",error)
  }
});

// Login a Member
const loginMemberCtrl = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;

  if(!mobile || !password) throw new Error("All fields are required")
  // check if Member exists or not
  const findMember = await Member.findOne({ mobile });
  if (findMember && (await findMember.isPasswordMatched(password))) {

    if(findMember.isDisabled) throw new Error("You are account is temporary disabled,Contact your site admin")
    res.json({
      _id: findMember?._id,
      fullNames: findMember?.fullNames,
      role: findMember?.role,
      mobile: findMember?.mobile,
      token: generateToken(findMember?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

const getAllMembers = asyncHandler(async (req, res) => {
  try {
    const getMembers = await Member.find({password:0,passwordResetToken:0,passwordResetExpires:0});
    res.json(getMembers);
  } catch (error) {
    throw new Error(error);
  }
});

const getOneMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getOneMember = await Member.findById(id,{password:0,passwordResetToken:0,passwordResetExpires:0})
    .populate({path:"enrolledCourses",populate:"course"})
    .populate({path:"enrolledCourses",populate:"totalLessonsCompleted"});

    res.json({
      getOneMember,
    });
  } catch (error) {
    throw new Error(error);
  }
});


const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    await Member.findByIdAndDelete(id);
    res.json({
      message:"User deleted succesfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatedMember = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  const {isMarried,yearOfMarriage} = req.body

  if(!req?.body?.fullNames||!req?.body?.age||!req?.body?.mobile||!req?.body?.password || !req?.body?.district || !req?.body?.church ||!req?.body?.isMarried) throw new Error("All fields are required");


  if(isMarried && !yearOfMarriage) throw new Error("Please specify year of Marriage")

  try {
    const updatedUser = await Member.findByIdAndUpdate(
      _id,
      {
        fullNames: req?.body?.fullNames,
        age: req?.body?.age,
        mobile: req?.body?.mobile,
        isMarried:req?.body?.isMarried,
        yearOfMarriage:req?.body?.yearOfMarriage,
        memberCategory:isMarried?getMemberCategory(yearOfMarriage):"Junior",
        district: req?.body?.district,
        church: req?.body?.church,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const disableMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockMember = await Member.findByIdAndUpdate(
      id,
      {
        isDisabled: true,
      },
      {
        new: true,
      }
    );
    res.json({message:`Member ${blockMember.fullNames} is temporary suspended`});
  } catch (error) {
    throw new Error(error);
  }
});

const unblockMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await Member.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: `Member ${unblock.fullNames} is UnBlocked`,
    });
  } catch (error) {
    throw new Error(error);
  }
});


const forgotPassword = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  const member = await Member.findOne({ mobile });
  if (!member) throw new Error("Member not found with this mobile");
  try {
    const OTPCode = await member.createPasswordResetToken();
    await member.save();
    const data	=	{
      'recipients':`${member.mobile}`,
      'message':`
      Kode yo guhindura ijambo banga ryawe ni \n \n ${OTPCode}.

      Niba utasabye guhindura ijambo banga ryawe,irengangize iyi message.`,	
      'sender':'7000'
    }
    
    sendSMS(data);

    res.json({
      message:"SMS Sent,Check your mobile phone"
    });
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { OTPCode } = req.params;
  const member = await Member.findOne({
    passwordResetToken: OTPCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!member) throw new Error(" OTP Code Expired or is invalid, Request another one");
  member.password = password;
  member.passwordResetCode = undefined;
  member.passwordResetExpires = undefined;
  await member.save();
  res.json({
    message:"Password changed succesfully"
  });
});


const changePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    //3.get Userfrom token by uuid
    const member= await Member.findOne({_id});
    //4.get password from reques body
    const { oldpassword, newpassword1, newpassword2 } = req.body;

    //5. Check passwords
    const password = await bcrypt.compare(oldpassword, member.password);
    if (!password) {
      throw new Error("The old password is wrong, correct it and try again");
    }
    if (newpassword1 !== newpassword2) {
      throw new Error("new password does not match" );
    }

    //6.hash password

    //update pass
    member.password = newpassword1;
    await user.save();

    res.json({ message: "your password is updated successfully" });
  } catch (error) {
    throw new Error("Unable to change password",error );
  }

});

const enrollToCourse=asyncHandler(async(req,res)=>{
  const { _id } = req.user;
  validateMongoDbId(_id);

  const {course} = req.params;
  validateMongoDbId(course);

  try {
    const findCourse= await Courses.finOne({_id:course});

    if (findCourse) {
      
      const member= await Member.findOne({_id});

      member.enrolledCourses.push({
        course:findCourse?._id,
        totalLessonsCompleted:0
      })

      await member.save();

      res.json({
        message:"You are succesfully enrolled to this course"
      })
    }else{
      throw new Error("This course is no longer available");
    }
  } catch (error) {
    throw new Error("Unable to enroll you this course");
  }
})





module.exports = {
  createMember,
  loginMemberCtrl,
  getAllMembers,
  forgotPassword,
  resetPassword,
  changePassword,
  getOneMember,
  updatedMember,
  deleteMember,
  disableMember,
  unblockMember,
  enrollToCourse
};
