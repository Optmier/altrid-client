import { Paper, TableHead,Table, TableBody, TableCell, TableContainer, TableRow, Tab } from '@material-ui/core';
import React from 'react';
import InfoIcon from '@material-ui/icons/Info'

function createData(
    name:string,
    time: number,
    achive: number,
){
    return {name,time,achive};
}

const row = [
    createData('jaehyeon','541','90.7'),
    createData('학생2','342','86.2'),
    createData('학생3','111','60.1'),
    createData('학생4','841','100'),
    createData('학생5','123','62.4'),
    createData('학생6','321','85.3')
    
]

function Leaderboard(){
    return(
        <div className="Leaderboard">
            <div className="class-manage-root">
                    <div>
                        <div className="manage-inputs">
                            <div className="manage-inputs-header">
                            리더 보드
                            </div>
                        </div>  
                    </div>    
                    <div className="score">
                        <TableContainer component={Paper}>
                            <Table sx={{minwidth:650}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">순위</TableCell>
                                        <TableCell align="center">학생 이름</TableCell>
                                        <TableCell align="center">총 학습시간</TableCell>
                                        <TableCell align="center">성취도</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.map((row,index)=>(
                                        <TableRow
                                        key = {row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell align="center">{index+1} 위</TableCell>
                                        <TableCell align="center">{row.name} 님</TableCell>
                                        <TableCell align="center">{row.time} 분</TableCell>
                                        <TableCell align="center">{row.achive} %</TableCell>
                                        </TableRow>

                                    // map 함수 function 으로 만들고
                                    // sort 를 먼저 한 다음 다시 map 함수를 사용?

                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>  
            </div>
            
        </div>
    )
}

export default Leaderboard;