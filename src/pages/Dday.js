import { Box, Modal, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Dday() {
    const [today, setdate] = useState(new Date());
    const [New_day, setNew] = useState(new Date());
    const [open, setopen] = useState(false);
    const [Dday, setDday] = useState('');
    const [title, settitle] = useState('');

    const handleOpen = () => {
        console.log(today);
        setopen(true);
    };

    const handleClose = () => {
        var diff = Math.abs(New_day.getTime() - today.getTime());
        diff = Math.ceil(diff / (1000 * 3600 * 24));
        setDday(diff);
        setopen(false);
    };
    const inputtitle = (e) => {
        settitle(e.target.value);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div className="d_day">
            {!Dday ? (
                <p style={{ color: '#3B1689' }}>
                    <span onClick={handleOpen}>디데이 설정하러 가기</span>
                </p>
            ) : (
                <>
                    <p style={{ color: '#3B1689' }}>
                        {title} 까지 D - {Dday} 일 남았습니다.
                    </p>
                </>
            )}

            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal=title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <h4 style={{ textAlign: 'center' }}>D-day 설정</h4>
                        <h5>원하는 날짜와 일정제목을 입력해주세요.</h5>
                        <input
                            style={{ border: '1px solid black' }}
                            onChange={inputtitle}
                            placeholder="일정 이름"
                            value={title}
                            type="text"
                        />
                        <DatePicker dateFormat="yy년 MM월 dd일" selected={New_day} onChange={(date) => setNew(date)} />
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}

export default Dday;
