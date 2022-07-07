/*import React from 'react';
//import Plot from 'react-plotly.js';
import BoxPlot from "../../components/Plots/BoxPlot";

function LaboratoryBoard({ features }) {

  const {examenes,tiempoExamenesPromedio,tiempoExamenesMaximo} = features[0]
  
  return (
    <div> LaboratoryBoard
      <BoxPlot props={[examenes, "Exams"]}></BoxPlot>
      <BoxPlot props={[tiempoExamenesPromedio, "Average time between exams"]}></BoxPlot>
      <BoxPlot props={[tiempoExamenesMaximo, "Maximum time between exams"]}></BoxPlot>
    </div>
  )
}

export default LaboratoryBoard
*/
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
import { useState, useEffect } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "../../variables/charts.js";

import Header from "../../components/Headers/Header.js";
import { useLocation } from 'react-router-dom';
import BoxPlot from "../../components/Plots/BoxPlot";
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

const LaboratoryBoard = (props) => {

  console.log("Cargo LaboratoryBoard");
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const { state } = useLocation();
  const [dataState, setDataState] = useState({});
  const {keywords_count, keywords_max ,date_diff_mean,date_diff_max} = state
  let outs_states =  {'maxTest':[true, null],'countTest':[true, null], 'examDate-avg':[true, null], 'examDate-max':[true, null]}
  //let showOuts = true
  //let outliers
  //let container = null;
  const [dropdownOpenMaxTest, setDropdownOpenMaxTest] = React.useState(false);
  const toggleMaxTest = () => setDropdownOpenMaxTest(prevState => !prevState);
  const [dropdownOpenCountTest, setDropdownOpenCountTest] = React.useState(false);
  const toggleCountTest = () => setDropdownOpenCountTest(prevState => !prevState);
  const test_names = {}


  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

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

  function convert_readable(name) {
    var words = name.match(/[A-Za-z0-9][a-z]*/g) || [];

    return words.map(capitalize).join(" ");
  }

  function capitalize(word) {
      return word.charAt(0).toUpperCase() + word.substring(1);
  }

  if (Object.keys(dataState).length !== 0){
    Object.keys(dataState.keywords_count).map(function (test) {
      test_names[test] = convert_readable(test)
    })
  }

  function handleChangeDropdown(plot_info){
    let root_drop
    let root_subt
    if (!root_drop && !root_subt) {
      root_drop = ReactDOMClient.createRoot(document.getElementById(plot_info[0]));
      root_subt = ReactDOMClient.createRoot(document.getElementById(plot_info[3]));
    }
    root_subt.render(
      <div id={plot_info[3]}>TOP TERMS FOR {plot_info[4]}</div>
    )
    root_drop.render(
      <div id={plot_info[0]}>
        <BoxPlot props={[plot_info[1], plot_info[2]]}></BoxPlot>
      </div>)
    root_drop = null
    root_subt = null
  }

  function showOutliers(plot_info){
    console.log('el-id', plot_info)
    let root
    if (!root) {
      root = ReactDOMClient.createRoot(document.getElementById(plot_info[0]));
    }
    outs_states[plot_info[0]] = outs_states[plot_info[0]] ? false : true
    //showOuts = showOuts ? false : true
    console.log('old', plot_info[1])
    Object.entries(plot_info[1]).map(([key, value]) => {
      if (!outs_states[plot_info[0]]) {
        outs_states[plot_info[1]] = value.fliers
        value.fliers = []
      } 
      else {
        value.fliers = outs_states[plot_info[1]]
      }
      root.render(
      <div id={plot_info[0]}>
        <BoxPlot props={[plot_info[1], plot_info[2]]}></BoxPlot>
      </div>)
    })
    console.log('new', plot_info[1])
    root = null
  }

  // Get the data
  //const {examenes,tiempoExamenesPromedio,tiempoExamenesMaximo} = features[0];
  //const {examenes,tiempoExamenesPromedio,tiempoExamenesMaximo} = this.props.location
  //<BoxPlot props={[examenes, {title: "Exams", bck_color:"rgba(23,41,77,1)", font_color:'white'}]} style = {{borderRadius: 10}}></BoxPlot>


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
                  <Col xl="9">
                    <h2 className="text-white mb-1">Max. Lab. Value by Test and Disease</h2>
                    <h6 className="text-uppercase text-light ls-1 mb-0">
                      <div id='maxTest-subt'>MAX LAB VALUE BY DISEASE FOR TEST {test_names["test1"]}</div>
                    </h6>
                  </Col>
                  <Col xl="3">
                    {Object.keys(dataState).length !== 0 && dataState.keywords_max !== undefined?
                      <Row className="align-items-center">
                        <Col xl='6'>
                          <div className="text-right">
                            <Button
                              color="primary"
                              onClick={() => showOutliers(["maxTest", dataState.keywords_max['test1'], {bck_color:"rgba(0,0,0,0)", font_color:'white'}])}
                              size="sm"
                            >
                              Outliers
                            </Button>
                          </div>
                        </Col>
                        <Col xl='6'>
                          <div className="text-right">
                            <Dropdown isOpen={dropdownOpenMaxTest} toggle={toggleMaxTest} size="sm">
                              <DropdownToggle caret>Tests</DropdownToggle>
                              <DropdownMenu size="sm" left='true'>
                                { Object.keys(dataState.keywords_max).map(function (test) {
                                  return(
                                    <div key={test}>
                                      <DropdownItem onClick={() => handleChangeDropdown(['maxTest', dataState.keywords_max[test], {bck_color:"rgba(0,0,0,0)", font_color:'white'},
                                      'maxTest-subt', test_names[test]])} dropdownvalue={test} size="sm">
                                        {test_names[test]}
                                      </DropdownItem>
                                    </div>
                                  )
                                })
                                }
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </Col>
                      </Row>
                      :
                      <></>
                    }
                  </Col>
                </Row>
              </CardHeader>
              {Object.keys(dataState).length !== 0 && dataState.keywords_max !== undefined ?
                <div>
                  <div id="maxTest">
                    <BoxPlot props={[dataState.keywords_max['test1'], {bck_color:"rgba(0,0,0,0)", font_color:'white'}]}></BoxPlot>
                  </div> 
                  <div class="bg-transparent card-header" style={{padding: "0.5rem 1.25rem 0.5rem"}}>
                    <h6 className="ls-1 mb-0 text-white">
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
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col xl="9">
                    <h2 className="mb-1">Count by Lab Test and Disease</h2>
                    <h6 className="text-uppercase text-muted ls-1 mb-0">
                      <div id='countTest-subt'>NUMBER OF TESTS BY DISEASE FOR TEST {test_names["test1"]}</div>
                    </h6>
                  </Col>
                  <Col xl="3">
                    {Object.keys(dataState).length !== 0 && dataState.keywords_count !== undefined ?
                      <Row className="align-items-center">
                        <Col xl='6'>
                          <div className="text-right">
                            <Button
                              color="primary"
                              onClick={() => showOutliers(["countTest", dataState.keywords_count['test1'], {bck_color:"rgba(0,0,0,0)"}])}
                              size="sm"
                            >
                              Outliers
                            </Button>
                          </div>
                        </Col>
                        <Col xl='6'>
                          <div className="text-right">
                            <Dropdown isOpen={dropdownOpenCountTest} toggle={toggleCountTest} size="sm">
                              <DropdownToggle caret>Tests</DropdownToggle>
                              <DropdownMenu size="sm" left='true'>
                                { Object.keys(dataState.keywords_count).map(function (test) {
                                  return(
                                    <div key={test}>
                                      <DropdownItem onClick={() => handleChangeDropdown(['countTest', dataState.keywords_count[test], {bck_color:"rgba(0,0,0,0)"},
                                      'countTest-subt', test_names[test]])} dropdownvalue={test} size="sm">
                                        {test_names[test]}
                                      </DropdownItem>
                                    </div>
                                  )
                                })
                                }
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </Col>
                      </Row>
                      :
                      <></>
                    }
                  </Col>
                </Row>
              </CardHeader>
              {Object.keys(dataState).length !== 0 && dataState.keywords_count !== undefined ?
                <div>
                  <div id="countTest">
                    <BoxPlot props={[dataState.keywords_count['test1'], {bck_color:"rgba(0,0,0,0)"}]}></BoxPlot> 
                  </div> 
                  <div class="bg-transparent card-header" style={{padding: "0.5rem 1.25rem 0.5rem"}}>
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
        <Row className="mt-5">
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col xl="10">
                    <h2 className="mb-1">Average Time vs. Type of Disease</h2>
                    <h6 className="text-uppercase text-muted ls-1 mb-0">
                      AVERAGE TIME BETWEEN EXAMS PER EACH TYPE OF DISEASE
                    </h6>
                  </Col>
                  <Col xl="2">
                    {Object.keys(dataState).length !== 0 && dataState.date_diff_mean !== undefined ?
                      <div className="text-right">
                        <Button
                          color="primary"
                          onClick={() => showOutliers(["examDate-avg", dataState.date_diff_mean, {bck_color:"rgba(0,0,0,0)"}])}
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
              {Object.keys(dataState).length !== 0 && dataState.date_diff_mean !== undefined ?
                <div>
                  <div id="examDate-avg">
                    <BoxPlot props={[dataState.date_diff_mean, {bck_color:"rgba(0,0,0,0)"}]}></BoxPlot>  
                  </div> 
                  <div class="bg-transparent card-header" style={{padding: "0.5rem 1.25rem 0.5rem"}}>
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
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card className="shadow">
            <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col xl="10">
                    <h2 className="mb-1">Maximum Time vs. Type of Disease</h2>
                    <h6 className="text-uppercase text-muted ls-1 mb-0">
                      MAXIMUM TIME BETWEEN EXAMS PER EACH TYPE OF DISEASE
                    </h6>
                  </Col>
                  <Col xl="2">
                    {Object.keys(dataState).length !== 0 && dataState.date_diff_max !== undefined ?
                      <div className="text-right">
                        <Button
                          color="primary"
                          onClick={() => showOutliers(["examDate-max", dataState.date_diff_max, {bck_color:"rgba(0,0,0,0)"}])}
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
              {Object.keys(dataState).length !== 0 && dataState.date_diff_max !== undefined ?
                <div>
                  <div id="examDate-max">
                    <BoxPlot props={[dataState.date_diff_max, {bck_color:"rgba(0,0,0,0)"}]}></BoxPlot>
                  </div>
                  <div class="bg-transparent card-header" style={{padding: "0.5rem 1.25rem 0.5rem"}}>
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

export default LaboratoryBoard;
