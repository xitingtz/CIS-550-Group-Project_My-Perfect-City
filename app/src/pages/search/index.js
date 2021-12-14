import 'antd/dist/antd.less';
import React, {useEffect, useState, useRef} from 'react'
import Header from '../../component/head'
import { Tabs, message, Slider, Button } from 'antd';
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
              // axisLine: {show:false},
              axisTick: {show:false},
              axisLabel: {
                        show: true,
                        margin: 140,
                        color: '#333',
                        fontSize: 14, 
                        align: 'left', 
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

export default function Search() {
    const searchrefCity = useRef()
    const searchrefState = useRef()
    const [xDate, setxDate] = useState([])
    const [yDate, setyDate] = useState([])
    const [searchLoading, setsearchLoading] = useState([])
    const [searchCriteriaData, setsearchCriteriaData] = useState({
      vaccination_rate: [0, 100],
      crime_rate: [0, 1800],
      house_price: [0, 1392084],
      posted_jobs: [0, 1176],
      population: [0, 18713220]
    })
    const [searchCriteriaRes, setsearchCriteriaRes] = useState([])
    useEffect(() => {
        callback(1)
    }, [])
    const callback = async (index) => {
        // const temp = key[index]
        // const hide = message.loading('Action in progress..', 0);
        // const {data:{results}} = await getDate(temp.url)
        // hide();
        // const xdata = []
        // const ydata = []
        // for(let i = 0; i < results.length; i++){
        //     xdata.push(results[i][temp.data])
        //     ydata.push(results[i][temp.dataname])
        // }
        // setxDate(xdata)
        // setyDate(ydata)
    }
    const onCrimeChange = (id,value) => {
        let n = {...searchCriteriaData}
        n[id] = [...value]
        setsearchCriteriaData({...n})
    }
    const  searchCriteria = async (index) => {
        const newd = [...searchLoading]
        newd[index] = true
        setsearchLoading([...newd])
        const {data:{results}} = await axios.get('/search/criterias',{
          params:{
            vaccinationLow: searchCriteriaData.vaccination_rate[0],
            vaccinationHigh: searchCriteriaData.vaccination_rate[1],
            crimeRateLow: searchCriteriaData.crime_rate[0],
            crimeRateHigh: searchCriteriaData.crime_rate[1],
            housePriceLow: searchCriteriaData.house_price[0],
            housePriceHigh: searchCriteriaData.house_price[1],
            jobCountLow: searchCriteriaData.posted_jobs[0],
            jobCountHigh: searchCriteriaData.posted_jobs[1],
            populationLow: searchCriteriaData.population[0],
            'populationHigh%20':'%20'+ searchCriteriaData.population[1]
          }
        })
        setsearchCriteriaRes(results)
        newd[index] = false
        setsearchLoading([...newd])
    }
    const  searchCity = async (index) => {
      const newd = [...searchLoading]
      newd[index] = true
      setsearchLoading([...newd])
      if(searchrefCity.current.value && searchrefState.current.value){
        const {data:{results}} = await axios.get('/search/cityName', {
          params:{
            city_name: searchrefCity.current.value,
            state_id: searchrefState.current.value
          }
        })
        newd[index] = false
        setsearchLoading([...newd])
        const data = [results[0].crime_rank, results[0].vaccination_rank, /*results[0].crime_rank,*/ results[0].job_rank]
        setxDate(data)
        setyDate(['Crime Rate', 'Vaccination Rate', 'Posted Jobs'])
      }
    }
    const sliderData = [
      {
        name: 'Population',
        id: 'population',
        min: 0,
        max: 18713220
      },
      {
        name: 'Crime Rate Per 100000',
        id: 'crime_rate',
        min: 0,
        max: 1800
      },
      {
        name: 'Vaccination Rate',
        id: 'vaccination_rate',
        min: 0,
        max: 100
      },
      {
        name: 'House Price',
        id: 'house_price',
        min: 0,
        max: 1392084
      },
      {
        name: 'Posted Jobs',
        id: 'posted_jobs',
        min: 0,
        max: 1176
      }
    ]
    const formatter = (value, max) => {
      if(max > 100){
        return value * max / 100
      }else{
        return value + "%"
      }
    }
    return (
        <div className={styles.search}>
            <Header />
            <div className={styles.wrapper}>
              <Tabs defaultActiveKey="1" onChange={callback} centered>
                <TabPane tab={'City Name Search'} key={'City Nmae Search'}>
                    <div className={styles.searchCity}>
                        <div className={styles.searchCityTop}>
                          <input type={'input'} placeholder={'Input City'} ref={searchrefCity} ></input>
                          <input type={'input'} placeholder={'Input State(i.e. PA)'} ref={searchrefState} ></input>
                          <Button type="primary" loading={searchLoading[0]} onClick={() => {searchCity(0)}}>
                              SEARCH
                          </Button>
                        </div>
                    </div>
                    <RankBar id={'barSearch'} xData = {xDate} yData={yDate}></RankBar>
                </TabPane>
                <TabPane tab={'Criteria Search'} key={'Criteria Search'}>
                    <div className={styles.flex}>
                        <div className={styles.left}>
                            {
                              sliderData.map((item)=>{
                                return <div className={styles.leftItem} key={item.id}>
                                          <h1>{item.name}</h1>
                                          <div className={styles.sliderWraper}>
                                              <p>{item.min}</p>
                                              <div className={styles.slider}>
                                                <Slider
                                                  range
                                                  step={10}
                                                  tipFormatter={(value) => formatter(value, item.max)}
                                                  defaultValue={[item.min, item.max]}
                                                  onChange={(value)=>onCrimeChange(item.id,value)}
                                                />
                                              </div>
                                              <p>{item.max}</p>
                                          </div>
                                      </div>

                              })
                            }
                            
                        </div>
                        <div className={styles.right}>
                            <Button type="primary" loading={searchLoading[1]} onClick={() => {searchCriteria(1)}}>
                              SEARCH
                            </Button>
                        </div>
                    </div>
                    <div className={styles.res}>
                      <h1>RESULTS</h1>
                      {searchCriteriaRes.map((item)=> <p> {item.city}; {item.state_id} ;</p>)}
                    </div>
                </TabPane>
             </Tabs>  
            </div>
            
        </div>
    )
}