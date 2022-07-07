import React from 'react';
import Plot from 'react-plotly.js';

const NewBarPlot = ({props}) => {

    const x_vals = Object.keys(props[0])
    const y_vals = Object.values(props[0])

    const trace = [{
        x: ('orientation' in props[1]) && (props[1].orientation === 'h')? y_vals : x_vals,
        y: ('orientation' in props[1]) && (props[1].orientation === 'h')? x_vals : y_vals,
        //name: cat,
        type: 'bar',
        text: y_vals.map(ele => Number(ele).toFixed(3)),
        //text: y_vals.map(ele => ele.toFixed(2)),
        orientation: 'orientation' in props[1] ? props[1].orientation : 'v',
        marker:{
          color: 'bar_color' in props[1] ? props[1].bar_color :'rgba(50, 171, 96)',
          //opacity: 0.6,
          line:{
            //color:'rgba(50, 171, 96, 1.0)',
            opacity: '1.0',
            //width:1
          },
        }
        }]
    return(
      <div className='plot-class'>
        <Plot
          data={trace}
          layout={
            {
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
                l: ('orientation' in props[1]) && (props[1].orientation === 'h')? 100 : 80,
                t:50,
                pad: 5
              },
              grid:{
                yside: 'left plot'
              },
              legend: {
                legend_title: props[1].title,
                font: {
                  size: 13
                }
              },
              legend_title: props[1].title,
              //color: diseases,
              paper_bgcolor: 'bck_color' in props[1] ? props[1].bck_color : 'rgba(245,246,249,1)',
              plot_bgcolor: 'bck_color' in props[1] ? props[1].bck_color : 'rgba(245,246,249,1)',
              xaxis: {
                  title: 'Importance',
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
                title: 'Top terms',
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
export default NewBarPlot;