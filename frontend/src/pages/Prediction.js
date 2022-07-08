import React from 'react'
import { useState } from 'react'
import {Container, Row, Col, Table, Card, CardHeader, Button, CardBody, FormGroup, Form, Input} from 'reactstrap'
import PredictionHeader from "../components/Headers/PredictionHeader.js"
import Select from 'react-select'
import axios from 'axios'
import Modal from 'react-modal';

Modal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1
  },
};

function Prediction() {

  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [ethnicGroup, setEthnicGroup] = useState("");
  const [residentialArea, setResidentialArea] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [plan, setPlan] = useState("");
  const [type, setType] = useState("");
  const [medicalExams, setMedicalExams] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("exam");
  const [resultPrediction, setResultPrediction] = useState();

  const urlPrediction = "http://20.214.241.33:8000/api/post";
  const exampleGet = "http://20.214.241.33:8000/api/socio_economics";

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
    {  value: 'Confirmado Nuevo', label:'Confirmado Nuevo'},
    {  value: 'Confirmado Repetido', label:'Confirmado Repetido'},
    {  value: 'Impresión Diagnóstica', label:'Impresión Diagnóstica'},
  ];

  function handleChangeAge(event){
    setAge(event.target.value);
  }

  function handleChangeSex(value){
    setSex(value.value);
  }

  function handleChangeEthnicGroup(event){
    setEthnicGroup(event.value);
  }

  function handleChangeResidentialArea(event){
    setResidentialArea(event.value);
  }

  function handleChangeMaritalStatus(event){
    setMaritalStatus(event.value);
  }

  function handleChangeBlood(event){
    setBloodType(event.value);
  }

  function handleChangePlan(event){
    setPlan(event.target.value);
  }

  function handleChangeType(event){
    setType(event.value);
  }

  function handleChangeExams(event){
    setMedicalExams(event.value);
  }

  function removeMedicalExam(indice){
    console.log("Removing:", indice);
    var copyMedicalExams = medicalExams;
    copyMedicalExams.splice(indice, 1);
    setMedicalExams(copyMedicalExams);
  }

  function handleSubmit(event){
    console.log("Sending request");
    var json = createDataJson();
    console.log(json);

    // axios.get(exampleGet)
    // .then(res => {
    //   console.log(res);
    // })
    // .catch(e => {
    //   console.log(e);
    // })

    axios.post(urlPrediction,json)
    .then(res => {
      setModalContent("prediction");
      setResultPrediction(res.data.respuesta);
      console.log(res);
      setIsOpen(true);
    })
    .catch(e => {
     console.log(e);
    })
  }

  function createDataJson(){
    var names = [];
    var dates = [];
    var values = [];

    for (var i = 0; i < Object.keys(medicalExams).length; i++) {
      names.push(medicalExams[0].name);
      dates.push(medicalExams[0].date);
      values.push(medicalExams[0].value);
    }

    var json = {
      "Edad": age,
      "Genero": sex,
      "GrupoEtnico": ethnicGroup,
      "AreaResidencial": residentialArea,
      "EstadoCivil": maritalStatus,
      "TSangre": bloodType,
      "Nombre": names,
      "Fecha": dates,
      "Valor": values,
      "Tipo": type,
      "Plan": plan
    }

    return json;
  }

  function openModal(content) {
    setModalContent(content);
    setIsOpen(true);
  }

  function closeModal() {
    //Get values of the form
    var newName = document.getElementById("input-new-name").value;
    var newDate = document.getElementById("input-new-date").value;
    var newValue = document.getElementById("input-new-value").value;
    var newMedicaExam = {
      "name": newName,
      "date": newDate,
      "value": parseFloat(newValue)
    }
    
    console.log(newMedicaExam);

    var copyMedicalExams = medicalExams;
    copyMedicalExams.push(newMedicaExam)

    setMedicalExams(copyMedicalExams);

    setIsOpen(false);
  }

  // console.log(medicalExams);

  return (
    <>
      <PredictionHeader />
        {/* Page content */}
      <Container className="mt-5" fluid>
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
              <Form onSubmit={handleSubmit}>
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
                          onChange={handleChangeAge}
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
                        <Select id="input-sex" options={sexOptions} onChange={handleChangeSex}/>
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
                        <Select id="input-marital-status" options={maritalOptions} onChange={handleChangeMaritalStatus}/>
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
                        <Select id="input-ethnic-group" options={ethnicOptions} onChange={handleChangeEthnicGroup}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-residential-area"
                        >
                          Residential Area
                        </label>
                        <Select id="input-residential-area" options={residentialOptions} onChange={handleChangeResidentialArea}/>
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
                        <Select id="input-blood-type" options={bloodOptions} onChange={handleChangeBlood}/>
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
                          Type
                        </label>
                        <Select id="input-type" options={planOptions} onChange={handleChangeType}/>
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
                          onChange={handleChangePlan}
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
                              href="#predict"
                              onClick={(e) => openModal("exam")}
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
                            <th scope="col">Name</th>
                            <th scope="col">Date</th>
                            <th scope="col">Value</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {medicalExams.map((element, i) => (
                              <tr key={i}>
                                <th scope="row">
                                  <span className="mb-0 text-sm">
                                    {element.name}
                                  </span>
                                </th>
                                <td>
                                  {element.date}
                                </td>
                                <td>
                                  {element.value}
                                </td>
                                <td>
                                  <Button onClick={() => removeMedicalExam(i)}>Remove</Button>
                                </td>
                              </tr>
                          ))}
                          
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
                      href="#predict"
                      onClick={handleSubmit}
                    >Submit</Button>
                  </Row>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Container>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {modalContent !== "prediction"?
          <>
            <h6 className="heading-small text-muted mb-4">
              New Medical Examn
            </h6>
            <div className="pl-lg-4">
              <Row>
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-new-name"
                  >
                    Name
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-new-name"
                    type="text"
                  />
                </FormGroup>
              </Row>
              <Row>
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-new-date"
                  >
                    Date
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-new-date"
                    type="date"
                  />
                </FormGroup>
              </Row>
              <Row>
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-new-value"
                  >
                    Value
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-new-value"
                    type="number"
                  />
                </FormGroup>
                
              </Row>
              <Row>
                <Button color="info" onClick={closeModal}>Add</Button>
              </Row>
            </div>
          </>
          :
          <>
            <p><b>Result of prediction:</b></p>
            <p>{resultPrediction}</p>
            <Button 
              color='info'
              onClick={() => setIsOpen(false)}>Close</Button>
          </>
        }
      </Modal>
    </>
  )
}

export default Prediction
