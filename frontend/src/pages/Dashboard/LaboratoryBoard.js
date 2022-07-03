import React from 'react';
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