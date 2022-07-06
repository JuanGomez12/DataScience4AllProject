import React from 'react';
import Plot from 'react-plotly.js';

const NewBoxPlot = ({props}) => {
    let c=0
    let traces = Object.entries(props[0]).map(([key, value]) => {
        c ++
        return( 
            {
            type: "box",
            name: key,
            offsetgroup: c,
            boxmean: 'sd',
            //offsetgroup: "1",
            q1: [value.q1],
            median: [value.med],
            q3: [value.q3],
            lowerfence: [value.min],
            upperfence: [value.max]
            }
        )})
    return(
      <div className='plot-class'>
        <Plot 
        data={traces}
        layout={
          {
            // width: 'width' in props[1] ? props[1].width : 586,
            // height: 'height' in props[1] ? props[1].height : 480, 
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
          legend: {
            legend_title: props[1].title,
            font: {
              size: 13
            }
          },
          showlegend: true,
          legend_title: props[1].title,
          boxmode: 'group',
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
            title: 'Count',
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
        }}
        x = {['day 1', 'day 2']}
        useResizeHandler={true}
        style={{width: "100%", height: "100%"}}
        />
      </div>
    )
}
export default NewBoxPlot;