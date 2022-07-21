import React from 'react';
import Plot from 'react-plotly.js';

const NewLinePlot = ({props}) => {
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
    const colors_dark=['rgba(196, 43, 73, 1)','rgba(76, 56, 115, 1)', 'rgba(23, 84, 120, 1)', 'rgba(44, 132, 132, 1)', 'rgba(12, 106, 67, 1)', 'rgba(92, 140, 57, 1)', 'rgba(189, 138, 6, 1)', 'rgba(180, 99, 4, 1)', 'rgba(163, 64, 49, 1)', 'rgba(118, 41, 88, 1)', 'rgba(88, 51, 89, 1)', 'rgba(81, 81, 81, 1)']
    const colors = ['rgba(245, 54, 92, 0.7)', 'rgba(29, 105, 150, 0.8)', 'rgba(56, 166, 165, 0.8)', 'rgba(15, 133, 84, 0.8)', 'rgba(115, 175, 72, 0.8)', 'rgba(237, 173, 8, 0.8)', 'rgba(225, 124, 5, 0.8)', 'rgba(204, 80, 62, 0.8)', 'rgba(148, 52, 110, 0.8)', 'rgba(95, 70, 144, 0.8)', 'rgba(111, 64, 112, 0.8)', 'rgba(102, 102, 102, 0.8)']

    let traces = Object.entries(props[0]).map(([key, value]) => {
        c ++
        let dates = []
        let counts = []
        Object.entries(value).map(([key, value]) => {
          dates.push(value['Date'])
          counts.push(value['Count'])
        })
        //console.log('dates',dates, counts)
        return( 
            {
            x: dates,
            y: counts,
            type: 'scatter',
            mode: 'lines+markers',
            name: key,
            hovertemplate: '(%{x})<br>' +
                        '<b>Number of tests: %{y}</b>',
            marker: {
              color:colors[c],
              //opacity: 0.5,
              //size:2,
              line: {
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
          paper_bgcolor: 'bck_color' in props[1] ? props[1].bck_color : 'rgba(245,246,249,1)',
          plot_bgcolor: 'bck_color' in props[1] ? props[1].bck_color : 'rgba(245,246,249,1)',
          xaxis: {
            title: 'xtitle' in props[1] ? props[1].xtitle : 'Type of Disease',
            titlefont: {
              size: 15,
              //color: 'rgb(107, 107, 107)'
            },
            tickfont: {
              size: 14,
              //color: 'rgb(107, 107, 107)'
            },
            showgrid:false, gridwidth:0.5, gridcolor:'rgb(149,163,179)' //Grid
          },
          yaxis: {
            title: 'ytitle' in props[1] ? props[1].ytitle : 'Count',
            titlefont: {
              size: 15,
              //color: 'rgb(107, 107, 107)'
            },
            tickfont: {
              size: 14,
              //color: 'rgb(107, 107, 107)'
            },
            showgrid:false, gridwidth:0.5, gridcolor:'rgb(149,163,179)'//Grid
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
export default NewLinePlot;