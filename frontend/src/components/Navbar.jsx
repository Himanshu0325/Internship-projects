import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import Button from 'react-bootstrap/Button';
import logout from '../assets/logout.jpg'
import app from '../assets/app.png'
import ProfileCard from './ProfileCard';
import decryptObject from '../utils/decryptObject';

const Navbar = () => {
  const [profileData, setProfileData] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [refreshProfile, setRefreshProfile] = useState(0); // Add refresh trigger
  const cookie = new Cookies

  function LogOut() {
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

  const decrypting = () => {
    const encrypted = localStorage.getItem('user'); // Move this inside the function
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const decrypted = decryptObject(encrypted, secretKey);
    
    setProfileData(decrypted);
  }

  // Add function to handle profile updates
  const handleProfileUpdate = () => {
    setRefreshProfile(prev => prev + 1);
  };

  useEffect(() => {
    const accessToken = cookie.get('accessToken')
    
    if (accessToken) {
      setLoggedIn(true)
      decrypting()
    }
    else {
      setLoggedIn(false)
    }
    
  }, [refreshProfile]) // Remove encrypted dependency since it's now inside the function

  return (
    <nav className="  h-[4rem] w-screen flex justify-around bg-black   " >
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
        
        {!loggedIn ?
          <div className="justify-self-end flex items-center gap-2">
            <Button variant="light" className="border border-gray-100"
              onClick={handleAuth}>
              Login
              <img
                // src={loggedIn? logout : ''}
                src={logout}
                alt="logout"
                style={{ width: '1.2rem', height: '1.2rem', marginLeft: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }}
              />
            </Button>
          </div>
          :
          <div className="h-[3rem] w-[3rem] rounded-[100%] bg-white " onClick={()=>{setOpenProfile(!openProfile)}}>
            <img src={profileData.profileImg} className='h-full w-full object-cover rounded-[100%] ' alt="" />
          </div>
        }
        
      </div>
      
      <ProfileCard 
        handleAuth={handleAuth} 
        openProfile={openProfile} 
        setOpenProfile={setOpenProfile}
        onProfileUpdate={handleProfileUpdate}
      />
      
    </nav>
  );
};

export default Navbar;