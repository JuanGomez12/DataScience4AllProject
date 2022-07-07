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
import BarPlot from "../../components/Plots/BarPlot";
import * as ReactDOMClient from 'react-dom/client';

const NotesBoard = (props) => {

  //console.log("Cargo notes");
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const {state}  = useLocation();
  const notes = state

  const [dropdownOpenDiab, setDropdownOpenDiab] = React.useState(false);
  const toggleDiab = () => setDropdownOpenDiab(prevState => !prevState);
  const [dropdownOpenSif, setDropdownOpenSif] = React.useState(false);
  const toggleSif = () => setDropdownOpenSif(prevState => !prevState);
  //let dropdown = {"isOpen": false, "toggle": }
  console.log('notes',notes)

  const diabetes= {} 
  const sifilis = {}
  const desease_type = {
    'A510': 'Primary Genital Syphilis.',
    'A511': 'Primary Anal Syphilis',
    'A514': 'Other Secondary Syphilis',
    'A529': 'Late Syphilis, unspecified',
    'A530': 'Latent Syph., unspecified as Early or Late',
    'A539': 'Syphilis, unspecified',
    'E109': 'Type 1 Diabetes Mellitus',
    'E119': 'Type 2 Diabetes Mellitus',
    'E149': 'Unspecified Diabetes Mellitus',
    'A51': 'Other Secondary Syphilis' // ?
  }

  Object.entries(notes).map(([key, value]) => {
    if (key.includes('E')) {
      diabetes[key] = value
    }else{
      sifilis[key] = value
    }
  })
    

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  function handleChangeDropdown(plot_info){
    let root
    let root_subt
    if (!root && !root_subt) {
      root = ReactDOMClient.createRoot(document.getElementById(plot_info[0]));
      root_subt = ReactDOMClient.createRoot(document.getElementById(plot_info[3]));
    }
    root_subt.render(
      <div id={plot_info[3]}>TOP TERMS FOR {plot_info[4]}</div>
    )
    root.render(
      <div id={plot_info[0]}>
        <BarPlot props={[plot_info[1], plot_info[2]]}></BarPlot>
      </div>)
    root = null
    root_subt = null
  }
  
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col xl="9">
                    <h2 className="text-white ls-1 mb-1">Most Relevant Terms for Diabetes in the EHR</h2>
                    <h6 className="text-uppercase text-light mb-0">
                      <div id='diab-subt'>TOP TERMS FOR {desease_type["E109"]}</div>
                    </h6>
                  </Col>
                  <Col xl="3">
                    {Object.keys(state).length !== 0 ?
                      <div className="text-right">
                        <Dropdown isOpen={dropdownOpenDiab} toggle={toggleDiab} size="sm">
                          <DropdownToggle caret>Type of Diabetes</DropdownToggle>
                          <DropdownMenu size="sm" left='true'>
                            { Object.keys(diabetes).map(function (type) {
                              return(
                                <div key={type}>
                                  <DropdownItem onClick={() => handleChangeDropdown(['diabetes', diabetes[type], {orientation: 'h', bck_color:"rgba(0,0,0,0)", font_color:'white', bar_color:"rgb(94, 114, 228)"},
                                  'diab-subt', desease_type[type]])} dropdownvalue={type} size="sm">
                                    {desease_type[type]}
                                  </DropdownItem>
                                </div>
                              )
                            })
                            }
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                      :
                      <></>
                    }
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {Object.keys(state).length !== 0 ?
                  <div id="diabetes">
                    <BarPlot props={[notes["E109"], {orientation: 'h', bck_color:"rgba(0,0,0,0)", font_color:'white', bar_color:"rgb(94, 114, 228)"}]}></BarPlot>
                  </div>
                  :
                  <CardHeader className="bg-transparent">
                    <h5 className="text-uppercase text-light ls-1 mb-0"> No data</h5>
                  </CardHeader>
                }
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <Col xl="9">
                    <h2 className="ls-1 mb-1">Most Relevant Terms for Syphilis in the EHR</h2>
                    <h6 className="text-uppercase text-muted mb-0">
                      <div id='sifi-subt'>TOP TERMS FOR {desease_type['A51']}</div>
                    </h6>
                  </Col>
                  <Col xl="3">
                    {Object.keys(state).length !== 0 ?
                      <div className="text-right">
                        <Dropdown isOpen={dropdownOpenSif} toggle={toggleSif} size="sm" color="primary">
                          <DropdownToggle caret color="primary">Type of Syphilis</DropdownToggle>
                          <DropdownMenu size="sm" left='true'>
                            { Object.keys(sifilis).map(function (type) {
                              return(
                                <div key={type}>
                                  <DropdownItem onClick={() => handleChangeDropdown(['sifilis', sifilis[type], {orientation: 'h', bck_color:"rgba(0,0,0,0)"}, 
                                  'sifi-subt', desease_type[type]])} dropdownvalue={type} size="sm">
                                    {desease_type[type]}
                                  </DropdownItem>
                                </div>
                              )
                            })
                            }
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                      :
                      <></>
                    }
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {Object.keys(state).length !== 0 ?
                  <div id="sifilis">
                    <BarPlot props={[notes["A51"], {orientation: 'h', bck_color:"rgba(0,0,0,0)", bar_color:"rgb(251, 99, 64)0"}]}></BarPlot>
                  </div>
                  :
                  <CardHeader className="bg-transparent">
                    <h5 className="text-uppercase text-light ls-1 mb-0"> No data</h5>
                  </CardHeader>
                }
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Social traffic</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Referral</th>
                    <th scope="col">Visitors</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>1,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">60%</span>
                        <div>
                          <Progress
                            max="100"
                            value="60"
                            barClassName="bg-gradient-danger"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>5,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">70%</span>
                        <div>
                          <Progress
                            max="100"
                            value="70"
                            barClassName="bg-gradient-success"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Google</th>
                    <td>4,807</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">80%</span>
                        <div>
                          <Progress max="100" value="80" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Instagram</th>
                    <td>3,678</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">75%</span>
                        <div>
                          <Progress
                            max="100"
                            value="75"
                            barClassName="bg-gradient-info"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">twitter</th>
                    <td>2,645</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">30%</span>
                        <div>
                          <Progress
                            max="100"
                            value="30"
                            barClassName="bg-gradient-warning"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NotesBoard;
