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
import React, { useState }from "react";
import { useLocation, Route, Routes, Navigate, Outlet } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import AdminFooter from "../components/Footers/AdminFooter.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

import routes from "../routes.js";
import routes_sidebar from "../routes_sidebar.js";
import Index from "../pages/Index.js";

const AdminLayout = (props) => {

  const mainContent = React.useRef(null);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("index");

  // const { path } = useMatch();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    // console.log(routes);
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.path}
            element={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes_sidebar}
        logo={{
          innerLink: "/home",
          imgSrc: "/icons/logo_2.webp",
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          // brandText={getBrandText(props.location.pathname)}
          brandText = "team24"
        />
        <Routes>
          {getRoutes(routes)}
          {/* <Route path="/index" element={<Index /> } /> */}
          {/* <Navigate from="*" to="/admin/index" /> */}
        </Routes> 

        {currentPage === "index"?
            // Dashboard
            // <Index/>
            <></>
          :
          // Prediction form
            <></>
        }
        

        <Container fluid className="bg-secondary" >
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default AdminLayout;
