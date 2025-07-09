import { EmailVerificationToken } from "../Models/emailVerificationTokenModel.js";
import { generateOTP } from "../Utils/OtpGeneration.js";

const emailVerification = async (req , res) =>{
  try {

    const{ VerifyingEmail }= req.body
    const code = generateOTP()
    console.log(VerifyingEmail , code);
    

    const emailVerificationToken = EmailVerificationToken.create({
      email : VerifyingEmail,
      verificationCode : code
    })

    if(!emailVerificationToken){
      res.status(400).json({
      status: 400,
      message: "OTP Creation Failed",
      data: null,
      code: 400
    });
    }

    console.log('OTP Created Successfully');
    
    res.status(200).json({
      status: 200,
      message: "OTP Created Successfully",
      data: null,
      code: 200
    });
    
  } catch (err) {
     console.error(err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
      code: 500
    });
  }
}

export {emailVerification}