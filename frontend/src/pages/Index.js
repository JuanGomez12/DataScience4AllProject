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

  const socio = {"Genero":{
    "Diabetes":{
        "hombres":40,
        "mujeres":60
      },
    "Syphilis":{
      "hombres":70,
      "mujeres":30
    }
    },
  "Edad":{
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
      "min":1,
      "q1":11,
      "med":16,
      "q3":46, 
      "max":61,
      "mean": 30,
      "sd": 20,
      "fliers": [0, -50, 85, 100 ]
    }
  },
  "EstadoCivil":{
      "Diabetes":{
        "soltero":12,
        "casado":32
      }
  },
  "TSangre":{
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
  const desease_type = {
    'A510': 'Primary genital Syph.',
    'A511': 'Primary anal Syph.',
    'A514': 'Other secondary Syph.',
    'A529': 'Late Syph, unspecif.',
    'A530': 'Latent Syph, unspecif. as early or late',
    'A539': 'Syphilis, unspecif.',
    'E109': 'Type 1 Diabetes M.',
    'E119': 'Type 2 Diabetes M.',
    'E149': 'Unspecif. Diabetes M.'
  }
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const { state } = useLocation();
  const [dataState, setDataState] = useState({});
  console.log('stat', state)
  //const {genero,edad,estadoCivil,tipoSangre} = state
  let outs_states =  {'Edad':[true, {}]} // idx 1 true if outliers are showing, idx 2 saves the outliers
  //console.log('Estado', state)

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  useEffect(() => {
    //console.log(state);
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
    //console.log('outs_states', outs_states)
    outs_states[plot_info[0]][0] = outs_states[plot_info[0]][0] ? false : true
    //showOuts = showOuts ? false : true
    console.log('old', plot_info[1])
    //console.log(outs_states)
    Object.entries(plot_info[1]).map(([key, value]) => {
      if (!outs_states[plot_info[0]][0]) {
        outs_states[plot_info[0]][1][key] = value.fliers
        value.fliers = []
        //console.log('outs_states_af', plot_info[1])
      } 
      else {
        value.fliers = outs_states[plot_info[0]][1][key]
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
              {Object.keys(dataState).length !== 0 ?
                <StackedBarPlot props={[dataState.Genero, {bck_color:"rgba(0,0,0,0)", font_color:'white'}]}></StackedBarPlot>
                :
                <CardHeader className="bg-transparent">
                  <h5 className="text-uppercase text-light ls-1 mb-0"> No data</h5>
                </CardHeader>
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
                    {Object.keys(dataState).length !== 0 ?
                      <div className="text-right">
                        <Button
                          color="primary"
                          onClick={() => showOutliers(["Edad", dataState.Edad, {bck_color:"rgba(0,0,0,0)"}])}
                          size="sm"
                        >
                          Outliers
                        </Button>
                      </div>
                      :
                      <></>
                    }
                  </Col>
                </Row>
              </CardHeader>
              {Object.keys(dataState).length !== 0 ?
                <div id="Edad">
                  <BoxPlot props={[dataState.Edad, {bck_color:"rgba(0,0,0,0)"}]}></BoxPlot>   
                </div> 
                :
                <CardHeader className="bg-transparent">
                  <h5 className="text-uppercase text-light ls-1 mb-0"> No data</h5>
                </CardHeader>
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
              {Object.keys(dataState).length !== 0 ?
                <StackedBarPlot props={[dataState.EstadoCivil, {bck_color:"rgba(0,0,0,0)"}]}></StackedBarPlot>
                :
                <CardHeader className="bg-transparent">
                  <h5 className="text-uppercase text-light ls-1 mb-0"> No data</h5>
                </CardHeader>
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
              {Object.keys(dataState).length !== 0 ?
                <StackedBarPlot props={[dataState.TSangre, {bck_color:"rgba(0,0,0,0)"}]}></StackedBarPlot>
                :
                <CardHeader className="bg-transparent">
                  <h5 className="text-uppercase text-light ls-1 mb-0"> No data</h5>
                </CardHeader>
              } 
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
