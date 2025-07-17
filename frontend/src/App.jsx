import { useState , useEffect} from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { Outlet } from 'react-router-dom'
import './index.css'
import { io } from "socket.io-client";
import decryptObject from './utils/decryptObject.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Cookies } from 'react-cookie'







function App() {
  const cookie = new Cookies

  const accessToken = cookie.get('accesstoken')
  
   let id
  if (accessToken) {
      
    const encryptedData = localStorage.getItem('user');
    const decryptedData = decryptObject(encryptedData, import.meta.env.VITE_SECRET_KEY);
     id = decryptedData?._id;
     }




  useEffect(() => {
    if (!id) return;
    const socket = io("http://localhost:4000", {
      query: { userId: id }
    });

    socket.on("logout", () => {
      // Call your logout logic here
      LogOut();
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  return (
      <div className="w-[99vw]  bg-[#f5f5f5]" style={{overflow:'hidden'}}>
        <Navbar/>
        <Outlet/>
      </div>
   
  )
}

export default App
