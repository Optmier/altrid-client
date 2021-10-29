import React,{useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { apiUrl } from '../configs/configs';
import styled from 'styled-components';

const Assignment = styled.div`


   
`


function Dashassign(props){

    const [assignment,setassignment] = useState([]);
    const [duedate,setdate] = useState([]);
    const [today,settdoay]  = useState(new Date());
    
    
    const sessions = useSelector((state) => state.RdxSessions);
    
    useEffect(()=>{
        axios.get(`${apiUrl}/assignment-actived/${props.id}`,{ withCredentials: true })
        .then(res=>setassignment(res.data))
    },[])



    return(
        
        <Assignment>
        
        <div className="assignment">
        {console.log(assignment)}
        {assignment.map((event,i)=>{
            return(     
                <div key={i}>
                <h5>{event.title}</h5>
                        {Math.ceil((today.getTime() - new Date(event.due_date).getTime())/(1000*60*60*24)) > 0 ? (
                          <h6> D + {Math.ceil((today.getTime() - new Date(event.due_date).getTime())/(1000*60*60*24))} 일 지났습니다 </h6> 
                      ): (
                          <h6> D {Math.ceil((today.getTime() - new Date(event.due_date).getTime())/(1000*60*60*24))} 일 남았습니다. </h6>    
                        )}
                </div>
          )
        })}
        
        

        </div>
        </Assignment>

    )
}

export default Dashassign;
