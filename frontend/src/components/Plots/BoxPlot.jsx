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
        <Plot
        data={traces}
        layout={ {width: 700, height: 500, title: props[1] + ' vs type of disease',
        boxmode: 'group',
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
            title: 'Count',
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
        x = {['day 1', 'day 2']}
        />
    )
}
export default NewBoxPlot;