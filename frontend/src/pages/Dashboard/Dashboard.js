import React, { useState } from 'react'
import {Container} from 'react-bootstrap'
import Sociodemographic from './SociodemographicBoard'

function Dashboard() {
  const [values, setPlot] = useState([
    //{x:[1,2,3], y:[2,6,3]},
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
  return (
    <Container>
      <Sociodemographic features={values}></Sociodemographic>
    </Container>
  )
}

export default Dashboard