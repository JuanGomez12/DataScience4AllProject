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
import { useState } from "react";
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
  console.log(state)
  const {examenes,tiempoExamenesPromedio,tiempoExamenesMaximo} = state
  let outs_states =  {'exam':[true, null], 'exam-avg':[true, null], 'exam-max':[true, null]}
  //let showOuts = true
  //let outliers
  //let container = null;


  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

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
                  <Col xl="10">
                    <h2 className="text-white mb-1">Exams vs. Type of Disease</h2>
                    <h6 className="text-uppercase text-light ls-1 mb-0">
                      DISTRIBUTIONS OF EXAMS PER TYPE OF DISEASE
                    </h6>
                  </Col>
                  <Col xl="2">
                    <div className="text-right">
                      <Button
                        color="primary"
                        onClick={() => showOutliers(["exam", examenes, {bck_color:"rgba(0,0,0,0)", font_color:'white'}])}
                        size="sm"
                      >
                        Outliers
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <div id="exam">
                <BoxPlot props={[examenes, {bck_color:"rgba(0,0,0,0)", font_color:'white'}]}></BoxPlot>
              </div>
            </Card>
          </Col>
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
                    <div className="text-right">
                      <Button
                        color="primary"
                        onClick={() => showOutliers(["exam-avg", tiempoExamenesPromedio, {bck_color:"rgba(0,0,0,0)"}])}
                        size="sm"
                      >
                        Outliers
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <div id="exam-avg">
                <BoxPlot props={[tiempoExamenesPromedio, {bck_color:"rgba(0,0,0,0)"}]}></BoxPlot>   
              </div>           
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
            <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col xl="10">
                    <h2 className="mb-1">Maximum Time between exams vs. Type of Disease</h2>
                    <h6 className="text-uppercase text-muted ls-1 mb-0">
                      DISTRIBUTIONS OF MAXIMUM TIME BETWEEN EXAMS PER EACH TYPE OF DISEASE
                    </h6>
                  </Col>
                  <Col xl="2">
                    <div className="text-right">
                      <Button
                        color="primary"
                        onClick={() => showOutliers(["exam-max", tiempoExamenesMaximo, {bck_color:"rgba(0,0,0,0)"}])}
                        size="sm"
                      >
                        Outliers
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <div id="exam-max">
                <BoxPlot props={[tiempoExamenesMaximo, {bck_color:"rgba(0,0,0,0)"}]}></BoxPlot>
              </div>
            </Card>
          </Col>
          
        </Row>
      </Container>
    </>
  );
};

export default LaboratoryBoard;
