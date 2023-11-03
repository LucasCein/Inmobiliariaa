import { useState } from 'react'
import './App.css'
import Proveedor from './Components/Proveedor/Proveedor'
import Header from './Components/Header/Header'
import Sidebar from './Components/SideBar/SideBar'
import Home from './Components/Home/Home'
import { Navigate, Route, BrowserRouter, Routes, useNavigation } from 'react-router-dom'
import Properties from './Components/Properties/Properties'
import ComprobantesPago from './Components/ComprobantesPago/ComprobantesPago'
import Pagos from './Components/Pagos/Pagos'
import { MyProvider, ProvContext } from './Components/ProveedorContext/ProveedorContext'
import ProveedoresItem from './Components/Proveedor/ProveedoresItem'
import AbmComprobantes from './Components/AbmComprobantes/AbmComprobantes'
import ABMPagos from './Components/Pagos/ABMPagos'
import  Clientes  from './Components/Clientes/Clientes'
import Ventas from './Components/Ventas/Ventas'
import ABMVentas from './Components/Ventas/ABMVentas'
import Consultas from './Components/Consultas/Consultas'
function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <MyProvider >
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
              <Properties forSelect={""} />
            </div>
            }
          />
          <Route
            path='/proveedores'
            element={<div className='grid-container'>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
              <Proveedor forSelect={""} />
            </div>
            }
          />
          <Route
            path='/pagos'
            element={<div className='grid-container'>
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
              <Pagos />
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
            path='/abmComprobantes'
            element={<div className='grid-container'>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
              <AbmComprobantes />
            </div>
            }
          />
            <Route
            path='/ABMPagos'
            element={<div className='grid-container'>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
              <ABMPagos />
            </div>
            }
          />

          <Route
            path='/ABMVentas'
            element={<div className='grid-container'>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
              <ABMVentas />
            </div>
            }
          />

            <Route
            path='/Clientes'
            element={<div className='grid-container'>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
              <Clientes forSelect={""} />
            </div>
            }
          />

          <Route
            path='/Ventas'
            element={<div className='grid-container'>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
              <Ventas/>
            </div>
            }
          />
          <Route
            path='/Consultas'
            element={<div className='grid-container'>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
              <Consultas/>
            </div>
            }
          />
          <Route
            path='*'
            element={<Navigate to="/home"></Navigate>}
          />
        </Routes>
      </BrowserRouter>
    </MyProvider>
  )
}

export default App
