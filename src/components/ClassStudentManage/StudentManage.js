import React, { useState, useEffect } from 'react';
import ClassWrapper from '../essentials/ClassWrapper';
import '../../styles/student_manage_page.scss';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { apiUrl } from '../../configs/configs';
import Axios from 'axios';

const StyleCheckbox = withStyles({
    root: {
        color: '#717171',
        '&$checked': {
            color: '#13e2a1',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 300,
        margin: 0,

        '& .MuiInputLabel-formControl': {
            top: ' -15px',
            left: '7px',
            position: 'absolute',
        },
        '& .MuiInputLabel-shrink': {
            transform: 'translate(-6px, 4px) scale(0.5)',
            transformOrigin: 'top left',
        },
        '& label + .MuiInput-formControl': {
            marginTop: 0,
        },

        '@media (min-width: 0px) and (max-width: 1231px)': {
            '&': {
                minWidth: 200,
            },
        },
    },
    selectEmpty: {
        marginTop: 0,
    },
}));

function StudentManage() {
    const classes = useStyles();

    const [state, setState] = useState({
        checkedG: true,
    });
    const [age, setAge] = useState('');

    const handleSelectChange = (event) => {
        setAge(event.target.value);
    };
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    useEffect(() => {
        Axios.get(`${apiUrl}/classes`, { withCredentials: true })
            .then((res) => {})
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <ClassWrapper col="col">
            <div className="class-student-manage-root">
                <div className="manage-header">
                    <h2 className="manage-title">수강생 관리</h2>
                </div>
                <div className="manage-inputs">
                    <div className="manage-inputs-header">
                        <div className="header-left">
                            수강 학생 <span>(30명)</span>
                        </div>
                        <div className="header-right">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16">
                                <path
                                    id="_22"
                                    dataname="22"
                                    d="M1,16a2.006,2.006,0,0,0,2,2h8a2.006,2.006,0,0,0,2-2V4H1ZM14,1H10.5l-1-1h-5l-1,1H0V3H14Z"
                                    fill="#707070"
                                />
                            </svg>
                            선택 삭제
                        </div>
                    </div>
                    <div className="manage-students-list">
                        <div className="list">
                            <StyleCheckbox checked={state.checkedG} onChange={handleChange} name="checkedG" />
                            <div className="list-box">
                                <div className="list-box-left">개인 학습자 1</div>
                                <div className="list-box-right">
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-helper-label">과제 리포트 선택</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-helper-label"
                                            id="demo-simple-select-helper"
                                            value={age}
                                            onChange={handleSelectChange}
                                        >
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <button>확인하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ClassWrapper>
    );
}

export default StudentManage;
