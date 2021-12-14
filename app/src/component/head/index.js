import React, {useState}from 'react'
import { useNavigate  } from 'react-router-dom'
import styles from './index.module.css'

const nav = [{
    title: 'ALL',
    path: '/all'
},{
    title: 'RANK',
    path: '/rank'
},{
    title: 'COMPARE',
    path: '/compare'
},{
    title: 'SEARCH',
    path: '/search'
}]

export default function Header(props) {

    const {classname} = props;
    const history = useNavigate();
    const [active, setactive] = useState(0)
    const gotoPath = (path, index) => {
        history(path)
        setactive(index)
    }
    
    return (
        <div className={[styles.header, classname ||''].join(' ')}>
            <p className={styles.p} onClick={()=> gotoPath('/')}>PERFERT CITY</p>
            <div className={styles.nav}>
                {nav.map((item,index)=>{
                    return <p className={[styles.p, index === active ? styles.active : ''].join(' ') }  key={item.title} onClick={()=> gotoPath(item.path, index)}>{item.title}</p>
                })}
            </div>
        </div>
    )
}
