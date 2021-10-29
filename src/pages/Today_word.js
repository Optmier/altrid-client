
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { selectHansUpProblems } from '../components/ClassReport/QnA/HandsUpInterface';
import { apiUrl } from '../configs/configs';

const Today = styled.div`


        & .Word-en{
            display:none
           
        }
        & .Word-Ko{
         

        display:block;



           
        }
        

    



`






function Today_word(){


    const [open,setopen] = useState(false);
    const [word,setword] = useState([])

    useEffect(()=>{
        Axios.get(`${apiUrl}/word/random`,{ withCredentials: true})
        .then(result=>setword(result.data[0].word))
    },[])



    return(
        
        <Today> 
        
                <div className={open ? "Word-en": ""}>  
                    <h2 onClick={()=>{
                        setopen(true)
                    }}>{word}</h2>
                    <h6>뜻 확인하기</h6>
                </div>     
                <div className= {open ?  "Word-Ko"  : "Word-en"} >
                    <h2 onClick={()=>{
                        setopen(false)
                    }} >사과</h2>
                    <h6>더 많은 단어 공부하러 가기</h6>
                </div>
         
      
        </Today>   
    )
}

export default Today_word;