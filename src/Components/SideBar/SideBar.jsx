import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";
import { NavLink } from "react-router-dom";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const sideBarItems = [
    {
      name: "Dashboard",
      icon: <BsGrid1X2Fill className="icon" />,
      path: "/home",
    },
    {
      name: "Propiedades",
      icon: <BsFillArchiveFill className="icon" />,
      path: "/properties",
    },
    {
      name: "Proveedores",
      icon: <BsFillGrid3X3GapFill className="icon" />,
      path: "/proveedores",
    },
    {
      name: "Pagos",
      icon: <BsFillGrid3X3GapFill className="icon" />,
      path: "/pagos",
    },
    {
      name: "Facturas",
      icon: <BsPeopleFill className="icon" />,
      path: "/bill",
    },
    {
      name: "Inventory",
      icon: <BsListCheck className="icon" />,
      path: "",
    },
    {
      name: "Reports",
      icon: <BsMenuButtonWideFill className="icon" />,
      path: "",
    },
    {
      name: "Setting",
      icon: <BsFillGearFill className="icon" />,
      path: "",
    },
  ];

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsCart3 className="icon_header" /> SHOP
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>
      <ul className="sidebar-list">
        {sideBarItems.map((item) => (
          <li className="sidebar-list-item" key={item.name}>
            <NavLink to={item.path}>
              {item.icon} {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
