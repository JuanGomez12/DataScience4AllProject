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
import axios from 'axios'

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
      "fliers": [100, 80]
    },
    "Syphilis":{
      "min":10,
      "q1":21,
      "med":26,
      "q3":56, 
      "max":71,
      "mean": 30,
      "sd": 20,
      "fliers": [0, -50, 85, 100 ]
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
      "fliers": [0, -50, 85, 100 ]
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
      "fliers": [0, -50, 85, 100 ]
    },
    "Syphilis":{
      "min":0,
      "q1":20,
      "med":36,
      "q3":50, 
      "max":80,
      "mean": 30,
      "sd": 20,
      "fliers": [0, -50, 85, 100 ]}
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
        "fliers": [0, -50, 85, 100 ]
      },
      "Syphilis":{
        "min":1,
        "q1":11,
        "med":16,
        "q3":46, 
        "max":61,
        "mean": 30,
        "sd": 40,
        "fliers": [0, -50, 85, 100 ]
      }
    },
    "estadoCivil":{
        "Diabetes":{
          "soltero":12,
          "casado":32
        }
    },
    "tipoSangre": {
      "DIABETES MELLITUS NOINSULINODEPENDIENTE SIN MENCION DE COMPLICACION": {
          "A+": "1521.0",
          "A-": "77.0",
          "AB+": "36.0",
          "AB-": "14.0",
          "B+": "259.0",
          "B-": "3.0",
          "O+": "5290.0",
          "O-": "141.0"
      },
      "DIABETES MELLITUS, NO ESPECIFICADA SIN MENCION DE COMPLICACION": {
          "A+": "202.0",
          "A-": "0.0",
          "AB+": "0.0",
          "AB-": "0.0",
          "B+": "84.0",
          "B-": "2.0",
          "O+": "884.0",
          "O-": "7.0"
      },
      "DIABETES MELLITUSINSULINODEPENDIENTE SIN MENCION DE COMPLICACION": {
          "A+": "487.0",
          "A-": "49.0",
          "AB+": "22.0",
          "AB-": "0.0",
          "B+": "174.0",
          "B-": "7.0",
          "O+": "1848.0",
          "O-": "83.0"
      },
      "OTRAS SIFILIS SECUNDARIAS": {
          "A+": "52.0",
          "A-": "0.0",
          "AB+": "0.0",
          "AB-": "0.0",
          "B+": "8.0",
          "B-": "0.0",
          "O+": "797.0",
          "O-": "45.0"
      },
      "SIFILIS GENITAL PRIMARIA": {
          "A+": "24.0",
          "A-": "0.0",
          "AB+": "0.0",
          "AB-": "0.0",
          "B+": "24.0",
          "B-": "0.0",
          "O+": "301.0",
          "O-": "55.0"
      },
      "SIFILIS LATENTE, NO ESPECIFICADA COMO PRECOZ O TARDIA": {
          "A+": "2453.0",
          "A-": "112.0",
          "AB+": "167.0",
          "AB-": "0.0",
          "B+": "725.0",
          "B-": "32.0",
          "O+": "14564.0",
          "O-": "298.0"
      },
      "SIFILIS PRIMARIA ANAL": {
          "A+": "0.0",
          "A-": "0.0",
          "AB+": "0.0",
          "AB-": "0.0",
          "B+": "0.0",
          "B-": "0.0",
          "O+": "1.0",
          "O-": "0.0"
      },
      "SIFILIS TARDIA, NO ESPECIFICADA": {
          "A+": "79.0",
          "A-": "0.0",
          "AB+": "6.0",
          "AB-": "0.0",
          "B+": "74.0",
          "B-": "0.0",
          "O+": "524.0",
          "O-": "4.0"
      },
      "SIFILIS, NO ESPECIFICADA": {
          "A+": "1271.0",
          "A-": "9.0",
          "AB+": "85.0",
          "AB-": "0.0",
          "B+": "404.0",
          "B-": "5.0",
          "O+": "14329.0",
          "O-": "135.0"
      }
  },

   };
   const notes = //{
    //"top_notes":
      {
      "DIABETES MELLITUS NOINSULINODEPENDIENTE SIN MENCION DE COMPLICACION": {
          "cede": "0.1504970067690268",
          "ebre": "0.19343970761029933",
          "enfermedades": "0.1229407660281712",
          "infeccion": "0.12152421440777647",
          "infecciones": "0.13866781089559702",
          "mas": "0.13777709167873153",
          "prevenir": "0.12340846646639902",
          "si": "0.20488948105853774",
          "sintomas": "0.12767002813287587",
          "transmision": "0.30475706351481113"
      },
      "DIABETES MELLITUS, NO ESPECIFICADA SIN MENCION DE COMPLICACION": {
          "cede": "0.21830790016148832",
          "dosis": "0.12521941018870142",
          "formulando": "0.13930652132198162",
          "medicamentos": "0.20540258445771867",
          "momento": "0.16022500301113976",
          "motivacion": "0.13538771066167074",
          "persistente": "0.1323664768961512",
          "segir": "0.13930652132198162",
          "sexual": "0.12521941018870142",
          "vida": "0.14971814011419865"
      },
      "OTRAS SIFILIS SECUNDARIAS": {
          "acetaminofen": "0.2088923887486686",
          "cede": "0.30766916749219797",
          "interna": "0.1730357808802786",
          "med": "0.25442942138585717",
          "motivacion": "0.20170160328722056",
          "nutricion": "0.17019525705996127",
          "persistente": "0.18950838264532688",
          "sexual": "0.15570373156662187",
          "tres": "0.18522427210053205",
          "vida": "0.21764048872893224"
      },
      "SIFILIS GENITAL PRIMARIA": {
          "cd": "0.18760013858114136",
          "diagnostico": "0.21743038819919713",
          "envian": "0.1864666172147405",
          "ficha": "0.19472039868430155",
          "ingreso": "0.19157551246253077",
          "programa": "0.1355336103229673",
          "proxima": "0.20032148924152293",
          "resultados": "0.14669295105733277",
          "ss": "0.14667396748350955",
          "trae": "0.17483356560559768"
      }
    //}
  }
  //const [dataLabs, setDataLabs] = useState([labs]);
  const navigate = useNavigate();
  const socioGetAPI = "http://20.214.241.33:8000/api/socio_economics";
  const labsGetAPI = "http://20.214.241.33:8000/api/laboratory";
  const notesGetAPI = "http://20.214.241.33:8000/api/notes";
  //<CardBody onClick={() => changeData([socio, "sociodemographic"])}>
  //<CardBody onClick={() => getDataAPI(labsGetAPI, "laboratory")}></CardBody>

  function changeData(data){
    
    
    //console.log("Data changed to:", data[1]);
    //console.log("Rpta API a changeData:", data[0]);
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


  function getDataAPI(url_api, group){
    let rpta
    axios.get(url_api)
    .then(res => {
      rpta = res.data
      changeData([rpta, group])
      //console.log('rpta del API', rpta);
    })
    .catch(e => {
      //console.log(e);
      rpta = {}
      changeData([rpta, group])
    })
    return rpta
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
                  <CardBody onClick={() => getDataAPI(socioGetAPI, "sociodemographic")}>
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
                  <CardBody onClick={() => getDataAPI(notesGetAPI, "notes")}>
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
