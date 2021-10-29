import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../configs/configs';
function Lecture (){

    const [live,setlive] = useState([]);
    const [today ,setday ] = useState(new Date());


    useEffect(()=>{
        Axios.get(`${apiUrl}/meeting-room`,{ withCredentials: true})
        .then(result=>setlive(result.data))
    },[])



    return(


        <div className="live_lecture">
            {/* {
                live.map(()=>{
                    return(
                    new Date(live.end_at).getTime() == today.getTime()  ? (
                        <h2>live</h2>
                    ):(
                        <h6>현재 강의가 없습니다.</h6>
                    ))
                })
            }
            {console.log(new Date(live.end_at).getTime) == today.getTime()} */}
            
        </div>
    )
}
export default Lecture;