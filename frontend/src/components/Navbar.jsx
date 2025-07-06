import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import Button from 'react-bootstrap/Button';
import logout from '../assets/logout.jpg'
import app from '../assets/app.png'

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const cookie = new Cookies


  function LogOut(params) {
        cookie.remove('accessToken')
        cookie.remove('refreshToken')
        location.reload()
      }

  const handleAuth = () => {
    
    if (!loggedIn) {
      location.assign('/login');

    }
    else {
      LogOut()
    }


  };

  useEffect(()=>{
    const accessToken = cookie.get('accessToken')

    if (accessToken) {
      setLoggedIn(true)
    }
    else {
      setLoggedIn(false)
    }
  })

  return (
    <nav className="  h-[4rem] w-screen flex justify-around bg-black  " >
      <div className="h-full flex">
        <div className="h-full ">
          <img className='h-full object-cover' src="https://cdn-icons-png.flaticon.com/128/831/831378.png" alt="" />
        </div>
        <div className="flex text-white items-center mt-2 " style={{fontFamily:'serif' , fontSize:'2rem'}}>
          <img
            src={app}
            alt="App"
            style={{ width: '3.5rem', height: '3.5rem', marginLeft: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }}
            />
            MyApp
        </div>
      </div>

      <div className="flex gap-8 items-center">
        <div className="w-[20rem] h-full ">
          <ul className='flex text-white w-full h-full gap-4 items-center' style={{listStyleType:'none'}}>
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
        </div>

  
        <Button variant="light" className="border border-gray-100"
          onClick={handleAuth}>
          {loggedIn ? ('Logout') : 'Login'}
          <img
            // src={loggedIn? logout : ''}
            src={logout}
            alt="logout"
            style={{ width: '1.2rem', height: '1.2rem', marginLeft: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }}
          />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;