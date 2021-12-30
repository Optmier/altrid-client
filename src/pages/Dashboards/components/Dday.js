/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import DashboardDDay from '../../../controllers/DashboardDDay';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    TextField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

function Dday(props) {
    const [today, setdate] = useState(new Date()); // 오늘 날짜
    const [New_day, setNew] = useState(''); // db에 저장되고 불러와지는 DDay 날짜
    const [open, setopen] = useState(false); // 다이얼로그 state
    const [title, settitle] = useState('');
    const [init, setinit] = useState('');
    const [test, settest] = useState('');
    const [day, setday] = useState(new Date());
    const [eventday, seteventday] = useState('');
    const [event, setevent] = useState('');
    const classNum = props.classNum;
    const [saving, setsave] = useState({
        title: '',
        date: '',
    });
    const classes = useStyles();
    const handleOpen = () => {
        setopen(true);
    };

    const save = new DashboardDDay(classNum, (msg, res) => {
        // console.log(res);
    });

    const justclose = () => {
        setopen(false);
    };
    const handleClose = () => {
        setopen(false);

        setsave({
            ...saving,
            title: title,
            date: New_day,
        });
        // console.log(saave);
        // settest(saave);
        alert('D-day가 설정되었습니다.');
        setevent(title);
        var diff = Math.abs(new Date(New_day).getTime() - today.getTime());
        diff = Math.ceil(diff / (1000 * 3600 * 24));
        setinit(diff);
        const saveDB = JSON.stringify({
            title: title,
            date: New_day,
        });
        save.save(saveDB);
    };
    window.test = saving;

    useEffect(() => {
        new DashboardDDay(classNum, (msg, res) => {
            // console.log(res.value);
            if (!res || !res.value) {
                return;
            }
            const obj = JSON.parse(res.value);
            setevent(obj.title);
            setNew(obj.date);
            // console.log(event);
            // console.log(new Date(obj.date));
            // console.log(New_day);
            var diff = Math.abs(new Date(obj.date).getTime() - today.getTime());
            diff = Math.ceil(diff / (1000 * 3600 * 24));
            setinit(diff);
        });
    }, []);

    return (
        <div style={{ color: '#3B1689', fontWeight: 'bold' }} className="d_day">
            {event === '' ? (
                <p onClick={handleOpen}>나만의 디데이를 설정해 보세요!</p>
            ) : (
                <div onClick={handleOpen}>
                    {event} 까지 D - {init} 일 남았습니다.
                </div>
            )}

            <Dialog open={open} onClose={justclose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent>
                    <input type="text" value={title} placeholder="일정 제목 입력하기" onChange={(e) => settitle(e.target.value)} />
                    <form className={classes.container} noValidate>
                        <TextField
                            id="date"
                            // label="Dday"
                            type="date"
                            defaultValue={New_day}
                            className={classes.TextField}
                            onChange={(e) => {
                                setNew(e.target.value);
                                console.log(day);
                            }}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose}>확인</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Dday;
