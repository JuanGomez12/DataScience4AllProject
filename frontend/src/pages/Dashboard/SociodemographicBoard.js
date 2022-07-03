import React from 'react';
import Plot from 'react-plotly.js';
import BoxPlot from "../../components/Plots/BoxPlot";
import StackedBarPlot from "../../components/Plots/StackedBarPlot";

function SociodemographicBoard({ features }) {

  const {genero,edad,estadoCivil,tipoSangre} = features[0]
  
  return (
    <div> SociodemographicBoard
      <ul>
        {Object.entries(estadoCivil).map(([key, value]) => {
          return(
            <>
            <li>{value.soltero}</li>
            <li>{value.casado}</li>
            </>
          )
          })}
      </ul>
      <ul>


      </ul>
      <BoxPlot props={[edad, "Age"]}></BoxPlot>
      <StackedBarPlot props={[genero, "Gender"]}></StackedBarPlot>
      <StackedBarPlot props={[estadoCivil, "Marital status"]}></StackedBarPlot>
      <StackedBarPlot props={[tipoSangre, "Blood type"]}></StackedBarPlot>
      
      <Plot
        data={[
          {
            type: "box",
            name: "just q1/median/q3",
            offsetgroup: "1",
            q1: [ 1],
            median: [ 2],
            q3: [ 3]
          },
          {
            type: "box",
            name: "q1/median/q3/lowerfence/upperfence",
            offsetgroup: "2",
            q1: [ 1 ],
            median: [ 2],
            q3: [ 3 ],
            lowerfence: [ 0 ],
            upperfence: [ 4]
          },
          {
            x:'3',
            type: "box",
            name: "all pre-computed stats",
            offsetgroup: "3",
            q1: [ 1 ],
            median: [ 2],
            q3: [ 3 ],
            lowerfence: [ 0 ],
            upperfence: [ 4],
            mean: [2.2],
            sd: [ 0.4],
            notchspan: [ 0.2]
            }]
    }
    layout={ {width: 700, height: 500, title: 'Age vs type of disease',
      boxmode: 'group',
      legend: {
        x: 0,
        y: 1, 
        yanchor: 'bottom'},
      mode: 'lines+markers',
      marker: {color: 'blue'}
      }}
    x = {['day 1', 'day 2']}
    />

    </div>
  )
}

export default SociodemographicBoard