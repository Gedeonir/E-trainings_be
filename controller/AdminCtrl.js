const Admin=require("../models/adminModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");

// admin login

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if Member exists or not
  
    if(!email || !password) throw new Error("All fields are required")
  
    const findAdmin = await Admin.findOne({ email });
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
      res.json({
        _id: findAdmin?._id,
        fullNames: findAdmin?.fullNames,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        token: generateToken(findAdmin?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
});

const updatedProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  const{
    fullNames,
    email,
    mobile
  }=req.body
  

  try {

    if(!fullNames ||!email || !mobile) throw new Error("All fields are required")

    const updatedUser = await Admin.findByIdAndUpdate(
      _id,
      {
        fullNames,
        email,
        mobile
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

const forgotPasswordAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error("User with this email not found");
  try {
    const OTPCode = await admin.createPasswordResetToken();
    await admin.save();
    const data	=	{
      'recipients':`${admin.mobile}`,
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

const resetPasswordAdmin = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { OTPCode } = req.params;
  const admin = await Admin.findOne({
    passwordResetToken: OTPCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!admin) throw new Error(" OTP Code Expired or is invalid, Request another one");
  admin.password = password;
  admin.passwordResetCode = undefined;
  admin.passwordResetExpires = undefined;
  await admin.save();
  res.json({
    message:"Password changed succesfully"
  });
});


const changePasswordAdmin = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    //3.get Userfrom token by uuid
    const admin= await Admin.findOne({_id});
    //4.get password from reques body
    const { oldpassword, newpassword1, newpassword2 } = req.body;

    //5. Check passwords
    const password = await bcrypt.compare(oldpassword, admin.password);
    if (!password) {
      throw new Error("The old password is wrong, correct it and try again");
    }
    if (newpassword1 !== newpassword2) {
      throw new Error("new password does not match" );
    }

    //6.hash password

    //update pass
    admin.password = newpassword1;
    await user.save();

    res.json({ message: "your password is updated successfully" });
  } catch (error) {
    throw new Error("Unable to change password",error );
  }

});





module.exports = {
loginAdmin,
updatedProfile,
forgotPasswordAdmin,
changePasswordAdmin,
resetPasswordAdmin
};