import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Hero from './components/Hero.jsx'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Register from './components/Registration.jsx'
import OTPVerification from './components/Verify.jsx'
import { UpdateInformation } from './components/UpdateInformation.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "/",
        element: <Hero />,
      },
      {
        path: "/login",
        element: <Login/>,
      },
      {
        path: '/register',
        element: <Register/>
      },
      {
        path: '/verify',
        element: <OTPVerification/>
      },
      {
        path: '/home',
        element: <Home />
      }
    ]
  },
  {
    path: '/home/Update-Info',
    element: <UpdateInformation/>,
  }
]);


createRoot(document.getElementById('root')).render(
     
    <RouterProvider router={router} />
  
)
