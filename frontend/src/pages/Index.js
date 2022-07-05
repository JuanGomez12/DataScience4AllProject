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
} from "../variables/charts.js";

import Header from "../components/Headers/Header.js";
import { useLocation } from 'react-router-dom';
import BoxPlot from "../components/Plots/BoxPlot";
import StackedBarPlot from "../components/Plots/StackedBarPlot";

const Index = (props) => {

  console.log("Cargo index");
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const { state } = useLocation();
  console.log(state)
  const {genero,edad,estadoCivil,tipoSangre} = state

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card className="bg-gradient-default shadow" style={{padding: '0.5px'}}>
              <StackedBarPlot props={[genero, {title:"Gender", bck_color:"rgba(23,41,77,1)", font_color:'white'}]}></StackedBarPlot>
            </Card>
          </Col>
          <Col xl="6">
            <Card className="shadow" style={{padding: '0.5px'}}>
            <BoxPlot props={[edad, {title: "Age"}]} style={{borderRadius: '5px'}}></BoxPlot>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card className="shadow" style={{padding: '0.5px'}}>
              <StackedBarPlot props={[estadoCivil, {title:"Marital status"}]}></StackedBarPlot>
            </Card>
          </Col>
          <Col xl="6">
            <Card className="shadow" style={{padding: '0.5px'}}>
              <StackedBarPlot props={[tipoSangre, {title:"Blood type"}]}></StackedBarPlot>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
