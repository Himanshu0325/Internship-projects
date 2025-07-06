import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';

function withAuth(WrappedComponent) {
  const AuthComponent = (props) => {
    const cookie = new Cookies
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
      const token = cookie.get('accessToken');
      console.log("Token from cookies:", token);
      setIsLoggedIn(!!token); // true if token exists, false otherwise
    }, []);

    if (isLoggedIn === null) {
      // Optionally show a loading spinner
      return <div className='h-screen flex justify-center items-center'>Loading...</div>;
    }

    if (!isLoggedIn) {
     
      //redirecting user to login page if not logged in
      location.replace("/login");
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
}

export default withAuth;