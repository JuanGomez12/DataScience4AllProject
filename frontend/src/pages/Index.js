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
import { useState, useEffect } from "react";
// javascipt plugin for creating charts
import Chart from "chart.js";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
} from "../variables/charts.js";

import Header from "../components/Headers/Header.js";
import { useLocation } from 'react-router-dom';
import BoxPlot from "../components/Plots/BoxPlot";
import StackedBarPlot from "../components/Plots/StackedBarPlot";
import * as ReactDOMClient from 'react-dom/client';

const Index = (props) => {

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
      "sd": 20,
      "outliers": [0, -50, 85, 100 ]
    },
    "Syphilis":{
      "min":1,
      "q1":11,
      "med":16,
      "q3":46, 
      "max":61,
      "mean": 30,
      "sd": 20,
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
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const { state } = useLocation();
  const [dataState, setDataState] = useState(socio);
  //const {genero,edad,estadoCivil,tipoSangre} = state
  let outs_states =  {'edad':[true, null]}

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  useEffect(() => {
    console.log(state);
    if(state !== null){
      setDataState(state);
    }

    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  });

  function showOutliers(plot_info){
    let root
    if (!root) {
      root = ReactDOMClient.createRoot(document.getElementById(plot_info[0]));
    }
    outs_states[plot_info[0]] = outs_states[plot_info[0]] ? false : true
    //showOuts = showOuts ? false : true
    console.log('old', plot_info[1])
    Object.entries(plot_info[1]).map(([key, value]) => {
      if (!outs_states[plot_info[0]]) {
        outs_states[plot_info[1]] = value.outliers
        value.outliers = []
      } 
      else {
        value.outliers = outs_states[plot_info[1]]
      }
      root.render(<div id={plot_info[0]}>
                    <BoxPlot props={[plot_info[1], plot_info[2]]}></BoxPlot>
                  </div>)
    })
    console.log('new', plot_info[1])
    root = null
  }
  //<Card className="shadow" style={{padding: '0.5px'}}>
  //<StackedBarPlot props={[genero, {title:"Gender", bck_color:"rgba(23,41,77,1)", font_color:'white'}]}></StackedBarPlot>
  //BoxPlot props={[edad, {title: "Age"}]} style={{borderRadius: '5px'}}></BoxPlot>
  
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col xl="10">
                    <h2 className="text-white mb-1">Gender vs. Type of Disease</h2>
                    <h6 className="text-uppercase text-light ls-1 mb-0">
                      PROPORTIONS OF GENDERS PER TYPE OF DISEASE
                    </h6>
                  </Col>
                </Row>
              </CardHeader>
              {dataState?
                <StackedBarPlot props={[dataState.genero, {bck_color:"rgba(0,0,0,0)", font_color:'white'}]}></StackedBarPlot>
                :
                <></>
              }
            </Card>
          </Col>
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col xl="10">
                    <h2 className="mb-1">Age vs. Type of Disease</h2>
                    <h6 className="text-uppercase text-muted ls-1 mb-0">
                      DISTRIBUTIONS OF AGES PER TYPE OF DISEASE
                    </h6>
                  </Col>
                  <Col xl="2">
                    <div className="text-right">
                      <Button
                        color="primary"
                        onClick={() => showOutliers(["edad", dataState.edad, {bck_color:"rgba(0,0,0,0)"}])}
                        size="sm"
                      >
                        Outliers
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              {dataState?
                <div id="edad">
                  <BoxPlot props={[dataState.edad, {bck_color:"rgba(0,0,0,0)"}]}></BoxPlot>   
                </div> 
                :
                <></>
              }      
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col xl="10">
                    <h2 className="mb-1">Marital Status vs. Type of Disease</h2>
                    <h6 className="text-uppercase text-light ls-1 mb-0">
                      DISTRIBUTIONS OF MARITAL STATUS PER TYPE OF DISEASE
                    </h6>
                  </Col>
                </Row>
              </CardHeader>
              {dataState?
                <StackedBarPlot props={[dataState.estadoCivil, {bck_color:"rgba(0,0,0,0)"}]}></StackedBarPlot>
                :
                <></>
              } 
            </Card>
          </Col>
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col xl="10">
                    <h2 className="mb-0">Blood Type vs. Type of Disease</h2>
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      DISTRIBUTIONS OF BLOOD TYPES PER TYPE OF DISEASE
                    </h6>
                  </Col>
                </Row>
              </CardHeader>
              {dataState?
                <StackedBarPlot props={[dataState.tipoSangre, {bck_color:"rgba(0,0,0,0)"}]}></StackedBarPlot>
                :
                <></>
              } 
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
