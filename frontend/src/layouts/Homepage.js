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
import React from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import { Container, Row, Card, CardTitle, CardText, CardGroup, CardBody, CardImg, CardSubtitle, Button, Col } from "reactstrap";

// core components
import HomepageNavbar from "../components/Navbars/HomepageNavbar";
import HomepageFooter from "../components/Footers/HomepageFooter";

import routes from "../routes";

const Homepage = (props) => {

  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/home") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div className="main-content" ref={mainContent}>
        <HomepageNavbar />
        <div className="header bg_gradient_personalized py-7 py-lg-8">

          <Container>
            <div className="header-body text-center">
              <Row className="justify-content-center">
                <div className="home_section">
                  <img src="/icons/icon_doctor.png" className="logo_home"></img>
                  <div className="title-home-section">
                    <h1 className="title_home">Doctor Disease</h1>
                    <span className="subtitle_home">The power of Data Science and Machine Learning applied to Health data</span>
                  </div>
                </div>
              </Row>
            </div>
          </Container>

        </div>

        <div className="header bg_white py-6 py-lg-8">
          <Container>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <h2 className="home-title-section">Background</h2>
                <p className="home-text-section">
                  “1 in 5 patients who read a note reported finding a mistake and 40% perceived the mistake as serious”.
                  Doctor Disease addresses this issue analyzing Electronic Health Records (EHR) provided by IQVIA to identify and
                  clean mistakes, extract relevant information and predict syphilis and diabetes diagnoses.
                </p>
              </Row>
            </div>
            <div className="header-body text-center">
              <Row className="justify-content-center">
                <h2 className="home-title-section">Methodology and Results</h2>
              </Row>
              <Row className="justify-content-center">
                <Col>
                  <img src="/icons/setting.png" className="home-icon-column"></img>
                  <h3 className="home-title-column">Feature Engineering</h3>
                  <p className="home-text-section">Find average and maximum differences between data for each patient</p>
                </Col>
                <Col>
                  <img src="/icons/natural-language-processing.png" className="home-icon-column"></img>
                  <h3 className="home-title-column">Data Preprocessing</h3>
                  <p className="home-text-section">
                    Normalize and scale numerical data, one-hot encode categories, 
                    and remove stop words, tokenize, and TDF-IF transform text
                  </p>
                </Col>
                <Col>
                  <img src="/icons/brain.png" className="home-icon-column"></img>
                  <h3 className="home-title-column">Model training</h3>
                  <p className="home-text-section">
                    80-20% train-test split
                  </p>
                </Col>
                <Col>
                  <img src="/icons/speed.png" className="home-icon-column"></img>
                  <h3 className="home-title-column">Optimize final model</h3>
                  <p className="home-text-section">
                    Oversampling, feature selection using Elastic Net and hyperparameter tuning using 5-fold CV
                  </p>
                </Col>
              </Row>
            </div>
          </Container>
        </div>

        <div className="header bg_gradient_personalized py-6 py-lg-8">
          <Container>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <h2 className="home-title-section light-text">About us</h2>
              </Row>
              <Row className="justify-content-center">
                <Col>
                  <img className="home-picture-team" src="img/members/charic.jpg"></img>
                  <h2 className="home-title-column light-text">Charic Farinango</h2>
                  <p className="home-text-column light-text">Computer Scientist, Software Developer and AI Enthusiast</p>
                </Col>
                <Col>
                  <img className="home-picture-team" src="img/members/jorge.jpeg"></img>
                  <h2 className="home-title-column light-text">Jorge Acevedo</h2>
                  <p className="home-text-column light-text">Electronic and Industrial Engineer</p>
                </Col>
                <Col>
                  <img className="home-picture-team" src="img/members/juan.jpeg"></img>
                  <h2 className="home-title-column light-text">Juan M Gómez</h2>
                  <p className="home-text-column light-text">Biomedical Engineer, Software Developer, and Data Scientist</p>
                </Col>
                <Col>
                  <img className="home-picture-team" src="img/members/santiago.jpg"></img>
                  <h2 className="home-title-column light-text">Santiago Garcia</h2>
                  <p className="home-text-column light-text">Systems Engineer, Web Developer and Assitant Professor</p>
                </Col>
              </Row>
            </div>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <Col>
                  <img className="home-picture-team" src="img/members/daniel.jpeg"></img>
                  <h2 className="home-title-column light-text">Daniel Montes</h2>
                  <p className="home-text-column light-text">Software Developer</p>
                </Col>
                <Col>
                  <img className="home-picture-team" src="img/members/cristian.png"></img>
                  <h2 className="home-title-column light-text">Cristian Prieto</h2>
                  <p className="home-text-column light-text">Systems Engineer</p>
                </Col>
                <Col>
                  <img className="home-picture-team" src="img/members/steven.jpeg"></img>
                  <h2 className="home-title-column light-text">Steven Ruiz</h2>
                  <p className="home-text-column light-text">Economist, Supply Chain Data Analyst</p>
                </Col>
              </Row>
            </div>
          </Container>
        </div>

        {/* Page content */}
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Routes>
              {getRoutes(routes)}
              {/* <Navigate from="*" to="/auth/login" /> */}
            </Routes>
          </Row>
        </Container>
      </div>
      <HomepageFooter />
    </>
  );
};

export default Homepage;
