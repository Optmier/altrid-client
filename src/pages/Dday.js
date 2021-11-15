import { Box, Modal, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DashboardDDay from '../controllers/DashboardDDay';
import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import { Save } from '@material-ui/icons';

function Dday(props) {
    const [today, setdate] = useState(new Date());
    const [New_day, setNew] = useState('');
    const [open, setopen] = useState(false);
    const [title, settitle] = useState('일정');
    const [init, setinit] = useState(0);
    const [test, settest] = useState(new Date());
    const classNum = props.classNum;

    const handleOpen = () => {
        setopen(true);
    };

    const save = new DashboardDDay(classNum, (msg, res) => {
        // console.log(msg, res);
    });

    const handleClose = () => {
        setNew(test);
        setopen(false);
        save.save(test);
        // save.save({
        //     title: title,
        //     date: test,
        // });
    };

    useEffect(() => {
        new DashboardDDay(classNum, (msg, res) => {
            console.log(res.value);
            setNew(res.value);
            var diff = Math.abs(new Date(New_day).getTime() - today.getTime());
            diff = Math.ceil(diff / (1000 * 3600 * 24));
            setinit(diff);
        });
    }, [New_day]);

    return (
        <div className="d_day">
            {init === null ? (
                <span onClick={handleOpen}>디데이 설정하러 가기</span>
            ) : (
                <div onClick={handleOpen}>
                    {title} 까지 D - {init} 일 남았습니다.
                </div>
            )}

            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent>
                    <input type="text" value={title} placeholder="일정 제목 입력하기" onChange={(e) => settitle(e.target.value)} />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="날짜를 선택해주세요"
                            type="datetime-local"
                            value={test}
                            onChange={(newValue) => {
                                settest(newValue);
                            }}
                            minDate={today}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose}>확인</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Dday;
