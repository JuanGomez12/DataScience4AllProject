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
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import axios from 'axios'

const Header = (props) => {

  //const [dataSelected, setDataSelected] = useState();
  const labs = {
    "keywords_count":{
      "test1": {
        "Diabetes":{
          "min":0,
          "q1":10,
          "med":15,
          "q3":45, 
          "max":60,
          "mean": 20,
          "sd": 10,
          "fliers": [150, -5]
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
        },
      },
      "test2": {
        "Diabetes":{
          "min":20,
          "q1":30,
          "med":35,
          "q3":65, 
          "max":80,
          "mean": 40,
          "sd": 30,
          "fliers": [130, 90]
        },
        "Syphilis":{
          "min":10,
          "q1":21,
          "med":26,
          "q3":56, 
          "max":71,
          "mean": 30,
          "sd": 20,
          "fliers": [0, -40, -85 ]
        },
      }
    },
    "keywords_max": {
      "test1":{
        "Diabetes":{
          "min":0,
          "q1":10,
          "med":15,
          "q3":45, 
          "max":60,
          "mean": 30,
          "sd": 20,
          "fliers": [-10, 90, -25 ]
      }
      }
    },
    "date_diff_mean": {
      "Diabetes":{
        "min":0,
        "q1":10,
        "med":15,
        "q3":45, 
        "max":60,
        "mean": 30,
        "sd": 20,
        "fliers": [-20, 95, 130 ]
      }
    },
  "date_diff_max": {
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
      "fliers": [-10, -20, 100, 150 ]}
    },
  "exam_count_time_series":{
    'A530':{80: {'Count': '18', 'Date': '2019-01-01'},
      87: {'Count': '18', 'Date': '2019-02-01'},
      97: {'Count': '13', 'Date': '2019-04-01'},
      104: {'Count': '13', 'Date': '2019-05-01'},
      112: {'Count': '1', 'Date': '2019-06-01'},
      146: {'Count': '23', 'Date': '2019-11-01'}},
    'A510':{80: {'Count': '30', 'Date': '2019-01-01'},
      87: {'Count': '25', 'Date': '2019-02-01'},
      97: {'Count': '5', 'Date': '2019-04-01'},
      104: {'Count': '15', 'Date': '2019-05-01'},
      112: {'Count': '24', 'Date': '2019-06-01'},
      146: {'Count': '30', 'Date': '2019-11-01'}}
    },
    "top_lab_names": {
      "A510": {"bilirrubina test": {"Count": "14", "Percentage": "2.0"},
        "colesterol test": {"Count": "804", "Percentage": "91.0"}, 
        "coloracion acido alcohol resis...": {"Count": "1", "Percentage": "0.0"}, 
        "hematocrito": {"Count": "9", "Percentage": "1.0"}, 
        "hepatitis b test": {"Count": "35", "Percentage": "4.0"}
      },
      "A511": {"bilirrubina test": {"Count": "14", "Percentage": "2.0"},
        "colesterol test": {"Count": "810", "Percentage": "91.0"}, 
        "coloracion acido alcohol resis...": {"Count": "10", "Percentage": "0.0"}, 
        "hematocrito": {"Count": "19", "Percentage": "1.0"}, 
        "hepatitis b test": {"Count": "25", "Percentage": "4.0"}
      },
      "A514": {"bilirrubina test": {"Count": "14", "Percentage": "2.0"},
        "colesterol test": {"Count": "804", "Percentage": "91.0"}, 
        "coloracion acido alcohol resis...": {"Count": "1", "Percentage": "0.0"}, 
        "hematocrito": {"Count": "9", "Percentage": "1.0"}, 
        "hepatitis b test": {"Count": "35", "Percentage": "4.0"}
      },
      "A529": {"bilirrubina test": {"Count": "14", "Percentage": "2.0"},
        "colesterol test": {"Count": "810", "Percentage": "91.0"}, 
        "coloracion acido alcohol resis...": {"Count": "10", "Percentage": "0.0"}, 
        "hematocrito": {"Count": "19", "Percentage": "1.0"}, 
        "hepatitis b test": {"Count": "25", "Percentage": "4.0"}
      },
      "A539": {"bilirrubina test": {"Count": "14", "Percentage": "2.0"},
        "colesterol test": {"Count": "804", "Percentage": "91.0"}, 
        "coloracion acido alcohol resis...": {"Count": "1", "Percentage": "0.0"}, 
        "hematocrito": {"Count": "9", "Percentage": "1.0"}, 
        "hepatitis b test": {"Count": "35", "Percentage": "4.0"}
      },
      "A109": {"bilirrubina test": {"Count": "14", "Percentage": "2.0"},
        "colesterol test": {"Count": "810", "Percentage": "91.0"}, 
        "coloracion acido alcohol resis...": {"Count": "10", "Percentage": "0.0"}, 
        "hematocrito": {"Count": "19", "Percentage": "1.0"}, 
        "hepatitis b test": {"Count": "25", "Percentage": "4.0"}
      },
      "A119": {"bilirrubina test": {"Count": "14", "Percentage": "2.0"},
        "colesterol test": {"Count": "804", "Percentage": "91.0"}, 
        "coloracion acido alcohol resis...": {"Count": "1", "Percentage": "0.0"}, 
        "hematocrito": {"Count": "9", "Percentage": "1.0"}, 
        "hepatitis b test": {"Count": "35", "Percentage": "4.0"}
      },
      "A149": {"bilirrubina test": {"Count": "14", "Percentage": "2.0"},
        "colesterol test": {"Count": "810", "Percentage": "91.0"}, 
        "coloracion acido alcohol resis...": {"Count": "10", "Percentage": "0.0"}, 
        "hematocrito": {"Count": "19", "Percentage": "1.0"}, 
        "hepatitis b test": {"Count": "25", "Percentage": "4.0"}
      }
  }
  };
  const socio = {
    "condition_distribution": {
      "A51": {"Count": "3685", "Percentage": "2.63"},
      "A530": {"Count": "60587", "Percentage": "43.22"}, 
      "A539": {"Count": "49378", "Percentage": "35.23"}, 
      "E109": {"Count": "6278", "Percentage": "4.48"}, 
      "E119": {"Count": "17439", "Percentage": "12.44"}, 
      "E149": {"Count": "2808", "Percentage": "2.0"}
    },
    "Edad": {
        "A510": {
            "cihi": "35.65297375025808",
            "cilo": "34.34702624974192",
            "fliers": [
                "67",
                "69"
            ],
            "iqr": "13.0",
            "mean": "37.349027635619244",
            "med": "35.0",
            "q1": "29.0",
            "q3": "42.0",
            "whishi": "58",
            "whislo": "18"
        },
        "A511": {
            "cihi": "31.428997034939457",
            "cilo": "26.571002965060543",
            "fliers": [],
            "iqr": "15.0",
            "mean": "35.223404255319146",
            "med": "29.0",
            "q1": "28.0",
            "q3": "43.0",
            "whishi": "43",
            "whislo": "26"
        },
        "A514": {
            "cihi": "33.42990737601376",
            "cilo": "32.57009262398624",
            "fliers": [
                "65",
                "76"
            ],
            "iqr": "14.0",
            "mean": "36.28194338179036",
            "med": "33.0",
            "q1": "29.0",
            "q3": "43.0",
            "whishi": "64",
            "whislo": "19"
        },
        "A529": {
            "cihi": "36.74282384108431",
            "cilo": "35.25717615891569",
            "fliers": [],
            "iqr": "21.0",
            "mean": "40.96040609137056",
            "med": "36.0",
            "q1": "30.0",
            "q3": "51.0",
            "whishi": "81",
            "whislo": "20"
        },
        "A530": {
            "cihi": "37.12119009142526",
            "cilo": "36.87880990857474",
            "fliers": [
                "79",
                "80",
                "81",
                "82",
                "83",
                "87",
                "88",
                "90",
                "91",
                "92",
                "93",
                "94"
            ],
            "iqr": "19.0",
            "mean": "40.82992770607071",
            "med": "37.0",
            "q1": "31.0",
            "q3": "50.0",
            "whishi": "78",
            "whislo": "17"
        },
        "A539": {
            "cihi": "38.137002166915174",
            "cilo": "37.862997833084826",
            "fliers": [
                "78",
                "79",
                "80",
                "81",
                "82",
                "84",
                "86",
                "88",
                "89"
            ],
            "iqr": "19.0",
            "mean": "40.5874746878164",
            "med": "38.0",
            "q1": "30.0",
            "q3": "49.0",
            "whishi": "77",
            "whislo": "17"
        },
        "E109": {
            "cihi": "68.47555443740674",
            "cilo": "67.52444556259326",
            "fliers": [
                "19"
            ],
            "iqr": "24.0",
            "mean": "67.03376871615164",
            "med": "68.0",
            "q1": "57.0",
            "q3": "81.0",
            "whishi": "105",
            "whislo": "22"
        },
        "E119": {
            "cihi": "67.28534811656748",
            "cilo": "66.71465188343252",
            "fliers": [],
            "iqr": "24.0",
            "mean": "67.74152663875667",
            "med": "67.0",
            "q1": "56.0",
            "q3": "80.0",
            "whishi": "104",
            "whislo": "22"
        },
        "E149": {
            "cihi": "69.79995372462315",
            "cilo": "68.20004627537685",
            "fliers": [],
            "iqr": "27.0",
            "mean": "68.95441595441595",
            "med": "69.0",
            "q1": "56.0",
            "q3": "83.0",
            "whishi": "100",
            "whislo": "25"
        }
    },
    "EstadoCivil": {
        "A510": {
            "Casado": "4.53",
            "Desconocido": "22.65",
            "Divorciado": "0.0",
            "No reportado": "2.48",
            "Separado": "0.11",
            "Soltero": "63.75",
            "Union libre": "6.47",
            "Viudo/a": "0.0"
        },
        "A511": {
            "Casado": "0.0",
            "Desconocido": "0.0",
            "Divorciado": "0.0",
            "No reportado": "0.0",
            "Separado": "0.0",
            "Soltero": "100.0",
            "Union libre": "0.0",
            "Viudo/a": "0.0"
        },
        "A514": {
            "Casado": "1.92",
            "Desconocido": "26.09",
            "Divorciado": "0.0",
            "No reportado": "5.37",
            "Separado": "1.18",
            "Soltero": "57.85",
            "Union libre": "6.23",
            "Viudo/a": "1.37"
        },
        "A529": {
            "Casado": "1.27",
            "Desconocido": "22.15",
            "Divorciado": "0.37",
            "No reportado": "5.89",
            "Separado": "1.7",
            "Soltero": "66.76",
            "Union libre": "1.86",
            "Viudo/a": "0.0"
        },
        "A530": {
            "Casado": "3.83",
            "Desconocido": "18.72",
            "Divorciado": "0.07",
            "No reportado": "2.52",
            "Separado": "2.94",
            "Soltero": "64.35",
            "Union libre": "6.81",
            "Viudo/a": "0.76"
        },
        "A539": {
            "Casado": "3.98",
            "Desconocido": "20.09",
            "Divorciado": "0.21",
            "No reportado": "4.1",
            "Separado": "3.2",
            "Soltero": "60.93",
            "Union libre": "6.77",
            "Viudo/a": "0.71"
        },
        "E109": {
            "Casado": "28.15",
            "Desconocido": "10.42",
            "Divorciado": "0.67",
            "No reportado": "11.27",
            "Separado": "3.07",
            "Soltero": "27.79",
            "Union libre": "5.89",
            "Viudo/a": "12.75"
        },
        "E119": {
            "Casado": "23.67",
            "Desconocido": "12.66",
            "Divorciado": "0.49",
            "No reportado": "7.64",
            "Separado": "3.94",
            "Soltero": "31.07",
            "Union libre": "7.39",
            "Viudo/a": "13.12"
        },
        "E149": {
            "Casado": "17.01",
            "Desconocido": "19.2",
            "Divorciado": "0.04",
            "No reportado": "9.13",
            "Separado": "7.48",
            "Soltero": "26.73",
            "Union libre": "7.19",
            "Viudo/a": "13.22"
        }
    },
    "Genero": {
        "A510": {
            "Hombre": "100.0",
            "Mujer": "0.0"
        },
        "A511": {
            "Hombre": "100.0",
            "Mujer": "0.0"
        },
        "A514": {
            "Hombre": "91.62",
            "Mujer": "8.38"
        },
        "A529": {
            "Hombre": "99.85",
            "Mujer": "0.15"
        },
        "A530": {
            "Hombre": "92.69",
            "Mujer": "7.31"
        },
        "A539": {
            "Hombre": "93.03",
            "Mujer": "6.97"
        },
        "E109": {
            "Hombre": "57.58",
            "Mujer": "42.42"
        },
        "E119": {
            "Hombre": "59.47",
            "Mujer": "40.53"
        },
        "E149": {
            "Hombre": "58.9",
            "Mujer": "41.1"
        }
    },
    "TSangre": {
        "A510": {
            "A+": "5.94",
            "A-": "0.0",
            "AB+": "0.0",
            "AB-": "0.0",
            "B+": "5.94",
            "B-": "0.0",
            "O+": "74.5",
            "O-": "13.61"
        },
        "A511": {
            "A+": "0.0",
            "A-": "0.0",
            "AB+": "0.0",
            "AB-": "0.0",
            "B+": "0.0",
            "B-": "0.0",
            "O+": "100.0",
            "O-": "0.0"
        },
        "A514": {
            "A+": "5.76",
            "A-": "0.0",
            "AB+": "0.0",
            "AB-": "0.0",
            "B+": "0.89",
            "B-": "0.0",
            "O+": "88.36",
            "O-": "4.99"
        },
        "A529": {
            "A+": "11.5",
            "A-": "0.0",
            "AB+": "0.87",
            "AB-": "0.0",
            "B+": "10.77",
            "B-": "0.0",
            "O+": "76.27",
            "O-": "0.58"
        },
        "A530": {
            "A+": "13.37",
            "A-": "0.61",
            "AB+": "0.91",
            "AB-": "0.0",
            "B+": "3.95",
            "B-": "0.17",
            "O+": "79.36",
            "O-": "1.62"
        },
        "A539": {
            "A+": "7.83",
            "A-": "0.06",
            "AB+": "0.52",
            "AB-": "0.0",
            "B+": "2.49",
            "B-": "0.03",
            "O+": "88.24",
            "O-": "0.83"
        },
        "E109": {
            "A+": "18.24",
            "A-": "1.84",
            "AB+": "0.82",
            "AB-": "0.0",
            "B+": "6.52",
            "B-": "0.26",
            "O+": "69.21",
            "O-": "3.11"
        },
        "E119": {
            "A+": "20.72",
            "A-": "1.05",
            "AB+": "0.49",
            "AB-": "0.19",
            "B+": "3.53",
            "B-": "0.04",
            "O+": "72.06",
            "O-": "1.92"
        },
        "E149": {
            "A+": "17.13",
            "A-": "0.0",
            "AB+": "0.0",
            "AB-": "0.0",
            "B+": "7.12",
            "B-": "0.17",
            "O+": "74.98",
            "O-": "0.59"
        }
    }
};
   const notes = //{
    //"top_notes":
      {
      "E109": {
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
      "E119": {
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
      "A514": {
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
      "A510": {
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
  const socioGetAPI = "http://20.214.157.160:8000/api/socio_economics";
  const labsGetAPI = "http://20.214.157.160:8000/api/laboratory";
  const notesGetAPI = "http://20.214.157.160:8000/api/notes";
  const activeDash = useRef('');
  const [activeDash1, setActiveDash1] = useState('sociodemographic')
  //<CardBody onClick={() => changeData([socio, "sociodemographic"])}>
  //<CardBody onClick={() => getDataAPI(labsGetAPI, "laboratory")}></CardBody>

  function changeData(data){
    
    
    //console.log("Data changed to:", data[1]);
    //console.log("Rpta API a changeData:", data[0]);
    //setDataSelected(data);
    //setDataLabs(data[0])
    console.log('active_dash: ',activeDash.current)
    if (data[1] === "sociodemographic"){
      //activeDash.current = "sociodemographic"
      navigate('/admin/index', { state:   data[0]})
    }
    else if (data[1] === "laboratory"){
      //activeDash.current = "laboratory"
      navigate('/admin/labs', { state:  data[0]})
    }
    else if (data[1] === "notes"){
      //activeDash.current = "notes"
      navigate('/admin/notes', { state:  data[0]})
    }
  }


  function getDataAPI(url_api, group){
    let rpta

    activeDash.current = group
    setActiveDash1('group')
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
  //<div className="header pb-5 pt-5 pt-md-8">
  return (
    <>
      <div className="header pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody style={{ cursor: "pointer" }} onClick={() => getDataAPI(socioGetAPI, "sociodemographic")/*changeData([socio, "sociodemographic"])*/} className={activeDash1.current === 'sociodemographic' ? 'card-active' : ''}>
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
                  <CardBody style={{ cursor: "pointer" }} onClick={() => getDataAPI(labsGetAPI, "laboratory")/*/changeData([labs, "laboratory"])*/} className={activeDash.current === 'laboratory' ? 'card-active' : ''}> 
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
                  <CardBody style={{ cursor: "pointer" }} onClick={() => getDataAPI(notesGetAPI, "notes")/*changeData([notes, "notes"])*/} className={activeDash.current === 'notes' ? 'card-active' : ''}>
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
