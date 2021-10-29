import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import Calendar from './Calendar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dday from './Dday';
import WordProgress from './WordProgress';
import Today_word from './Today_word';
import Dashassign from './Dashassign';
import Meeting from './Meeting';
import Lecture from './Lecture';


const Container = styled.div`
    width:70%;
    margin:0 auto;
        & .D_day{
            padding-top:50px;
        }
        & .comment{
            padding-top:65px;
        }
        & .Words{
            padding-top:50px;
        }
            & span{
                font-size:13px;
            }
        & .meeting{
            padding-top:40px;
        }
`


const Item = styled.div`
 
    text-align:center;
    box-shadow:3px 3px 3px 2px rgba(0, 0, 0, 0.4);
    min-height: 350px;
    border-radius:10px;
        & p{
            padding-top:12px;
        }
        & span{
            font-weight:bold;
        }
`

const Items = styled.div`

    text-align:center;
    box-shadow:3px 3px 3px 2px rgba(0, 0, 0, 0.4);
    min-height: 150px;
    border-radius:10px;
        & span{
            font-weight:bold;
        }
`
const Item1 = styled.div`

    text-align:center;
    box-shadow:3px 3px 3px 2px rgba(0, 0, 0, 0.4);
    min-height: 250px;
    border-radius:10px;
        & span{
            font-weight:bold;
        }
`



function Dashboard({match}){

    const num = match.params.num
    return(
        <div className="dashboard">
            {console.log(num)}
            <Container>
                <Box sx ={{flexGrow: 1}}>
                    <Grid container spacing={2}>
                       
                        <Grid item xs ={4}>
                            <Items className="sentence">
                                   <Lecture/>
                            </Items>
                        </Grid>
                        <Grid item xs ={4}>
                            <Items className="sentence">
                            <div className="meeting">
                            <Meeting/>
                            </div>
                             </Items>
                        </Grid>
                      <Grid item xs ={4}>
                            <Items>
                                <div className="Words">
                                    <Today_word/>
                                </div>
                            </Items>
                        </Grid>  
                        <Grid item xs ={6}>
                            <Item>
                            <div className="comment">
                            <Dashassign id={num}/>
                            </div>
                            </Item>
                        </Grid>
                        <Grid item xs ={6}>
                            <Item>
                            <WordProgress/>
                            </Item>
                        </Grid>
                        <Grid item xs ={12}>
                            <Item1>
                            시간 그래프
                            </Item1>
                        </Grid>
                        <Grid item xs ={8}>
                            <Items>
                            <div className="comment">
                            <span>재현 학생은 단어를 더 외우고 집중을 더 한다면 좋은 성적을 얻을 수 있을 것입니다.</span>
                            </div>
                            </Items>
                        </Grid>
                        <Grid item xs ={4}>
                            <Items>
                            <div className="D_day">
                            <Dday/>
                            </div>
                            </Items>
                        </Grid>
                       
                    </Grid>
                </Box>
            </Container>  
        </div>
    )
}

export default Dashboard;