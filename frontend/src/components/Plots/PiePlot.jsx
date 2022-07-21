import React from 'react';
import Plot from 'react-plotly.js';

const NewPiePlot = ({props}) => {
  const x_vals = Object.keys(props[0])
  const y_vals = Object.values(props[0])
  //const colors = ['',"LightSeaGreen",'blue','green','orange','purple','red','darkblue','darkred']
  let plots = []
  //const colors = ['#636EFA','#EF553B','#00CC96','#AB63FA','#FFA15A','#19D3F3','#FF6692','#B6E880','#FF97FF','#FECB52']
  const colors = ['rgba(245, 54, 92, 0.8)', 'rgba(29, 105, 150, 0.8)', 'rgba(56, 166, 165, 0.8)', 'rgba(15, 133, 84, 0.8)', 'rgba(115, 175, 72, 0.8)', 'rgba(237, 173, 8, 0.8)', 'rgba(225, 124, 5, 0.8)', 'rgba(204, 80, 62, 0.8)', 'rgba(148, 52, 110, 0.8)', 'rgba(95, 70, 144, 0.8)', 'rgba(111, 64, 112, 0.8)', 'rgba(102, 102, 102, 0.8)']
  let diabetes = {}
  let sifilis = {}
  let col = -1

  // To split Diabetes and Syphilis data
  Object.entries(props[0]).map(([key, value]) => {
    if (key.includes('E')) {
      diabetes[key] = value
    }else{
      sifilis[key] = value
    }
  })
  plots.push(sifilis)
  plots.push(props[0])
  plots.push(diabetes)

  const trace = plots.map(function (plot) {
    col++
    const lbls = []
    const vals = []
    let sum
    let title
    let group
    let name
    Object.entries(plot).map(([key, value]) => {
        lbls.push(key)
        vals.push(value['Count'])
      })
    sum = vals.reduce((a, b) => Number(a) + Number(b)).toLocaleString('en') 
    if (col===0){
        title = 'Syphilis<br />'+sum
        group='one'
        name='Syphilis'
    }else if(col===1){
        title = 'Total<br />'+sum
        group='one'
        name='Total diseases'
    }else{
        title = 'Diabetes<br />'+sum
        group='one'
        name='Diabetes'
    }
    return(
    {
        values: vals,
        labels: lbls,
        domain: {column: col},
        type: "pie",
        hole:.4,
        scalegroup:group,
        textinfo: "label+text+value",
        colors:colors,
        name:name,
        color_discrete_map: {'A530':'#636EFA', 'A539': '#EF553B','A51':'#00CC96','E119':'#AB63FA','E109':'#FFA15A','E149':'#19D3F3'},
        title:{
            text: title,
            font: {
                //family: 'Courier New, monospace',
                size: 19,
                color: 'font_color' in props[1] ? props[1].font_color :'rgb(50,50,93)'
            }
          },
        marker:{
            colors:colors,
            //color_discrete_map: {'A530':'#636EFA', 'A539': '#EF553B','A51':'#00CC96','E119':'#AB63FA','E109':'#FFA15A','E149':'#19D3F3'},
            //colors: {'color_discrete_map': {'A530':'blue', 'A539': 'red','A51':'lightblue','E119':'orange','E109':'lightblue','E149':'orange'}},
            //annotations:{text:'GHG', x:0.5, y:0.5, font_size:20, showarrow:false},
            //opacity: 0.6,
            line:{
                color:'ghostwhite',
                //opacity: '1.0',
                width:1
                },
            }
        }
    )
  })
  
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
            grid: {rows: 1, columns: 3},
            margin:{
              l: ('orientation' in props[1]) && (props[1].orientation === 'h')? 100 : 80,
              t:50,
              pad: 5
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
export default NewPiePlot;