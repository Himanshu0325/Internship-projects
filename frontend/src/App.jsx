import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { Outlet } from 'react-router-dom'
import './index.css'

import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const [count, setCount] = useState(0)

  return (
      <div className="w-[99vw]  bg-[#f5f5f5]" style={{overflow:'hidden'}}>
        <Navbar/>
        <Outlet/>
      </div>
   
  )
}

export default App
