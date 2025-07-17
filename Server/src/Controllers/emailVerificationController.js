import Mailer from "../Helper/mailer.js";
import { EmailVerificationToken } from "../Models/emailVerificationTokenModel.js";
import { User } from "../Models/userModel.js";
import { generateOTP } from "../Utils/OtpGeneration.js";

const emailVerificationToken = async (req , res) =>{
  try {

    console.log('generating otp');
    
    const{ VerifyingEmail }= req.body
    const code = generateOTP()
    console.log(VerifyingEmail , code);

    const ExistingToken = await EmailVerificationToken.findOne({email:VerifyingEmail})
    console.log(ExistingToken);
    

    if (ExistingToken) {
      console.log('Inside Exiting code');
      
      const code = ExistingToken.verificationCode
      const SendingMail = await Mailer(VerifyingEmail , code)

      return res.status(200).json({
        status: 200,
        message: "OTP Created Successfully",
        data: null,
        code: 200
      });
    }
    

    const emailVerificationToken = await EmailVerificationToken.create({
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

    const SendingMail = await Mailer(VerifyingEmail , code)
    
    

    // if (!SendingMail) {
    //   console.log('Sending mail failed');
      
    //   return res.status(500).json({
    //     status: 500,
    //     message: "Internal server error while sending Mail",
    //     data: null,
    //     code: 500
    //   });
    // }

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

const emailVerification = async (req,res)=>{
  try {
    const {email , otpCode}= req.body
    console.log(email);
    

    if (!email) {
      return res.status(401).json({
        status: 401,
        message: "All Feilds are required",
        data: null,
        code: 401
      });
    }

    const tokenObject = await EmailVerificationToken.findOne({email})
    console.log(tokenObject);
    

    if (!tokenObject) {
      console.error("Error finding token:",);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
        code: 500
      });
    }

    const verificationCode = tokenObject.verificationCode


    if (otpCode === verificationCode) {

      const user = await User.findOne({ email })

      user.isVerified = true;
      user.status = true;
      await user.save();

      return res.status(200).json({
        status: 200,
        message: 'OTP Matched',
        data: null,
        code: 200
      })
    }

    return res.status(400).json({
      status: 400,
      message:'OTP Matching Failed',
      data:null,
      code : 400
    })


    
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

export {emailVerificationToken , emailVerification}