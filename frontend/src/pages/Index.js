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
import PiePlot from "../components/Plots/PiePlot";
import * as ReactDOMClient from 'react-dom/client';
import axios from 'axios';

const Index = (props) => {

  const socio = {
    "Genero": {
      "Diabetes": {
        "hombres": 40,
        "mujeres": 60
      },
      "Syphilis": {
        "hombres": 70,
        "mujeres": 30
      }
    },
    "Edad": {
      "Diabetes": {
        "min": 0,
        "q1": 10,
        "med": 15,
        "q3": 45,
        "max": 60,
        "mean": 30,
        "sd": 20,
        "fliers": [0, -50, 85, 100]
      },
      "Syphilis": {
        "min": 1,
        "q1": 11,
        "med": 16,
        "q3": 46,
        "max": 61,
        "mean": 30,
        "sd": 20,
        "fliers": [0, -50, 85, 100]
      }
    },
    "EstadoCivil": {
      "Diabetes": {
        "soltero": 12,
        "casado": 32
      }
    },
    "TSangre": {
      "Diabetes": {
        "O+": 12,
        "AB": 32,
        "O-": 28,
        "A+": 10
      },
      "Syphilis": {
        "O+": 15,
        "AB": 30,
        "O-": 25,
        "A+": 20
      }
    },
    "condition_distribution": {
      "A51": { "Count": "3685", "Percentage": "2.63" },
      "A530": { "Count": "60587", "Percentage": "43.22" },
      "A539": { "Count": "49378", "Percentage": "35.23" },
      "E109": { "Count": "6278", "Percentage": "4.48" },
      "E119": { "Count": "17439", "Percentage": "12.44" },
      "E149": { "Count": "2808", "Percentage": "2.0" }
    },
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
  const socioGetAPI = "http://20.214.157.160:8000/api/socio_economics";
  //console.log('stat', state)
  //const {genero,edad,estadoCivil,tipoSangre} = state
  let outs_states = { 'Edad': [true, {}] } // idx 1 true if outliers are showing, idx 2 saves the outliers
  //console.log('Estado', state)

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  useEffect(() => {
    console.log('state', state);
    if (state !== null) {
      setDataState(state);
    } else {
      //setDataState(socio);
      getDataAPI();
    }

    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }, []);

  function getDataAPI() {
    let rpta
    axios.get(socioGetAPI)
      .then(res => {
        rpta = res.data
        setDataState(rpta)
        //console.log('rpta del API', rpta);
      })
      .catch(e => {
        //console.log(e);
        rpta = {}
      })
    return rpta
  }

  function showOutliers(plot_info) {
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
  //<Container className="mt-5 bg-secondary" fluid>
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7 bg-secondary" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col xl="10">
                    <h2 className="mb-1">Distribution of People with Type of Disease</h2>
                    <h6 className="text-muted ls-1 mb-0 text-xs">
                      Proportions of people diagnosed with a type of disease
                    </h6>
                  </Col>
                </Row>
              </CardHeader>
              {Object.keys(dataState).length !== 0 && dataState.condition_distribution !== undefined ?
                <div>
                  {/*<StackedBarPlot props={[dataState.condition_distribution, {bck_color:"rgba(0,0,0,0)"}]}></StackedBarPlot>*/}
                  <PiePlot props={[dataState.condition_distribution, { bck_color: "rgba(0,0,0,0)" }]}></PiePlot>
                  <div className="bg-transparent card-header" style={{ padding: "0.5rem 1.25rem 0.5rem" }}>
                    <h6 className="ls-1 mb-0">
                      <b>A510:</b> Primary genital Syph. <b>A511:</b> Primary anal Syph. <b>A514:</b> Other secondary Syph. <b>A529:</b> Late Syph, unspecif. <b>A530:</b> Latent Syph, unspecif. as early or late. <b>A539:</b> Syphilis, unspecif. <b>E109:</b> Type 1 Diabetes M. <b>E119:</b> Type 2 Diabetes M. <b>E149:</b> Unspecif. Diabetes M.
                    </h6>
                  </div>
                </div>
                :
                <CardHeader className="bg-transparent">
                  <h5 className="text-light ls-1 mb-0"> No data</h5>
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
                    <h2 className="mb-1">Gender vs. Type of Disease</h2>
                    <h6 className="text-muted ls-1 mb-0 text-xs">
                      Proportions of gender per type of disease
                    </h6>
                  </Col>
                </Row>
              </CardHeader>
              {Object.keys(dataState).length !== 0 ?
                <div>
                  <StackedBarPlot props={[dataState.Genero, { bck_color: "rgba(0,0,0,0)" }]}></StackedBarPlot>
                  <div className="bg-transparent card-header" style={{ padding: "0.5rem 1.25rem 0.5rem" }}>
                    <h6 className="ls-1 mb-0">
                      <b>A510:</b> Primary genital Syph. <b>A511:</b> Primary anal Syph. <b>A514:</b> Other secondary Syph. <b>A529:</b> Late Syph, unspecif. <b>A530:</b> Latent Syph, unspecif. as early or late. <b>A539:</b> Syphilis, unspecif. <b>E109:</b> Type 1 Diabetes M. <b>E119:</b> Type 2 Diabetes M. <b>E149:</b> Unspecif. Diabetes M.
                    </h6>
                  </div>
                </div>
                :
                <CardHeader className="bg-transparent">
                  <h5 className="text-light ls-1 mb-0"> No data</h5>
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
                    <h6 className="text-muted ls-1 mb-0 text-xs">
                      Distributions of ages per type of disease
                    </h6>
                  </Col>
                  <Col xl="2">
                    {Object.keys(dataState).length !== 0 ?
                      <div className="text-right">
                        <Button
                          color="primary"
                          onClick={() => showOutliers(["Edad", dataState.Edad, { bck_color: "rgba(0,0,0,0)" }])}
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
                <div>
                  <div id="Edad">
                    <BoxPlot props={[dataState.Edad, { bck_color: "rgba(0,0,0,0)", ytitle: "Age" }]}></BoxPlot>
                  </div>
                  <div className="bg-transparent card-header" style={{ padding: "0.5rem 1.25rem 0.5rem" }}>
                    <h6 className="ls-1 mb-0">
                      <b>A510:</b> Primary genital Syph. <b>A511:</b> Primary anal Syph. <b>A514:</b> Other secondary Syph. <b>A529:</b> Late Syph, unspecif. <b>A530:</b> Latent Syph, unspecif. as early or late. <b>A539:</b> Syphilis, unspecif. <b>E109:</b> Type 1 Diabetes M. <b>E119:</b> Type 2 Diabetes M. <b>E149:</b> Unspecif. Diabetes M.
                    </h6>
                  </div>
                </div>
                :
                <CardHeader className="bg-transparent">
                  <h5 className="text-light ls-1 mb-0"> No data</h5>
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
                    <h6 className="text-muted ls-1 mb-0 text-xs">
                      Distributions of marital status per type of disease
                    </h6>
                  </Col>
                </Row>
              </CardHeader>
              {Object.keys(dataState).length !== 0 ?
                <div>
                  <StackedBarPlot props={[dataState.EstadoCivil, { bck_color: "rgba(0,0,0,0)" }]}></StackedBarPlot>
                  <div className="bg-transparent card-header" style={{ padding: "0.5rem 1.25rem 0.5rem" }}>
                    <h6 className="ls-1 mb-0">
                      <b>A510:</b> Primary genital Syph. <b>A511:</b> Primary anal Syph. <b>A514:</b> Other secondary Syph. <b>A529:</b> Late Syph, unspecif. <b>A530:</b> Latent Syph, unspecif. as early or late. <b>A539:</b> Syphilis, unspecif. <b>E109:</b> Type 1 Diabetes M. <b>E119:</b> Type 2 Diabetes M. <b>E149:</b> Unspecif. Diabetes M.
                    </h6>
                  </div>
                </div>
                :
                <CardHeader className="bg-transparent">
                  <h5 className="text-light ls-1 mb-0"> No data</h5>
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
                    <h6 className="text-muted ls-1 mb-1 text-xs">
                      Distributions of blood types per type of disease
                    </h6>
                  </Col>
                </Row>
              </CardHeader>
              {Object.keys(dataState).length !== 0 ?
                <div>
                  <StackedBarPlot props={[dataState.TSangre, { bck_color: "rgba(0,0,0,0)" }]}></StackedBarPlot>
                  <div className="bg-transparent card-header" style={{ padding: "0.5rem 1.25rem 0.5rem" }}>
                    <h6 className="ls-1 mb-0">
                      <b>A510:</b> Primary genital Syph. <b>A511:</b> Primary anal Syph. <b>A514:</b> Other secondary Syph. <b>A529:</b> Late Syph, unspecif. <b>A530:</b> Latent Syph, unspecif. as early or late. <b>A539:</b> Syphilis, unspecif. <b>E109:</b> Type 1 Diabetes M. <b>E119:</b> Type 2 Diabetes M. <b>E149:</b> Unspecif. Diabetes M.
                    </h6>
                  </div>
                </div>
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
