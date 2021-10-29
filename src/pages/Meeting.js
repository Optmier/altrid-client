import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../configs/configs';






function Meeting(){


    const [member,setmember] = useState('')
    const [room,setroom] = useState('')


    useEffect(()=>{
        Axios.get(`${apiUrl}/meeting-room/live-counts`,{ withCredentials: true })
        .then(result=>setmember(result.data.data.currentRoomUserCnt))
    },[])

    useEffect(()=>{
        Axios.get(`${apiUrl}/meeting-room`, {withCredentials:true})
        .then(result=>setroom(result.data.length))
    },[])


    return(
    <div>
        현재 <span> {room} </span> 개의 방에서 <br/> <span> {member} </span> 명의 학생들이<br/>
        공부 중 입니다.
    </div>
    )
}

export default Meeting;