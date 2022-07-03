import React, { useState } from 'react'
import {Container} from 'react-bootstrap'
import Sociodemographic from './SociodemographicBoard'
import Laboratory from './LaboratoryBoard'

function Dashboard() {
  const [socioVals, setSocioVals] = useState([
    {"genero":{
      "enfermedad1":{
          "hombres":40,
          "mujeres":60
        },
      "enfermedad2":{
        "hombres":70,
        "mujeres":30
      }
      },
    "edad":{
      "enfermedad1":{
        "min":0,
        "q1":10,
        "med":15,
        "q3":45, 
        "max":60
      },
      "enfermedad2":{
        "min":1,
        "q1":11,
        "med":16,
        "q3":46, 
        "max":61
      }
    },
    "estadoCivil":{
        "enfermedad1":{
          "soltero":12,
          "casado":32
        }
    },
    "tipoSangre":{
        "enfermedad1":{
          "O+":12,
          "AB":32,
          "O-":28,
          "A+":10
         },
         "enfermedad2":{
          "O+":15,
          "AB":30,
          "O-":25,
          "A+":20
         }
      }
   }]);

   const [labsVals, setLabsVals] = useState([
    {"examenes":{
        "enfermedad1":{
          "min":0,
          "q1":10,
          "med":15,
          "q3":45, 
          "max":60
        }
      },
    "tiempoExamenesPromedio": {
      "enfermedad1":{
        "min":0,
        "q1":10,
        "med":15,
        "q3":45, 
        "max":60}
      },
   "tiempoExamenesMaximo": {
      "enfermedad1":{
        "min":0,
        "q1":10,
        "med":15,
        "q3":45, 
        "max":60}
      }
   }
   ]);
  return (
    <Container>
      <Sociodemographic features={socioVals}></Sociodemographic>
      <Laboratory features={labsVals}></Laboratory>
    </Container>
  )
}

export default Dashboard