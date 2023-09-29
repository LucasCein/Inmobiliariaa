
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill,BsCashCoin,BsFileEarmarkText, BsHouse}
 from 'react-icons/bs'
import { Link, NavLink } from 'react-router-dom'

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsCart3  className='icon_header'/> SHOP
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <NavLink to="/home">
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </NavLink>
            </li>
            <li className='sidebar-list-item'>
                <NavLink to={"/properties"}>
                    <BsHouse className='icon'/> Propiedades
                </NavLink>
            </li>
            <li className='sidebar-list-item'>
                <NavLink to={"/proveedores"}>
                    <BsFillGrid3X3GapFill className='icon'/> Proveedores
                </NavLink>
            </li>
            <li className='sidebar-list-item'>
                <NavLink to={"/pagos"}>
                    <BsCashCoin className='icon'/> Pagos
                </NavLink>
            </li>
            <li className='sidebar-list-item'>
                <NavLink to={"/bill"}>
                    <BsFileEarmarkText className='icon'/> Facturas
                </NavLink>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsListCheck className='icon'/> Inventory
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsMenuButtonWideFill className='icon'/> Reports
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="../Properties/Properties.jsx">
                    <BsFillGearFill className='icon'/> Setting
                </a>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar