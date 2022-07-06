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

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

const Header = (props) => {

  //const [dataSelected, setDataSelected] = useState();
  const labs = {"examenes":{
    "Diabetes":{
      "min":0,
      "q1":10,
      "med":15,
      "q3":45, 
      "max":60,
      "mean": 20,
      "sd": 10,
      "outliers": [100, 80]
    },
    "Syphilis":{
      "min":10,
      "q1":21,
      "med":26,
      "q3":56, 
      "max":71,
      "mean": 30,
      "sd": 20,
      "outliers": [0, -50, 85, 100 ]
    }
  },
  "tiempoExamenesPromedio": {
    "Diabetes":{
      "min":0,
      "q1":10,
      "med":15,
      "q3":45, 
      "max":60,
      "mean": 30,
      "sd": 20,
      "outliers": [0, -50, 85, 100 ]
    }
    },
  "tiempoExamenesMaximo": {
    "Diabetes":{
      "min":0,
      "q1":10,
      "med":15,
      "q3":45, 
      "max":60,
      "mean": 30,
      "sd": 20,
      "outliers": [0, -50, 85, 100 ]
    },
    "Syphilis":{
      "min":0,
      "q1":20,
      "med":36,
      "q3":50, 
      "max":80,
      "mean": 30,
      "sd": 20,
      "outliers": [0, -50, 85, 100 ]}
    }
  };
  const socio = {"genero":{
      "Diabetes":{
          "hombres":40,
          "mujeres":60
        },
      "Syphilis":{
        "hombres":70,
        "mujeres":30
      }
      },
    "edad":{
      "Diabetes":{
        "min":0,
        "q1":10,
        "med":15,
        "q3":45, 
        "max":60,
        "mean": 30,
        "sd": 1,
        "outliers": [0, -50, 85, 100 ]
      },
      "Syphilis":{
        "min":1,
        "q1":11,
        "med":16,
        "q3":46, 
        "max":61,
        "mean": 30,
        "sd": 40,
        "outliers": [0, -50, 85, 100 ]
      }
    },
    "estadoCivil":{
        "Diabetes":{
          "soltero":12,
          "casado":32
        }
    },
    "tipoSangre":{
        "Diabetes":{
          "O+":12,
          "AB":32,
          "O-":28,
          "A+":10
         },
         "Syphilis":{
          "O+":15,
          "AB":30,
          "O-":25,
          "A+":20
         }
      }
   };
  //const [dataLabs, setDataLabs] = useState([labs]);
  const navigate = useNavigate();

  function changeData(data){
    
    console.log("Data changed to:", data[1]);
    console.log("Data changed to:", data[0]);
    //setDataSelected(data);
    //setDataLabs(data[0])
    if (data[1] === "sociodemographic"){
      navigate('/admin/index', { state:  data[0]})
    }
    else if (data[1] === "laboratory"){
      navigate('/admin/labs', { state:  data[0]})
    }
    else if (data[1] === "notes"){
      navigate('/admin/notes', { state:  data[0]})
    }
  }

  return (
    <>
      <div className="header bg_gradient_personalized pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody onClick={() => changeData([socio, "sociodemographic"])}>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Sociodemographic
                        </CardTitle>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p> */}
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody onClick={() => changeData([labs, "laboratory"])}>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Laboratory
                        </CardTitle>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody onClick={() => changeData([labs, "notes"])}>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Medical Notes
                        </CardTitle>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
