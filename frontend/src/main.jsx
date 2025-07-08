import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './components/Auth.jsx'
import Hero from './components/Hero.jsx'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Register from './components/Registration.jsx'

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
        path: '/home',
        element: <Home />
      }
    ]
  },

]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
)
