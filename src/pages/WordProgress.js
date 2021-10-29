import Axios from 'axios';
import React ,{useEffect, useState} from 'react';
import ReactApexChart from 'react-apexcharts';
import { apiUrl } from '../configs/configs';

function WordProgress(){
    

    const [word,setword] = useState('')
    const [count,setcount] = useState([])

    const [state,setstate] = useState(
        {
            options: {
                chart: {
                    height:350,
                    type:'radialBar',
                },
                labels: ['단어 진행률'],
            },
        }
    )
    useEffect(()=>{
        Axios.get(`${apiUrl}/word`,{ withCredentials: true})
        .then(result=>setword(result.data.length))
       
    },[])

    useEffect(()=>{
        Axios.get(`${apiUrl}/word/completed`,{withCredentials:true})
        .then(result=>setcount(result.data.length))
    },[])


   


    return(
        <div className="pie_chart">
        
            <ReactApexChart options={state.options} series ={[(count/word) * 100 ]} type ="radialBar" height={350}/>
            
        </div>
    )
}

export default WordProgress;