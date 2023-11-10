
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill,BsCashCoin,BsFileEarmarkText, BsHouse, BsFillPersonFill,BsCurrencyDollar, BsQuestionCircle, BsFillPersonLinesFill}
 from 'react-icons/bs'
import { Link, NavLink } from 'react-router-dom'

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsFillPersonLinesFill  className='icon_header '/> ADMIN
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
                <NavLink to={"/Clientes"}>
                    <BsFillPersonFill className='icon'/> Clientes
                </NavLink>
            </li>

            <li className='sidebar-list-item'>
                <NavLink to={"/Ventas"}>
                    <BsCurrencyDollar className='icon'/> Ventas
                </NavLink>
            </li>
            <li className='sidebar-list-item'>
                <NavLink to={"/Consultas"}>
                    <BsQuestionCircle className='icon'/> Consultas
                </NavLink>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar