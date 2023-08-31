import { useState } from 'react'
import './App.css'
import Header from './Components/Header/Header'
import Sidebar from './Components/SideBar/SideBar'
import Home from './Components/Home/Home'
import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import Properties from './Components/Properties/Properties'
import ComprobantesPago from './Components/ComprobantesPago/ComprobantesPago'
function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <BrowserRouter>

      <Routes>
        <Route
          path='/home'
          element={<div className='grid-container'>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <Home /></div>
          }
        />
        <Route
          path='/properties'
          element={<div className='grid-container'>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <Properties />
          </div>
          }
        />
        <Route
          path='/bill'
          element={<div className='grid-container'>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <ComprobantesPago />
          </div>
          }
        />
        <Route
          path='*'
          element={<Navigate to="/home"></Navigate>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
