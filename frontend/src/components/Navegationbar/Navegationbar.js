import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './Navegationbar.css';
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';

import SidebarMenu from 'react-bootstrap-sidebar-menu';

function Navegationbar() {

  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (<>
    <Navbar variant="dark" className="navbar">      
      <Container className='navbar-container'>
        <Navbar.Brand>
          <Link to="#" >
            <AiIcons.AiOutlineMenu onClick={showSidebar}/>
          </Link>
          <span>Medical predictions</span>
        </Navbar.Brand>
      </Container>
    </Navbar>
    
    <nav className={sidebar ? "nav-menu active": "nav-menu"}>
      {SidebarData.map((item, index) => {
        return(
          <li key={index} className={item.cName}>
            <Link to={item.path}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </li>
        )
      })}
    </nav>
  </>);
}

export default Navegationbar;

