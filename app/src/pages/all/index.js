import 'antd/dist/antd.less';
import React, {useEffect, useState} from 'react'
// import styles from 'index.module.css'
import { Table, message } from 'antd';
import Header from '../../component/head'
import axios from 'axios'
import styles from './index.module.css'

const columns = [
  {
    title: 'City',
    dataIndex: 'city',
    sorter: (a, b) => a.city.length - b.city.length,
    sortDirections: ['descend'],
  },
  {
    title: 'State',
    dataIndex: 'state_name',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.state_name.length - b.state_name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Crime Rate',
    dataIndex: 'crime_rate_per_100000',
    sorter: (a, b) => a.crime_rate_per_100000 - b.crime_rate_per_100000,
  },
  {
    title: 'Vaccination Rate',
    dataIndex: 'people_fully_vaccinated_per_hundred',
    sorter: (a, b) => a.people_fully_vaccinated_per_hundred - b.people_fully_vaccinated_per_hundred,
  },
  {
    title: 'House Price',
    dataIndex: 'med_price',
    sorter: (a, b) => a.med_price - b.med_price,
  },
  {
    title: 'Posted Jobs',
    dataIndex: 'job_count',
    sorter: (a, b) => a.job_count - b.job_count,
  },
];


function onChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra);
}
export default function All() {
  const [data, setdata] = useState([])
    useEffect(() => {
        getData()
        
    }, [])
    const getData = async () => {
        const hide = message.loading('Action in progress..', 0);
        const {data:{results}} = await axios.get('/all_cities')
        hide()
        setdata(results)
    }
    return (
        <div className={styles.all}>
            <Header />
            <div className={styles.wrapper}>
                <div className={styles.top}>
                    <p>ALL CITIES</p>
                </div>
               <Table columns={columns} dataSource={data} onChange={onChange} /> 
            </div>
        </div>
    )
}
