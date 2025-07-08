import React, { useEffect, useState } from "react";
import { Link, replace } from "react-router-dom";
import axios from "axios";
import { useCookies, Cookies } from "react-cookie"
import Button from 'react-bootstrap/Button';
import { validateEmail } from "../utils/validateEmail";


const Auth = React.memo(() => {
  const [isLogin, setIsLogin] = useState(true) //variable in frontend to switch from login page to register page
  const [errLine , setErrLine] = useState(null)
  // const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);
  const cookie = new Cookies
  const [isMsgOpen, setIsMsgOpen] = useState(false)
  const [msg, setMsg] = useState(null)
  const [isValid , setIsValid] = useState(null)

  const [showSendOtp, setShowSendOtp] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    otp: ''
  });
   const [error, setError] = useState({
    fullName: false,
    userName: false,
    email: false,
    password: false,
  });

  const submit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);

    if (!isLogin) {
      if (!form.fullName || !form.userName || !form.email || form.password) {
        setError({
          fullName: !form.fullName,
          userName: !form.userName,
          email: !form.email,
          password: !form.password,
        });
        return;
      }
    }

    if (!form.email || !form.password) {
      setErrLine(false)
        setError({
          ...error,
          email: true,
          password: !form.password,
        });
        return;
      }

    

     const emailValidationResult = validateEmail(form.email);
      setIsValid(emailValidationResult);

      if ( !emailValidationResult ) {
        console.log('inside if', emailValidationResult);

        setErrLine(true)
        return
      }

      // Clear error line if email is valid
        setErrLine(false);

    // Sending data to the server
    await axios({
      method: 'POST',
      url: isLogin ? 'http://localhost:4000/api/v21/user/login' : 'http://localhost:4000/api/v21/user/register',
      data: form
    })
      .then((res) => {
        console.log("Response from server:", res.data);

        if (isLogin) {
          setMsg(res.data.message)
          setIsMsgOpen(!isMsgOpen)

          

          const accessToken = res.data.tokens.accessToken;
          const refreshToken = res.data.tokens.refreshToken;
          console.log(accessToken, refreshToken);

          const options = {
            path: '/',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            //httpOnly: true,
            secure: true,
          };
          cookie.set('accessToken', accessToken, options);
          cookie.set('refreshToken', refreshToken, options);

          console.log('cookies set');

          // location.replace('/home');

        }

        if (!isLogin) {
          setMsg(res.data.message)
          setIsMsgOpen(!isMsgOpen)
          setIsLogin(!isLogin)
        }

      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
        setMsg(error.response.data.message)
        setIsMsgOpen(!isMsgOpen)
      })
    
  };



  useEffect(() => {
    const accessToken = cookie.get('accessToken')
    if (accessToken) {
      location.replace('/home')
    }
  }, [])


  return (
    <div className="absolute w-screen h-screen flex items-center justify-center bg-blue-800">
      <div className="bg-white border w-[25rem] p-[1rem] items-center " style={{}}>
        <h2 className="text-2xl font-bold mb-8">
          {/* {isLogin ? 'Login' : 'Sign Up'} */}
          Login
          </h2>
        <form className=" flex flex-col " style={{ gap: '1rem' }} >
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
                 onClick={()=>{ setError({...error , fullName: true }) }}
              />
              { 
                error.fullName && (
                  <div className={`${!form.fullName && form.fullName !== undefined ? 'visible' : 'hidden'} text-[#d62626]`}>
                  ! Name is required
                   </div>
                )
              }
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
                 onClick={()=>{ setError({...error , userName: true }) }}
              />
              {
                error.userName && (
                  <div className={`${!form.userName && form.userName === '' ? 'visible' : 'hidden'} text-[#d62626]`}>
                    ! UserName is required
                  </div>
                )
              }
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
                setForm({ ...form, email: e.target.value })}}
              onClick={()=>{ setError({...error , email: true }) }}
            />
              {
                error.email && (
                  <div className={`${!form.email && form.email !== null ? 'visible' : 'hidden'} ${ !errLine ? 'visible' : 'hidden'} text-[#d62626]`}>
                ! Email is required
              </div>
                )
              }
              <div className={` ${ errLine ? 'visible' : 'hidden'} h-[1rem] w-[20rem] text-[#d62626]`}>
                 Invalid Email! Enter Correct email 
              </div>
           
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
              onClick={()=>{ setError({...error , password: true }) }}
            />
            {
                error.password && (
                  <div className={`${!form.password && form.password !== undefined ? 'visible' : 'hidden'} text-[#d62626]`}>
                    ! password is required
                  </div>
                )
              }
          </div>

          <Button variant="dark" size="sm" className="self-center " type='submit' style={{ width: '8rem' }} onClick={submit}>{isLogin ? 'Login' : 'Sign Up'}</Button>
        </form>

       
        <p className="flex text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button className="border-none text-[#0000FF] bg-white" onClick={() => {
            console.log(form,'*');
            
            const clearedForm = {
              fullName: '',
              userName: '',
              email: '',
              password: '',
            };

            setForm(clearedForm);
            console.log(form,'***');
            
            setError({
                fullName: false,
                userName: false,
                email: false,
                password: false,
              });
            setIsLogin(!isLogin)
  
            }}>
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>


      <div className={`${isMsgOpen ? 'visible' : 'hidden'} h-screen w-screen absolute inset-0 bg-white bg-opacity-50 backdrop-blur-3xl z-40`} style={{ pointerEvents: 'auto' }}>
        <div className={`h-[15rem] w-[20rem] border border-black absolute top-[35%] left-[35%] bg-white flex flex-col items-center justify-center rounded-[1rem]`}>
          <p>{msg}</p>
          <Button variant="dark" size="sm" className="self-center " style={{ width: '8rem' }}
            onClick={() => {
              setIsMsgOpen(!isMsgOpen)
              const accessToken = cookie.get('accessToken')
              
              if (accessToken) {
                location.replace('/home')
              }
            }} >Ok</Button>
        </div>
      </div>
    </div>


  );

})

export default Auth