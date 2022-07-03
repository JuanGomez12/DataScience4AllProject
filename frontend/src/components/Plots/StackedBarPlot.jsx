import React from 'react';
import Plot from 'react-plotly.js';

const NewStackedBarPlot = ({props}) => {
    const diseases = Object.keys(props[0])
    const categories = Object.keys(props[0][diseases[0]])
    //const cats = categories.reduce((obj,cat)=> (obj[cat]=[],obj),{});
    let traces = categories.map(function (cat) {
        let y_vals = []
        Object.entries(props[0]).map(([key, value]) => {
            y_vals.push(value[cat])
            return y_vals
        })
        return( 
            {x: diseases,
             y: y_vals,
             name: cat,
             type: 'bar',
             text: y_vals.map(String),
             labels:{
                "value": "Percentage",
            }
            }
        )
    })
    return(
        <Plot
        data={traces}
        layout={{barmode: 'stack', width: 700, height: 500, title: props[1] + ' vs type of disease',
        color: diseases,
        paper_bgcolor: 'rgba(245,246,249,1)',
        plot_bgcolor: 'rgba(245,246,249,1)',
        xaxis: {
            title: 'Type of Disease',
            titlefont: {
              size: 15,
              color: 'rgb(107, 107, 107)'
            },
            tickfont: {
            size: 14,
            color: 'rgb(107, 107, 107)'
          }},
          yaxis: {
            title: 'Percentage',
            titlefont: {
              size: 15,
              color: 'rgb(107, 107, 107)'
            },
            tickfont: {
              size: 14,
              color: 'rgb(107, 107, 107)'
            }
          }
    }}
        />        
    )
}
export default NewStackedBarPlot;