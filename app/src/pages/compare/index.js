import 'antd/dist/antd.less';
import React, {useEffect, useState, useRef} from 'react'
import { message, Button } from 'antd';
import Header from '../../component/head'
import axios from 'axios'
import * as echarts from 'echarts/core';
import 'echarts/lib/component/grid'
import  'echarts/lib/chart/bar';
import styles from './index.module.css'

function initCharts(id, data){
    const myChart = echarts.init(document.getElementById(id));
    const option = {
        title: {
            text: data.title,
            left:'center',
            top: '20px'
          },
        xAxis: {
          type: 'category',
          axisLine: {show:false},
          axisTick: {show:false},
          splitLine: {show: false},
          data: data.xData
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [
          {
            data: data.yData,
            type: 'bar',
           
            itemStyle: {
               normal: {
                      color: function(params) {
                          var colorList = ['#E5AF9E', '#CCE7F8'];
                          return colorList[params.dataIndex]
                      }
                  }
            }
          }
        ]
      };    
    myChart.setOption(option);
}

function CompareBar(props) {
    const {data} = props
    useEffect(() => {
      if(data.length > 1){
        const crime = {
           title: 'Crime Rate',
           xData: [data[0].city, data[1].city],
           yData: [data[0].crime_rate, data[1].crime_rate]
         }
         const vacc = {
          title: 'Vaccination Rate',
          xData: [data[0].city, data[1].city],
          yData: [data[0].vaccination, data[1].vaccination]
        }
        const house = {
          title: 'House Price',
          xData: [data[0].city, data[1].city],
          yData: [data[0].house_price, data[1].house_price]
        }
        const job = {
          title: 'Posted Jobs',
          xData: [data[0].city, data[1].city],
          yData: [data[0].job ,data[1].job]
        }
        initCharts('crime', crime)
        initCharts('vacc', vacc)
        initCharts('house', house)
        initCharts('job', job)
      }
         
    }, [data])
   
    return <div className={styles.compareBar}>
        <div className={styles.bar} id='crime' style={{width: '300px', height: '200px'}}></div>
        <div className={styles.bar} id='vacc' style={{width: '300px', height: '200px'}}></div>
        <div className={styles.bar} id='house' style={{width: '300px', height: '200px'}}></div>
        <div className={styles.bar} id='job' style={{width: '300px', height: '200px'}}></div>
    </div>
    
}

export default function Compare() {
    const [compareDate, setcompareDate] = useState({})
    const [loading, setloading] = useState(false)

    const leftCity = useRef()
    const leftState = useRef()
    const rightCity = useRef()
    const rightState = useRef()
    const comparing = async() => {
      if(leftCity.current.value && leftState.current.value 
        &&rightCity.current.value && rightState.current.value){
          setloading(true)
          const {data:{results}} = await axios.get('/compare', {
            params:{
              city_A: leftCity.current.value,
              state_A: leftState.current.value ,
              city_B: rightCity.current.value,
              state_B: rightState.current.value
            }
          })
          setcompareDate(results)
          setloading(false)
      }else{
        message.error('missing input');
      }
      
    }
    useEffect(() => {
        
    }, [])
    return (
        <div className={styles.compare}>
            <Header />
            <div className={styles.wrapper}>
                <div className={styles.inputWrapper}>
                    <input type={'input'} placeholder={'input City'} ref={leftCity} ></input>
                    <input type={'input'} placeholder={'input State'} ref={leftState} ></input>
                    <span>VS</span>
                    <input type={'input'} placeholder={'input City'} ref={rightCity} ></input>
                    <input type={'input'} placeholder={'input State'} ref={rightState} ></input>
                    <Button type="primary" loading={loading} onClick={() => {comparing()}}>
                        COMPARE
                    </Button>
                </div>
                <CompareBar data={compareDate}></CompareBar>
            </div>
        </div>
    )
}
