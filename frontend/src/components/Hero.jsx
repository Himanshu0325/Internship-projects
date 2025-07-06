import Button from 'react-bootstrap/Button';
import { Cookies } from 'react-cookie';
import { useEffect } from 'react';

export default function Hero() {
  const cookie = new Cookies

  useEffect(()=>{
      const accessToken= cookie.get('accessToken')
      if(accessToken){
        location.replace('/home')
      }
    },[])
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
        <p className="text-lg mb-8">This is a simple hero section.</p>
        <Button variant="outline-dark" 
        onClick={()=>{location.replace("/login")}}>Get Started</Button>
      </div>
    </div>
  );
}