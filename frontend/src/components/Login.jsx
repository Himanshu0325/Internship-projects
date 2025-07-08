import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Cookies } from "react-cookie";
import Button from 'react-bootstrap/Button';
import { validateEmail } from "../utils/validateEmail";

import login from '../assets/login.avif'

const Login = React.memo(() => {
  const [errLine, setErrLine] = useState(null);
  const cookie = new Cookies();
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [isValid, setIsValid] = useState(null);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState({
    email: false,
    password: false,
  });

  const submit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);

    

    if (!form.email ) {
      setErrLine(false);
      setError({
        ...error,
        email: !form.email,
        password: !form.password
      });

      if (!form.password) {
      setError({
        ...error,
        email: !form.email,
        password: !form.password,
      });
      return;
    }
      return;
    }

    if(form.email){

      const emailValidationResult = validateEmail(form.email);
      setIsValid(emailValidationResult);
  
      if (!emailValidationResult) {
        console.log('inside if', emailValidationResult);
        setErrLine(true);

      }

      if(emailValidationResult){
         setErrLine(false);
        // Clear error line if email is valid
      }
      if (!form.password) {
        setError({
          ...error,
          password: !form.password,
        });
        return;
      }
    }

    // Sending data to the server
    await axios({
      method: 'POST',
      url: 'http://localhost:4000/api/v21/user/login',
      data: form
    })
      .then((res) => {
        console.log("Response from server:", res.data);

        setMsg(res.data.message);
        setIsMsgOpen(!isMsgOpen);

        const accessToken = res.data.tokens.accessToken;
        const refreshToken = res.data.tokens.refreshToken;
        console.log(accessToken, refreshToken);

        const options = {
          path: '/',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          secure: true,
        };
        cookie.set('accessToken', accessToken, options);
        cookie.set('refreshToken', refreshToken, options);

        console.log('cookies set');
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
        setMsg(error.response.data.message);
        setIsMsgOpen(!isMsgOpen);
      });
  };

  useEffect(() => {
    const accessToken = cookie.get('accessToken');
    if (accessToken) {
      location.replace('/home');
    }
  }, []);

  return (
    <div className="absolute w-screen h-screen flex items-center justify-center bg-blue-800">
      <div className="bg-white border w-[25rem] p-[1rem] items-center">
        <h2 className="text-2xl font-bold mb-8">Login</h2>
        <form className="flex flex-col" style={{ gap: '1rem' }}>
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
              }}
              onClick={() => { setError({ ...error, password: true }); }}
            />
            {error.password && (
              <div className={`${!form.password ? 'visible' : 'hidden'} text-[#d62626]`}>
                ! Password is required
              </div>
            )}
          </div>

          <Button 
            variant="dark" 
            size="sm" 
            className="self-center" 
            type="submit" 
            style={{ width: '8rem' }} 
            onClick={submit}
          >
            Login
          </Button>
        </form>

        <p className="flex text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="border-none text-[#0000FF] bg-white ml-1">
            Sign up
          </Link>
        </p>
      </div>

      <div className="w-[50%] h-full p-4 flex items-center justify-center">
        <img src={login} className="h-[75%] w-[75%]" alt="" />
      </div>

      <div className={`${isMsgOpen ? 'visible' : 'hidden'} h-screen w-screen absolute inset-0 bg-white bg-opacity-50 backdrop-blur-3xl z-40`} style={{ pointerEvents: 'auto' }}>
        <div className={`h-[15rem] w-[20rem] border border-black absolute top-[35%] left-[35%] bg-white flex flex-col items-center justify-center rounded-[1rem]`}>
          <p>{msg}</p>
          <Button 
            variant="dark" 
            size="sm" 
            className="self-center" 
            style={{ width: '8rem' }}
            onClick={() => {
              setIsMsgOpen(!isMsgOpen);
              const accessToken = cookie.get('accessToken');
              
              if (accessToken) {
                location.replace('/home');
              }
            }}
          >
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
});

export default Login;