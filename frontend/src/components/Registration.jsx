import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Cookies } from "react-cookie";
import Button from 'react-bootstrap/Button';
import { validateEmail } from "../utils/validateEmail";
import { PasswordStrengthChecker } from "./passwordStrengthChecker";


import register from '../assets/register.webp'

const Register = React.memo(() => {
  const [errLine, setErrLine] = useState(null);
  const cookie = new Cookies();
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [VerifyingEmail , setVerifyingEmail] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    cpassword:'',
    otp: ''
  });

  const [error, setError] = useState({
    fullName: false,
    userName: false,
    email: false,
    password: false,
    cpassword:false,
    IsPassMatched:false
  });

  const submit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    

    // Validate all required fields for registration
    if (!form.fullName || !form.userName || !form.email || !form.password || !form.cpassword) {
      setErrLine(false)
      setError({
        fullName: !form.fullName,
        userName: !form.userName,
        email: !form.email,
        password: !form.password,
        cpassword: !form.cpassword,
      });
      if (form.email) {
        const emailValidationResult = validateEmail(form.email);
        setIsValid(emailValidationResult);
  
        if (!emailValidationResult) {
          setErrLine(true);
          return;
        }
      }
      return;
    }

    if (form.email) {
        const emailValidationResult = validateEmail(form.email);
        setIsValid(emailValidationResult);
  
        if (!emailValidationResult) {
          setErrLine(true);
          return;
        }
      }

    if( form.password !== form.cpassword){
      console.log('inside if');
      
      setError({
        ...error,
        IsPassMatched: true
      })
      console.log(error);
      
      return
    }else{
      setError({
        ...error,
        IsPassMatched: false
      })
    }

    // Clear error line if email is valid
    setErrLine(false);

    // Sending data to the server

    const formData = new FormData();
    formData.append("profileImg", form.profileImg);
    formData.append("fullName", form.fullName);
    formData.append("userName", form.userName);
    formData.append("email", form.email);
    formData.append("password", form.password);

    const x = formData.get('profileImg');
    console.log("Profile image file:", x);
    
    await axios({
      method: 'POST',
      url: 'http://localhost:4000/api/v21/user/register',
      data: formData
    })
      .then((res) => {
        console.log("Response from server:", res.data);

        setMsg(res.data.message);
        setIsMsgOpen(!isMsgOpen);
        console.log(res.data.data.email);
        
        setVerifyingEmail(res.data.data.email)


       

        setError({
          fullName: false,
          userName: false,
          email: false,
          password: false,
          cpassword: false,
          IsPassMatched:false,
        });
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
        setMsg(error.response.data.message);
        setIsMsgOpen(!isMsgOpen);
      });
  };

  // const GenerateOtp = async ()=>{

  //   await axios({
  //     method:'POST',
  //     url:'http://localhost:4000/api/v21/email-Verification/generate-otp',
  //     data: {VerifyingEmail:VerifyingEmail}
  //   })
  //     .then((res) => {

  //       if (res.data.message && res.data.message === 'OTP Created Successfully') {
  //         console.log('*****',res.data);
  //         console.log(VerifyingEmail);

  //          const encodedEmail = encodeURIComponent(VerifyingEmail);
  //          console.log(encodedEmail);
           
  //         //  window.location.href = `/verify?email=${encodedEmail}`;
  //       }else{
  //         setMsg('Verification Failed Try Again')
  //         setIsMsgOpen(true)
  //       }
  //     })
  // }

   const handlePasswordChange = (e) => {
    setForm({ ...form, password: e.target.value });
  };

  const handlePasswordStrengthChange = (strength) => {
    setPasswordStrength(strength);
  };

  useEffect(() => {
    const accessToken = cookie.get('accessToken');
    if (accessToken) {
      location.replace('/home');
    }
  }, []);

  return (
    <div className="absolute w-screen h-[90vh] flex items-center justify-center bg-blue-800">
      <div className="w-[50%] h-full p-4 flex items-center" 
      // style={{backgroundImage:`url(${register})` , backgroundSize: 'cover', backgroundPosition:'center'}}
      >
        <img src={register} alt="" />
      </div>
      <div className="bg-white border flex flex-col  p-[1rem]  border-black rounded-[1rem]">
        <h2 className="text-2xl font-bold mb-8">Sign Up</h2>
        <form className="flex flex-col" style={{ gap: '1rem' }}>
          
          <div className="flex gap-4">
            <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.fullName}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              onClick={() => { setError({ ...error, fullName: true }); }}
            />
            {error.fullName && (
              <div className={`${!form.fullName ? 'visible' : 'hidden'} text-[#d62626]`}>
                ! Name is required
              </div>
            )}
          </div>

          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
              UserName
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={form.userName}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              onClick={() => { setError({ ...error, userName: true }); }}
            />
            {error.userName && (
              <div className={`${!form.userName ? 'visible' : 'hidden'} text-[#d62626]`}>
                ! UserName is required
              </div>
            )}
          </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
              }}
              onClick={() => { setError({ ...error, email: true }); }}
            />
            {error.email && (
              <div className={`${!form.email ? 'visible' : 'hidden'} ${!errLine ? 'visible' : 'hidden'} text-[#d62626]`}>
                ! Email is required
              </div>
            )}
            <div className={`${errLine ? 'visible' : 'hidden'} h-[1rem] w-[20rem] text-[#d62626]`}>
              Invalid Email! Enter Correct email
            </div>
          </div>

          <div className="">
            <input type="file" name="" id="" onChange={(e) =>{
                setForm({...form , profileImg: e.target.files[0]})
                console.log(e.target.files[0] );
                
                }}/>
          </div>

          <div className="flex gap-4">
              
          <PasswordStrengthChecker
          password={form.password}
          onPasswordChange={handlePasswordChange}
          onStrengthChange={handlePasswordStrengthChange}
          showError={error.password}
          onFocus={() => { setError({ ...error, password: true }); }}
        />

           <div>
            <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="cpassword"
              name="password"
              value={form.cpassword}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => {
                setForm({ ...form, cpassword: e.target.value });
              }}
              onClick={() => { setError({ ...error, cpassword: true }); }}
            />
            {error.cpassword && (
              <div className={`${!form.cpassword ? 'visible' : 'hidden'} text-[#d62626]`}>
                ! Confirm Password is required
              </div>
            )}
            {error.IsPassMatched && (
              console.log(error.IsPassMatched),
              
              <div className={`${form.cpassword ? 'visible' : 'hidden'}  text-[#d62626]`}>
                ! Password must be same
              </div>
            )}
          </div>

          </div>

          

          <Button 
            variant="dark" 
            size="sm" 
            className="self-center" 
            type="submit" 
            style={{ width: '8rem' }} 
            onClick={submit}
          >
            Sign Up
          </Button>
        </form>

        <p className="flex self-center mx-auto my-4">
          Already have an account?{' '}
          <Link to="/login" className="border-none text-[#0000FF] bg-white ml-[0.25rem] "  style={{textDecoration:'none'}}>
            Login
          </Link>
        </p>
      </div>

      <div className={`${isMsgOpen ? 'visible' : 'hidden'} h-screen w-screen absolute inset-0 bg-white bg-opacity-50 backdrop-blur-3xl z-40`} style={{ pointerEvents: 'auto' }}>
        <div className={`h-[15rem] w-[20rem] border border-black absolute top-[35%] left-[35%] bg-white flex flex-col items-center justify-center rounded-[1rem]`}>
          <p>{msg}</p>
          <Button 
            variant="dark" 
            size="sm" 
            className="self-center" 
            style={{ width: '8rem' }}
            onClick={async () => {
              setIsMsgOpen(!isMsgOpen);
              // Redirect to login after successful registration
              if (msg && msg.includes('successfully')) {
                //  await GenerateOtp()
                const encriptedEmail = CryptoJS.AES.encrypt(VerifyingEmail, import.meta.env.VITE_SECRET_KEY).toString();
                const encodedEmail = encodeURIComponent(encriptedEmail)
                location.replace(`/verify?VerifyingEmail=${encodedEmail}`)
                console.log('**');
              }
            }}
          >
            {
              msg && msg.includes('successfully') ? 'Verify Email' : 'Try Again' 
            }
          </Button>
        </div>
      </div>

    </div>
  );
});

export default Register;