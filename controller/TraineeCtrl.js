const Trainee = require("../models/traineeModel");
const Courses = require("../models/coursesModel")
const uniqid = require("uniqid");
const bcrypt = require("bcrypt");
const { ObjectId } = require('bson');

const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendSMS=require("../utils/sendSms");
const lessonModel = require("../models/lessonModel");
const memberModel = require("../models/memberModel");


const getTraineeCategory=(yearOfMarriage)=>{
  const yearsOfMarriage = new Date().getFullYear() - yearOfMarriage;

  if(yearsOfMarriage <= 10) return "Flowers"
  if(yearsOfMarriage > 10 && yearsOfMarriage <=20) return 'Eagle'
  if(yearsOfMarriage > 20 && yearsOfMarriage <=30) return 'Excellent'
  if(yearsOfMarriage > 30) return 'Golden'
  
}

function getAge(IDNumber){
  const getDOB=IDNumber.split('').slice(1,5).join('');
  
  return new Date().getFullYear() - parseInt(getDOB)
  
}


const isElegibleForGettingMarried=(ID,yearOfMarriage)=>{
  const getDOB=ID.split('').slice(1,5).join('');
  
  if(new Date().getFullYear() - parseInt(getDOB) < 21){
    return false
  }else if(parseInt(yearOfMarriage) - parseInt(getDOB) < 21)
    return false
  else
    return true    
    
}



function isFemale(IDNumber){
  const getGender=IDNumber.split('').slice(5)[0];
    
  if(getGender== 8){
      return false
  }else
      return true    
  
}


// Create a Trainee ----------------------------------------------

const createTrainee = asyncHandler(async (req, res) => {
  const {isMarried,yearOfMarriage,ID,password} = req.body

  const reg = new RegExp("^((1|2))[0-9]{15}$", "i");
  
  if(!ID || !password) throw new Error("ID and password are required");

  if (!reg.test(ID)) throw new Error("Invalid ID")

  const findMember=await memberModel.findOne({ ID:ID })
  if(!findMember) throw new Error("Trainings are only available for members of SDA church")

  if(!isFemale(ID)) throw new Error("Trainings are only available for female members of the SDA church")

  if(isMarried && !isElegibleForGettingMarried(ID,yearOfMarriage)) throw new Error("You must be above 21 to get married")
  
  if(isMarried && !yearOfMarriage) throw new Error("Please specify year of Marriage");

  if(yearOfMarriage > new Date().getFullYear()) throw new Error("The year of marriage must not exceeds today's date");
  


  /**
   * TODO:With the help of mobile find the Trainee exists or not
   */
  const findTrainee = await Trainee.findOne({ ID:ID });

  if (!findTrainee) {
    /**
     * TODO:if Trainee not found Trainee create a new Trainee
     */
    const newTrainee = await Trainee.create(
      {
        fullNames:findMember?.fullNames,
        ID:ID,
        age:await getAge(ID),
        mobile:findMember?.mobile,
        isMarried:isMarried,
        yearOfMarriage:yearOfMarriage,
        password:password,
        traineeCategory:isMarried?getTraineeCategory(yearOfMarriage):"Junior",
        district:findMember?.district,
        church: findMember?.church,
      }
    );


    // const data	=	{
    //   'recipients':`${newTrainee.mobile}`,
    //   'message':`Welcome to our project`,
    //   'sender':'+250780689938'
    // }
    
    // sendSMS(data);

    res.json({
      message:"Trainee registered",
      newTrainee
    });
  } else {
    /**
     * TODO:if Trainee found then thow an error: Trainee already exists
     */
    throw new Error("Trainee Already Registered");
  }

});

// Login a Trainee
const loginTraineeCtrl = asyncHandler(async (req, res) => {
  const { ID, password } = req.body;

  if(!ID || !password) throw new Error("All fields are required")
  // check if Trainee exists or not
  const findTrainee = await Trainee.findOne({ ID:ID });
  if (findTrainee && (await findTrainee.isPasswordMatched(password))) {

    if(findTrainee.isDisabled) throw new Error("You are account is temporary disabled,Contact your site admin")
    res.json({
      _id: findTrainee?._id,
      fullNames: findTrainee?.fullNames,
      role: findTrainee?.role,
      mobile: findTrainee?.mobile,
      token: generateToken(findTrainee?._id),
    });
  } else {
    throw new Error("ID or password don't match");
  }
});

const getAllTrainees = asyncHandler(async (req, res) => {
  try {
    const getTrainees = await Trainee.find({},{password:0,passwordResetToken:0,passwordResetExpires:0});
    res.json(getTrainees);
  } catch (error) {
    throw new Error(error);
  }
});

const getOneTrainee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getOneTrainee = await Trainee.findById(id,{password:0,passwordResetToken:0,passwordResetExpires:0})

    res.json({
      getOneTrainee,
    });
  } catch (error) {
    throw new Error(error);
  }
});


const deleteTrainee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    await Trainee.findByIdAndDelete(id);
    res.json({
      message:"User deleted succesfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const viewProfile=asyncHandler(async(req,res)=>{
  const { _id } = req.user;
  validateMongoDbId(_id);

  try{
    const getProfile = await Trainee.findById(_id,{password:0,passwordResetToken:0,passwordResetExpires:0})

    res.json({
      getProfile,
    });
  } catch (error) {
    throw new Error("error");
  }

})

const updatedTrainee = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  const {isMarried,yearOfMarriage} = req.body

  if(!req?.body?.fullNames||!req?.body?.age||!req?.body?.mobile||!req?.body?.password || !req?.body?.district || !req?.body?.church ||!req?.body?.isMarried) throw new Error("All fields are required");


  if(isMarried && !yearOfMarriage) throw new Error("Please specify year of Marriage")

  try {
    const updatedUser = await Trainee.findByIdAndUpdate(
      _id,
      {
        fullNames: req?.body?.fullNames,
        age: req?.body?.age,
        mobile: req?.body?.mobile,
        isMarried:req?.body?.isMarried,
        yearOfMarriage:req?.body?.yearOfMarriage,
        TraineeCategory:isMarried?getTraineeCategory(yearOfMarriage):"Junior",
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

const disableTrainee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockTrainee = await Trainee.findByIdAndUpdate(
      id,
      {
        isDisabled: true,
      },
      {
        new: true,
      }
    );
    res.json({message:`Trainee ${blockTrainee.fullNames} is temporary suspended`});
  } catch (error) {
    throw new Error(error);
  }
});

const unblockTrainee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await Trainee.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: `Trainee ${unblock.fullNames} is UnBlocked`,
    });
  } catch (error) {
    throw new Error(error);
  }
});


const forgotPassword = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  const Trainee = await Trainee.findOne({ mobile });
  if (!Trainee) throw new Error("Trainee not found with this mobile");
  try {
    const OTPCode = await Trainee.createPasswordResetToken();
    await Trainee.save();
    const data	=	{
      'recipients':`${Trainee.mobile}`,
      'message':`
      Kode yo guhindura ijambo banga ryawe ni \n \n ${OTPCode}.

      Niba utasabye guhindura ijambo banga ryawe,irengangize iyi message.`,	
      'sender':'+250780689938'
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
  const Trainee = await Trainee.findOne({
    passwordResetToken: OTPCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!Trainee) throw new Error(" OTP Code Expired or is invalid, Request another one");
  Trainee.password = password;
  Trainee.passwordResetCode = undefined;
  Trainee.passwordResetExpires = undefined;
  await Trainee.save();
  res.json({
    message:"Password changed succesfully"
  });
});


const changePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    //3.get Userfrom token by uuid
    const Trainee= await Trainee.findOne({_id});
    //4.get password from reques body
    const { oldpassword, newpassword1, newpassword2 } = req.body;

    //5. Check passwords
    const password = await bcrypt.compare(oldpassword, Trainee.password);
    if (!password) {
      throw new Error("The old password is wrong, correct it and try again");
    }
    if (newpassword1 !== newpassword2) {
      throw new Error("new password does not match" );
    }

    //6.hash password

    //update pass
    Trainee.password = newpassword1;
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
  const findCourse= await Courses.findOne({_id:course});

  if (!findCourse) throw new Error("This course is no longer available"); 

  try {
    const data =findCourse?.enrolledTrainees
        
    const filteredData = data?.filter(item => item?.member?.equals(_id));

    if(filteredData.length > 0 ) {
      throw new Error("You have already enrolled in this course")
    }

    findCourse.enrolledTrainees.push({
      member:_id,
    });

    
    await findCourse.save();

    res.json({
      message:"You are succesfully enrolled to this course"
    })
    
  } catch (error) {
    throw new Error(error);
  }
})

const completeLesson=asyncHandler(async(req,res)=>{
  const { _id } = req.user;
  validateMongoDbId(_id);

  const {lesson}=req.params

  const findLesson= await lessonModel.findOne({_id:lesson});

  if (!findLesson) throw new Error("This lesson is no longer available"); 
  
  try {
    const data =findLesson?.completedBy
        
    const filteredData = data?.filter(item => item?.member?.equals(_id));

    if(filteredData.length > 0 ) {
      return;
    }

    findLesson.completedBy.push({
      member:_id,
    });

    
    await findLesson.save();

    res.json({
      message:"You are succesfully completed this lesson"
    })
    
  } catch (error) {
    throw new Error(error);
  }
})

const getMyEnrolledCourses=asyncHandler(async(req,res)=>{
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const getCourses = await Courses.find();
    const getMyCourse=getCourses.filter(course=> course.enrolledTrainees.some((obj) =>obj?.member?.equals(_id)))

    res.json(getMyCourse);
  } catch (error) {
    throw new Error(error);
  }

})

const filterTraineeByScore=asyncHandler(async(req,res)=>{
  try{

      const Trainees = await Trainee.find()
      const courses=await Courses.find()

      for (const Trainee of Trainees) {
        const getTraineeCourse=courses.filter(course=> course.completedBy.some((obj) =>obj?.member?.equals(Trainee._id)))


          const score = getTraineeCourse?.length/courses?.length;
          Trainee.score = 100 * score;
          await Trainee.save()
      }
      
      // Sort courses based on popularity score in descending order
      Trainees.sort((a, b) => b.score - a.score);
      
      // Print the sorted courses
      res.json(Trainees)  
  }catch(error){
      throw new Error(error)
  }     
})





module.exports = {
  createTrainee,
  loginTraineeCtrl,
  getAllTrainees,
  forgotPassword,
  resetPassword,
  changePassword,
  getOneTrainee,
  updatedTrainee,
  deleteTrainee,
  disableTrainee,
  unblockTrainee,
  enrollToCourse,
  viewProfile,
  getMyEnrolledCourses,
  completeLesson,
  filterTraineeByScore
};
