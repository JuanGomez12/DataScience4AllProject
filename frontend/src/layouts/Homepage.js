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
import { Container, Row, Card, CardTitle, CardText, CardGroup, CardBody, CardImg, CardSubtitle, Button } from "reactstrap";

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
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <CardGroup>
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">
                        Background
                      </CardTitle>
                      <CardText>
                        “1 in 5 patients who read a note reported finding a mistake and 40% perceived the mistake as serious”.
                        <br />
                        Doctor Disease addresses this issue analyzing Electronic Health Records (EHR) provided by IQVIA to identify and clean mistakes, extract relevant information and predict syphilis and diabetes diagnoses.
                      </CardText>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">
                        Methodology and results
                      </CardTitle>
                      <CardText>
                        <ol type="1">
                          <li>Feature Engineering: Find average and maximum differences between data for each patient</li>
                          <li>Data Preprocessing: Normalize and scale numerical data, one-hot encode categories, and remove stop words, tokenize, and TDF-IF transform text</li>
                          <li>Model training and selection: 80-20% train-test split</li>
                          <li>Optimize final model (XGBoost): Oversampling, feature selection using Elastic Net and hyperparameter tuning using 5-fold CV</li>
                        </ol>
                      </CardText>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">
                        Highlighst
                      </CardTitle>
                      <CardText>
                        <ul>
                          <li>Identification and cleaning of mistakes in medical notes</li>
                          <li>XGBoost classification model with 88% of F1-score to distinguish between syphilis and diabetes diagnoses based on medical notes and patient info</li>
                        </ul>
                      </CardText>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Row>
            </div>

            <div>
              <h2>Team 24 Members</h2>
              <CardGroup>
                <Card>
                  <CardImg
                    alt="Jorge Acevedo"
                    src="img/members/jorge.jpeg"
                    top
                    width="100%"
                  />
                  <CardBody>
                    <CardTitle tag="h5">
                      Jorge Acevedo
                    </CardTitle>
                    <CardSubtitle
                      className="mb-2 text-muted"
                      tag="h6"
                    >
                      Card subtitle
                    </CardSubtitle>
                  </CardBody>
                </Card>
                <Card>
                  <CardImg
                    alt="Charic Farinango"
                    src="img/members/charic.jpg"
                    top
                    width="100%"
                  />
                  <CardBody>
                    <CardTitle tag="h5">
                    Charic Farinango
                    </CardTitle>
                    <CardSubtitle
                      className="mb-2 text-muted"
                      tag="h6"
                    >
                      Card subtitle
                    </CardSubtitle>
                  </CardBody>
                </Card>
                <Card>
                  <CardImg
                    alt="Juan M Gómez"
                    src="img/members/juan.jpg"
                    top
                    width="100%"
                  />
                  <CardBody>
                    <CardTitle tag="h5">
                    Juan M Gómez
                    </CardTitle>
                    <CardSubtitle
                      className="mb-2 text-muted"
                      tag="h6"
                    >
                      Card subtitle
                    </CardSubtitle>
                  </CardBody>
                </Card>
                <Card>
                  <CardImg
                    alt="Santiago Garcia"
                    src="img/members/santiago.png"
                    top
                    width="100%"
                  />
                  <CardBody>
                    <CardTitle tag="h5">
                    Santiago Garcia
                    </CardTitle>
                    <CardSubtitle
                      className="mb-2 text-muted"
                      tag="h6"
                    >
                      Card subtitle
                    </CardSubtitle>
                  </CardBody>
                </Card>
                <Card>
                  <CardImg
                    alt="Daniel Montes"
                    src="img/members/daniel.jpeg"
                    top
                    width="100%"
                  />
                  <CardBody>
                    <CardTitle tag="h5">
                    Daniel Montes
                    </CardTitle>
                    <CardSubtitle
                      className="mb-2 text-muted"
                      tag="h6"
                    >
                      Card subtitle
                    </CardSubtitle>
                  </CardBody>
                </Card>
                <Card>
                  <CardImg
                    alt="Cristian Prieto"
                    src="img/members/cristian.png"
                    top
                    width="100%"
                  />
                  <CardBody>
                    <CardTitle tag="h5">
                    Cristian Prieto
                    </CardTitle>
                    <CardSubtitle
                      className="mb-2 text-muted"
                      tag="h6"
                    >
                      Card subtitle
                    </CardSubtitle>
                  </CardBody>
                </Card>
                <Card>
                  <CardImg
                    alt="Steven Ruiz"
                    src="img/members/steven.jpeg"
                    top
                    width="100%"
                  />
                  <CardBody>
                    <CardTitle tag="h5">
                    Steven Ruiz
                    </CardTitle>
                    <CardSubtitle
                      className="mb-2 text-muted"
                      tag="h6"
                    >
                      Card subtitle
                    </CardSubtitle>
                  </CardBody>
                </Card>
              </CardGroup>
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
