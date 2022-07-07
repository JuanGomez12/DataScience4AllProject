import React from 'react';
import Plot from 'react-plotly.js';

const NewBoxPlot = ({props}) => {
    let c=0
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
    let traces = Object.entries(props[0]).map(([key, value]) => {
        c ++
        const std = ((value.q3-value.mean)/(0.675)).toFixed(3)
        //console.log('std:', value.sd ? [value.sd] : [std])
        return( 
            {
            type: "box",
            name: desease_type[key],
            offsetgroup: c,
            boxmean: 'sd',
            //offsetgroup: "1",
            q1: [value.q1],
            median: [value.med],
            q3: [value.q3],
            lowerfence: [value.min],
            upperfence: [value.max],
            mean: [value.mean],
            sd: value.sd ? [value.sd] : [std],
            y : (value.fliers.length > 0) ? [value.fliers] : [[value.med]],
            boxpoints: 'outliers', //'suspectedoutliers'
            marker: {
              //outliercolor: 'rgba(219, 64, 82, 0.6)',
              line: {
                //outliercolor: 'rgba(219, 64, 82, 1.0)',
                outlierwidth: 2
              }
            },
            }
        )})
    return(
      <div className='plot-class'>
        <Plot
        data={traces}
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
            t:50
          },
          showlegend: true,
          legend: {
            title: {
              text: props[1].title,
              font: {
                size: 13
              }
            }
          },
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
        useResizeHandler={true} 
        style={{width: "100%", height: "100%", fontSize: "10px !important"}}
        className='a.modebar-btn'
        />
      </div>
    )
}
export default NewBoxPlot;