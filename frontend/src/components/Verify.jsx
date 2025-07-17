import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from "crypto-js";

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [activeInput, setActiveInput] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // 'idle', 'verifying', 'success', 'error'
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [email , setEmail] = useState('')
  const emailfromUrl = searchParams.get('email')
  
  

  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
        setActiveInput(index + 1);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.slice(0, 4).split('');
    
    if (pasteArray.every(char => /^\d$/.test(char))) {
      const newOtp = [...otp];
      pasteArray.forEach((char, index) => {
        if (index < 4) newOtp[index] = char;
      });
      setOtp(newOtp);
      
      const nextIndex = Math.min(pasteArray.length, 3);
      inputRefs.current[nextIndex]?.focus();
      setActiveInput(nextIndex);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault()
    setVerificationStatus('verifying');
    console.log(email);
    
    const otpCode = otp.join('')
    await axios({
      method:'POST',
      url:'http://localhost:4000/api/v21/email-Verification/verify-otp',
      data:{email:email , otpCode: otpCode }
    })
    .then((res)=>{

      const Message = res.data.message
      
      if(Message === 'OTP Matched'){
        setVerificationStatus('success');
        setTimeout(()=>{
          location.replace('/login')
        },1500)
      }
      
    })
    .catch((error)=>{
      const Message = error.response.data.message
      if(Message === 'OTP Matching Failed'){
        setVerificationStatus('error');
        
         setTimeout(() => {
          setVerificationStatus('idle');
          setOtp(['', '', '', '']);
          inputRefs.current[0]?.focus();
          setActiveInput(0);
        }, 2000);
      }
    })

  };

  // const creatingActivityLog = async (NewUserId , action , OldUserdata) =>{
  //     console.log( id , NewUserId );
      
  //     try {
  //       await axios({
  //         method:'POST',
  //         url:'http://localhost:4000/api/v21/Activity-log/Activitylog',
  //         data:{
  //            id : id,
  //            tableName : 'UsersInfo',
  //            recordId : NewUserId,
  //            action : action,
  //            OldUserdata : OldUserdata
  //           }
  //       })
  //       .then((res)=>{
  //         console.log(res.data);
          
  //       })
  //     } catch (error) {
  //       console.log(error);
        
  //     }
  //   }

  const resendOTP = () => {
    setResendDisabled(true);
    setCountdown(30);
    setVerificationStatus('idle');
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
    setActiveInput(0);
    // Simulate resend API call
    console.log('Resending OTP...');
  };

  const GenerateOtp = async (VerifyingEmail)=>{
  
      await axios({
        method:'POST',
        url:'http://localhost:4000/api/v21/email-Verification/generate-otp',
        data: {VerifyingEmail:VerifyingEmail}
      })
        .then((res) => {
  
          if (res.data.message && res.data.message === 'OTP Created Successfully') {
            //  window.location.href = `/verify?email=${encodedEmail}`;
          }else{
            setMsg('Verification Failed Try Again')
            setIsMsgOpen(true)
          }
        })
    }

 const fetchAndDecryptEmail = (searchParams) => {
  let encryptedVerifyingMail = searchParams.get('VerifyingEmail');
  console.log(encryptedVerifyingMail);

  if (!encryptedVerifyingMail) {
    console.error('No encrypted email found');
    return null;
  }

  // Replace spaces with plus signs for valid base64 decoding
  encryptedVerifyingMail = encryptedVerifyingMail.replace(/ /g, '+');

  const decodedEmail = decodeURI(encryptedVerifyingMail) 
  console.log(decodedEmail);
  
  try {
    const bytes = CryptoJS.AES.decrypt(decodedEmail, import.meta.env.VITE_SECRET_KEY);
    // const bytes = CryptoJS.AES.decrypt(encryptedVerifyingMail, import.meta.env.VITE_SECRET_KEY)
    const decryptedEmail = bytes.toString(CryptoJS.enc.Utf8);

    if (decryptedEmail) {
      console.log('Decrypted email:', decryptedEmail);
      setEmail(decryptedEmail)
      return decryptedEmail;
    } else {
      console.error('Failed to decrypt email');
      return null;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

useEffect(() => {
  const decryptedEmail = fetchAndDecryptEmail(searchParams);

  if (decryptedEmail) {
    console.log('Running GenerateOtp');
    GenerateOtp(decryptedEmail);
  }
}, [searchParams]);

  return (
    <div className="bg-[#ffffff] rounded-[0.75rem] shadow-lg p-[2rem] h-max w-full animate-fade-in flex flex-col items-center">
      <div className="text-center mb-[1rem] w-[12rem]">
        <img 
          src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/81ee4a1e-3e33-4617-a889-b4a0f6070862.png" 
          alt="Secure lock icon representing OTP protection" 
          className="w-full h-full object-cover mx-auto mb-[1rem] rounded-[100%] bg-[#dbeafe] p-[1rem]"
        />
        <h1 className="text-[1.5rem] font-bold text-[#1f2937] mb-[0.5rem]">Verify Your Identity</h1>
        <p className="text-[#6b7280] text-[1rem] leading-[1.5rem]">
         { `We've sent a 4-digit code to your ${email}` }
        </p>
      </div>
      
      <div className="flex gap-[1rem] mb-[1rem]" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}

            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => setActiveInput(index)}
            ref={(el) => (inputRefs.current[index] = el)}
            className={`w-[3.5rem] h-[3.5rem] text-center text-[1.5rem] font-semibold border-[0.125rem] rounded-[0.5rem] transition-all duration-200 outline-none ${
              index === activeInput 
                ? 'ring-[0.125rem] ring-[#60a5fa] border-[#3b82f6]' 
                : 'border-[#d1d5db] hover:border-[#9ca3af]'
            } ${
              verificationStatus === 'error' 
                ? 'border-[#ef4444] ring-[0.125rem] ring-[#fecaca]' 
                : ''}`}
            style={{
              backgroundColor: verificationStatus === 'error' ? '#fef2f2' : '#ffffff'
            }}
            autoFocus={index === 0}
            disabled={verificationStatus === 'verifying' || verificationStatus === 'success'}
          />
        ))}
      </div>
      
      {verificationStatus === 'verifying' && (
        <div className="flex justify-center mb-[1rem]">
          <div className="flex items-center">
            <svg className="animate-spin h-[1.25rem] w-[1.25rem] text-[#3b82f6] mr-[0.5rem]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-[#6b7280] text-[0.875rem]">Verifying...</span>
          </div>
        </div>
      )}
      
      {verificationStatus === 'success' && (
        <div className="bg-[#dcfce7] border border-[#22c55e] text-[#166534] px-[1rem] py-[0.75rem] rounded-[0.5rem] mb-[1rem] flex items-center justify-center text-[0.875rem] font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[1.25rem] w-[1.25rem] mr-[0.5rem]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verification successful! Redirecting...
        </div>
      )}
      
      {verificationStatus === 'error' && (
        <div className="bg-[#fef2f2] border border-[#f87171] text-[#dc2626] px-[1rem] py-[0.75rem] rounded-[0.5rem] mb-[1rem] flex items-center justify-center text-[0.875rem] font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[1.25rem] w-[1.25rem] mr-[0.5rem]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Invalid OTP. Please try again.
        </div>
      )}
      
      <div className="text-center mt-[1rem] w-full">
        <button
          onClick={handleVerify}
          disabled={otp.some(digit => digit === '') || verificationStatus === 'verifying'}
          className={` py-[0.75rem] px-[1rem] rounded-[0.5rem] font-medium transition duration-200 text-[1rem] ${
            otp.some(digit => digit === '') || verificationStatus === 'verifying'
              ? 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
              : 'bg-[#2563eb] text-[#ffffff] hover:bg-[#1d4ed8] active:bg-[#1e40af]'
          }`}
        >
          Verify
        </button>
      </div>
      
      <div className="text-center mt-[1rem] text-[0.875rem] text-[#6b7280]">
        Didn't receive the code?{' '}
        <button
          onClick={resendOTP}
          disabled={resendDisabled}
          className={`font-medium bg-transparent border-0 transition duration-200 ${
            resendDisabled 
              ? 'text-[#9ca3af] cursor-not-allowed' 
              : 'text-[#2563eb] hover:text-[#1d4ed8] active:text-[#1e40af]'
          }`}
        >
          {resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification