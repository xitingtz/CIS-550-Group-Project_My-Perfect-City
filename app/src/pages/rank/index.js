import 'antd/dist/antd.less';
import React, {useEffect, useState} from 'react'
import Header from '../../component/head'
import { Tabs, message } from 'antd';
// import echarts from 'echarts/lib/echarts';
import * as echarts from 'echarts';
import 'echarts/lib/component/grid'
import  'echarts/lib/chart/bar';
import axios from 'axios'
import styles from './index.module.css'

const { TabPane } = Tabs;

function RankBar(props) {
    const {id, xData, yData} = props;
    console.log(xData, yData)
    useEffect(() => {
        
        var myChart = echarts.init(document.getElementById(id));
        const  option = {
            color: '#E5AF9E',
            grid: {
              show: false,
              left: 150
            },
            tooltip: {
              trigger: 'axis',
              formatter: function(param){
                return param[0].data + '%'
              },
            },
            xAxis: {
              type: 'value',
              axisLine: {show:false},
              axisTick: {show:false},
              splitLine: {show: false },
              axisLabel: {show: false }
            },
            yAxis: {
              inverse: true, 
              type: 'category',
              data: yData,
              axisLine: {show:false},
              axisTick: {show:false},
              axisLabel: {
                        show: true,
                        margin: 140,
                        color: '#333',
                        fontSize: 14, 
                        align: 'left', 
                        formatter: function(value, index) {
                          if (index === 0) {
                            return `{first|${index + 1}}  ` + value;
                          } else if (index === 1) {
                            return `{second|${index + 1}}  ` + value;
                          } else if (index === 2) {
                            return `{third|${index + 1}}  `  + value;
                          } else {
                            return "       " + value;
                          }
                        },
                        rich: {
                          first: {
                            backgroundColor: '#F6E4B9',
                            width: 24,
                            height: 24,
                            align: 'center',
                            borderRadius: 50,
                          },
                          second: {
                            backgroundColor: '#F6E4B9',
                            width: 24,
                            height: 24,
                            align: 'center',
                            borderRadius: 50,
                          },
                          third: {
                            backgroundColor: '#F6E4B9',
                            width: 24,
                            height: 24,
                            align: 'center',
                            borderRadius: 50,
                          }
                        }
                      }
            },
            series: [
              {
                barWidth : 20,
                barCategoryGap: 5,
                barGap:'80%',
                data: xData,
                type: 'bar'
              }
            ]
          };
       
        myChart.setOption(option);
    }, [xData, yData])
   
    return <div id={id} style={{width: '400px', height: '500px', margin: '0 auto'}}></div>
}

export default function Rank() {
    const [xDate, setxDate] = useState([])
    const [yDate, setyDate] = useState([])

    const key = [{
        url: '/order/crimeRate',
        name: 'Crime Rate',
        dataname: 'city',
        data: 'crime_rate_per_100000'
    },{
        url: '/rank_cities_by_vaccination_rate',
        name: 'Vaccination Rate',
        dataname: 'city',
        data: 'vaccination_rate'
    },{
        url: '/order/house_price',
        name: 'House Price',
        dataname: 'county',
        data: 'med_ppsf'
    },{
        url: '/Order_Job_Count',
        name: 'Posted Jobs',
        dataname: 'city',
        data: 'num_of_jobs'
    }]
    useEffect(() => {
        callback(1)
    }, [])
    const getDate = (url) => {
        return axios.get(url)
    }
    const callback = async (index) => {
        const temp = key[index]
        const hide = message.loading('Action in progress..', 0);
        const {data:{results}} = await getDate(temp.url)
        hide();
        const xdata = []
        const ydata = []
        for(let i = 0; i < results.length; i++){
            xdata.push(results[i][temp.data])
            ydata.push(results[i][temp.dataname])
        }
        setxDate(xdata)
        setyDate(ydata)
    }
    return (
        <div className={styles.rank}>
            <Header />
            <div className={styles.wrapper}>
              <Tabs defaultActiveKey="1" onChange={callback} centered>
                {
                    key.map((item, index)=>{
                        return <TabPane tab={item.name} key={index}>
                            <RankBar id={'bar'+ index} xData = {xDate} yData={yDate}></RankBar>
                        </TabPane>
                    })
                }
             </Tabs>  
            </div>
            
        </div>
    )
}