import React, { useEffect, useState } from "react";
import { Link, replace } from "react-router-dom";
import axios from "axios";
import {useCookies , Cookies} from "react-cookie"
import Button from 'react-bootstrap/Button';


const Auth = React.memo(() => {
  const [isLogin, setIsLogin] = useState(true) //variable in frontend to switch from login page to register page
  const [showOtpForm , setOtpForm] = useState(false)
  // const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);
  const cookie = new Cookies

  const [showSendOtp, setShowSendOtp] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    otp: ''
  });

  const submit =  async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // Sending data to the server
    await axios({
      method: 'POST',
      url: isLogin ? 'http://localhost:4000/api/v21/user/login' : 'http://localhost:4000/api/v21/user/register',
      data: form
    })
    .then((res) => {
      console.log("Response from server:", res.data);

      if (isLogin) {
        alert(res.data.message)
        const accessToken = res.data.tokens.accessToken;
        const refreshToken = res.data.tokens.refreshToken;
        console.log(accessToken,refreshToken);
        
        const options = {
          path: '/',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          //httpOnly: true,
          secure: true,
        };
        cookie.set('accessToken', accessToken, options);
        cookie.set('refreshToken', refreshToken, options );

        console.log('cookies set');
        
        location.replace('/home');
        
      }

      if (!isLogin){
        setIsLogin(!isLogin)
        alert(res.data.message)
      }
      
    })
    .catch((error)=>{
      console.error("There was an error submitting the form!", error);
      alert(error.response.data.message)
    })

  };

  useEffect(()=>{
    const accessToken= cookie.get('accessToken')
    if(accessToken){
      location.replace('/home')
    }
  },[])


  return (
    <div className="absolute w-screen h-screen flex items-center justify-center bg-blue-800">
      <div className="bg-white border w-[25rem] p-[1rem] items-center " style={{  }}>
        <h2 className="text-2xl font-bold mb-8">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form className=" flex flex-col " style={{gap:'1rem'}} >
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                UserName
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
              />
            </div>
          )}


          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 ">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => {
                setForm({ ...form, email: e.target.value })
                 setShowSendOtp(e.target.value.length > 5);
              }}
              // onKeyDown={()=>{
              //   setOtpForm(!showOtpForm)
              // }}
            />
            {!isLogin && (

              <div className={`${showOtpForm? 'visible' : 'hidden'}`}>
              <button >Send OTP</button>
            </div>
            )}
            
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => { setForm({ ...form, password: e.target.value }) }
              }
            />
          </div>
          
          <Button variant="dark" size="sm" className="self-center " type='submit' style={{width:'8rem'}} onClick={submit}>{isLogin ? 'Login' : 'Sign Up'}</Button>
        </form>

        <p className="flex text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button className="border-none text-[#0000FF] bg-white" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
})

export default Auth