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
  Card,
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

const Index = (props) => {

  const socio = {
    "genero":{
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
        "max":60
      },
      "Syphilis":{
        "min":1,
        "q1":11,
        "med":16,
        "q3":46, 
        "max":61
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
  }
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const { state } = useLocation();
  const [dataState, setDataState] = useState(socio);

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
  
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card className="bg-gradient-default shadow">
              {dataState?
                <StackedBarPlot props={[dataState.genero, {title:"Gender", bck_color:"rgba(23,41,77,1)", font_color:'white'}]}></StackedBarPlot>
                :
                <></>
              }
            </Card>
          </Col>
          <Col xl="6">
            <Card className="shadow" style={{padding: '0.5px'}}>
              {dataState?
                <BoxPlot props={[dataState.edad, {title: "Age"}]} style={{borderRadius: '5px'}}></BoxPlot>
                :
                <></>
              }
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card className="shadow" style={{padding: '0.5px'}}>
              {dataState?
                <StackedBarPlot props={[dataState.estadoCivil, {title:"Marital status"}]}></StackedBarPlot>
                :
                <></>
              }
            </Card>
          </Col>
          <Col xl="6">
            <Card className="shadow" style={{padding: '0.5px'}}>
              {dataState?
                <StackedBarPlot props={[dataState.tipoSangre, {title:"Blood type"}]}></StackedBarPlot>
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
