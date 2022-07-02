import React from 'react'
import { useState } from 'react'
import FormInput from '../components/FormInput/FormInput'
import FormSelectInput from '../components/FormSelectInput/FormSelectInput'
import {Container, Row, Col, Table, Card, CardHeader, Button, CardBody, FormGroup, Form, Input} from 'reactstrap'
import PredictionHeader from "../components/Headers/PredictionHeader.js"
import Select from 'react-select'

function Prediction() {

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [ethnicGroup, setEthnicGroup] = useState("");
  const [residentialArea, setResidentialArea] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [plan, setPlan] = useState("");
  const [medicalExams, setMedicalExams] = useState("");

  const sexOptions = [
    { value: 'Mujer', label: 'Female' },
    { value: 'Hombre', label: 'Male' }
  ];

  const ethnicOptions = [
    { value: 'Mestizo', label: 'Mestize' },
    { value: 'Negro', label: 'Black' },
    { value: 'Mulato', label: 'Mulatto' },
    { value: 'Afrocolombiano o Afro descendiente', label: 'Afro-Colombian or Afro-descendant' },
    { value: 'Blanco', label: 'White' },
    { value: 'Indígena', label: 'Indigenous' },
    { value: 'Palenquero de San Basilio', label: 'Palenquero of San Basilio' },
    { value: 'Ninguno de los anteriores', label: 'None of the above' }
  ];

  const residentialOptions = [
    { value: 'Zona Rural', label: 'Rural area' },
    { value: 'Zona Urbana', label: 'Urban area' }
  ];

  const maritalOptions = [
    { value: 'Separado', label: 'Separated' },
    { value: 'Casado', label: 'Married' },
    { value: 'Soltero', label: 'Single' },
    { value: 'No reportado', label: 'Not reported' },
    { value: 'Viudo/a', label: 'Widower' },
    { value: 'Union libre', label: 'Free union' },
    { value: 'Desconocido', label: 'Unknown' },
    { value: 'Divorciado', label: 'Divorced' }
  ];

   const bloodOptions = [
    { value: 'O+', label: 'O+' },
    { value: 'A+', label: 'A+' },
    { value: 'B+', label: 'B+' },
    { value: 'O-', label: 'O-' },
    { value: 'A-', label: 'A-' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' }
  ];

  const planOptions = [
    { value: 'Mujer', label: 'Female' },
    { value: 'Hombre', label: 'Male' }
  ];

  function handleChangeName(event){
    setName(event.target.value);
  }

  function handleChangeAge(event){
    setAge(event.target.value);
  }

  function handleChangeSex(event){
    setSex(event.target.value);
  }

  function handleChangeEthnicGroup(event){
    setEthnicGroup(event.target.value);
  }

  function handleChangeResidentialArea(event){
    setResidentialArea(event.target.value);
  }

  function handleChangeMaritalStatus(event){
    setMaritalStatus(event.target.value);
  }

  function handleChangeBlood(event){
    setBloodType(event.target.value);
  }

  function handleChangePlan(event){
    setPlan(event.target.value);
  }

  function handleChangeExams(event){
    setMedicalExams(event.target.value);
  }

  function handleSubmit(event){

  }

  return (
    <>
      <PredictionHeader />
        {/* Page content */}
      <Container className="mt-5" fluid>

        <form onSubmit={handleSubmit}>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Form to generate predictions</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Age
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-age"
                            placeholder="Age of the pacient"
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Sex
                          </label>
                          <Select id="input-sex" options={sexOptions} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-marital-status"
                          >
                            Marital status
                          </label>
                          <Select id="input-marital-status" options={maritalOptions} />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-ethnic-group"
                          >
                            Ethnic group
                          </label>
                          <Select id="input-ethnic-group" options={ethnicOptions} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-ethnic-group"
                          >
                            Residential Area
                          </label>
                          <Select id="input-ethnic-group" options={residentialOptions} />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-blood-type"
                          >
                            Blood type
                          </label>
                          <Select id="input-blood-type" options={bloodOptions} />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-type"
                          >
                            Tipo
                          </label>
                          <Select id="input-type" options={planOptions} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-plan"
                          >
                            Plan
                          </label>
                          <Input
                            id="input-plan"
                            className="form-control-alternative"
                            placeholder="Write the description"
                            rows="2"
                            type="textarea"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    
                  </div>

                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Medical Exams</h6>
                  <div className="pl-lg-4">
                  <Row>
                    <div className="col">
                      <Card className="shadow">
                        <CardHeader className="border-0">
                          <Row className="align-items-center">
                            <Col xs="8">
                              <h3 className="mb-0">Medical Exams</h3>
                            </Col>
                            <Col className="text-right" xs="4">
                              <Button
                                color="info"
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                                size="sm"
                              >
                                Add new exam
                              </Button>
                            </Col>
                          </Row>
                        </CardHeader>
                        <Table className="align-items-center table-flush" responsive>
                          <thead className="thead-light">
                            <tr>
                              <th scope="col">Codigo</th>
                              <th scope="col">Fecha</th>
                              <th scope="col">Valor</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th scope="row">
                                <span className="mb-0 text-sm">
                                  CODIGO2020
                                </span>
                              </th>
                              <td>April 15</td>
                              <td>
                                123
                              </td>
                              <td>
                                <Button>Remove</Button>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Card>
                    </div>
                  </Row>
                  </div>

                  <hr className="my-4" />
                  <div className="pl-lg-4">
                    <Row>
                      <Button
                      color="info"
                      href="#pablo"
                      >Submit</Button>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </form>
      </Container>
    </>
  )
}

export default Prediction