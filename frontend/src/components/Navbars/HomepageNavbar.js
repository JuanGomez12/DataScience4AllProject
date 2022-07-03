/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const HomepageNavbar = () => {
  return (
    <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
      <Container className="px-4">
        <NavbarBrand to="/home" tag={Link}>
          <img
            alt="..."
            src="/icons/dd_white.png"
          />
        </NavbarBrand>
        <button className="navbar-toggler" id="navbar-collapse-main">
          <span className="navbar-toggler-icon" />
        </button>

        {/* Menu para dispositivos con menor tama;o de pantalla */}
        <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
          <div className="navbar-collapse-header d-md-none">
            <Row>
              <Col className="collapse-brand" xs="6">
                <Link to="/home">
                  <img
                    alt="..."
                    src="icons/logo_2.png"
                  />
                </Link>
              </Col>
              <Col className="collapse-close" xs="6">
                <button className="navbar-toggler" id="navbar-collapse-main">
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink className="nav-link-icon" to="/admin/index" tag={Link}>
                <i className="ni ni-planet" />
                <span className="nav-link-inner--text">Dashboard</span>
              </NavLink>
            </NavItem>
          </Nav>
        </UncontrolledCollapse>
        {/* Menu para dispositivos con menor tama;o de pantalla */}
        
      </Container>
    </Navbar>
  );
};

export default HomepageNavbar;
