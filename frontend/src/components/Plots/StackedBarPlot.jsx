import React from 'react';
import Plot from 'react-plotly.js';

const NewStackedBarPlot = ({props}) => {
  const desease_type = {
    'A510': 'Primary genital Syph.',
    'A511': 'Primary anal Syph.',
    'A514': 'Other secondary Syph.',
    'A529': 'Late Syph, unspecif.',
    'A530': 'Latent Syph, unsp. early/late',
    'A539': 'Syphilis, unspecif.',
    'E109': 'Type 1 Diabetes M.',
    'E119': 'Type 2 Diabetes M.',
    'E149': 'Unspecif. Diabetes M.'
  }
  const diseases = Object.keys(props[0])
  const categories = Object.keys(props[0][diseases[0]])
  let disease_names = diseases.map(function (dis) {
    return desease_type[dis]
  })

  //const cats = categories.reduce((obj,cat)=> (obj[cat]=[],obj),{});
  let traces = categories.map(function (cat) {
      let y_vals = []
      Object.entries(props[0]).map(([key, value]) => {
          y_vals.push(value[cat])
          return y_vals
      })
      return( 
          {x: diseases,
            //x: disease_names,
            y: y_vals,
            name: cat,
            type: 'bar',
            text: y_vals.map(String)
          }
      )
  })
  return(
    <div className='plot-class'>
      <Plot
        data={traces}
        layout={
          {
            barmode: 'stack',
            // width: 'width' in props[1] ? props[1].width : 586,
            // height: 'height' in props[1] ? props[1].height : 430, 
            title: !('title' in props[1]) ? '' : {
              text: '<b>' + props[1].title + ' vs. Type of Disease</b>',
              x: 0.05,
              //y: 1, yanchor: 'bottom',
              font: {
                //family: 'Courier New, monospace',
                size: 19,
                color: 'font_color' in props[1] ? props[1].font_color :'rgb(50,50,93)'
              }
            },
            margin:{
              t:50
            },
            legend: {
              legend_title: props[1].title,
              font: {
                size: 13
              }
            },
            legend_title: props[1].title,
            color: diseases,
            paper_bgcolor: 'bck_color' in props[1] ? props[1].bck_color : 'rgba(245,246,249,1)',
            plot_bgcolor: 'bck_color' in props[1] ? props[1].bck_color : 'rgba(245,246,249,1)',
            xaxis: {
                title: 'Type of Disease',
                titlefont: {
                  size: 15,
                  //color: 'rgb(107, 107, 107)'
                },
                tickfont: {
                  size: 14,
                  //color: 'rgb(107, 107, 107)'
                }
            },
            yaxis: {
              title: 'Percentage',
              titlefont: {
                size: 15,
                //color: 'rgb(107, 107, 107)'
              },
              tickfont: {
                size: 14,
                //color: 'rgb(107, 107, 107)'
              }
            },
            font: {
              family: "helvetica",
              //size: 18,
              color: 'font_color' in props[1] ? props[1].font_color : 'rgb(149,163,179)'
            }
          }
        }
        useResizeHandler={true}
        style={{width: "100%", height: "100%"}}
      />
    </div> 
  )
}
export default NewStackedBarPlot;