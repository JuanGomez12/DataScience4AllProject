import React from 'react';
import Plot from 'react-plotly.js';

const NewBoxPlot = ({props}) => {
    let c=-1
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
    //const colors = ['',"LightSeaGreen",'blue','green','orange','purple','red','darkblue','darkred']
    //const colors = ['#636EFA','#EF553B','#00CC96','#AB63FA','#FFA15A','#19D3F3','#FF6692','#B6E880','#FF97FF','#FECB52']
    //const colors=['rgba(99, 110, 250, 1)', 'rgba(239, 85, 59, 1)', 'rgba(0, 204, 150, 1)', 'rgba(171, 99, 250, 1)', 'rgba(255, 161, 90, 1)', 'rgba(25, 211, 243, 1)', 'rgba(255, 102, 146, 1)', 'rgba(182, 232, 128, 1)', 'rgba(255, 151, 255, 1)', 'rgba(254, 203, 82, 1)']
    //const colors_fill=['rgba(99, 110, 250, 0.8)', 'rgba(239, 85, 59, 0.8)', 'rgba(0, 204, 150, 0.8)', 'rgba(171, 99, 250, 0.8)', 'rgba(255, 161, 90, 0.8)', 'rgba(25, 211, 243, 0.8)', 'rgba(255, 102, 146, 0.8)', 'rgba(182, 232, 128, 0.8)', 'rgba(255, 151, 255, 0.8)', 'rgba(254, 203, 82, 0.8)']
    const colors_dark=['rgba(196, 43, 73, 1)','rgba(76, 56, 115, 1)', 'rgba(23, 84, 120, 1)', 'rgba(44, 132, 132, 1)', 'rgba(12, 106, 67, 1)', 'rgba(92, 140, 57, 1)', 'rgba(189, 138, 6, 1)', 'rgba(180, 99, 4, 1)', 'rgba(163, 64, 49, 1)', 'rgba(118, 41, 88, 1)', 'rgba(88, 51, 89, 1)', 'rgba(81, 81, 81, 1)']
    const colors = ['rgba(245, 54, 92, 0.7)', 'rgba(29, 105, 150, 0.8)', 'rgba(56, 166, 165, 0.8)', 'rgba(15, 133, 84, 0.8)', 'rgba(115, 175, 72, 0.8)', 'rgba(237, 173, 8, 0.8)', 'rgba(225, 124, 5, 0.8)', 'rgba(204, 80, 62, 0.8)', 'rgba(148, 52, 110, 0.8)', 'rgba(95, 70, 144, 0.8)', 'rgba(111, 64, 112, 0.8)', 'rgba(102, 102, 102, 0.8)']

    let traces = Object.entries(props[0]).map(([key, value]) => {
        c ++
        const std = ((value.q3-value.mean)/(0.675)).toFixed(3)
        //console.log('std:', value.sd ? [value.sd] : [std])
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
            upperfence: [value.max],
            mean: [value.mean],
            sd: value.sd ? [value.sd] : [std],
            y : (value.fliers.length > 0) ? [value.fliers] : [[value.med]],
            boxpoints: 'outliers', //'suspectedoutliers'
            //line: {color: colors[c], width: 2},
            fillcolor: colors[c],
            marker: {
              color:colors[c],
              //opacity: 0.5,
              //size:2,
              //color:'rgb(0, 0, 0)',
              line: {
                //outliercolor: 'rgba(219, 64, 82, 1.0)',
                outlierwidth: 2,
                //width:1
              }
            },
            }
        )
      })
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