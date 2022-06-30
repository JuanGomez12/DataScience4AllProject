import React from 'react'
import { useState } from 'react'
import FormInput from '../components/FormInput/FormInput'
import FormSelectInput from '../components/FormSelectInput/FormSelectInput';
import {Container, Row, Col, Table} from 'react-bootstrap'

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
    <Container>
      <Row>
        <h2>Prediction form</h2>
      </Row>
      <form onSubmit={handleSubmit}>
        <Row>
          <FormInput placeholder="Name" type="text" label="Name:" changeFunction={handleChangeName}/>
        </Row>
        <Row>
          <Col>
            <FormInput placeholder="Age" type="number" label="Age:" changeFunction={handleChangeAge}/>
          </Col>
          <Col>
            <FormSelectInput label="Sex:" options={sexOptions} changeFunction={handleChangeSex}/>
          </Col>
          <Col>
            <FormSelectInput label="Marital status:" options={maritalOptions} changeFunction={handleChangeMaritalStatus}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormSelectInput label="Ethnic group:" options={ethnicOptions} changeFunction={handleChangeEthnicGroup}/>
          </Col>
          <Col>
            <FormSelectInput label="Residential Area:" options={residentialOptions} changeFunction={handleChangeResidentialArea}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormSelectInput label="Blood type:" options={bloodOptions} changeFunction={handleChangeBlood}/>
          </Col>
          <Col>
            <FormSelectInput label="Plan:" options={planOptions} changeFunction={handleChangePlan}/>
          </Col>
        </Row>
        <Row>
          <Col sm={8} className="col-label">
            <label>Medical exams:</label>
          </Col>
          <Col sm={4}>
            <button className='form-button'>Add Exam</button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Code</th>
                  <th>Date</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <button>Submit</button>
        </Row>
      </form>
    </Container>
  )
}

export default Prediction