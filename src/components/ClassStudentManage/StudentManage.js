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
import { withRouter } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';
import TooltipCard from '../essentials/TooltipCard';
import { useDispatch } from 'react-redux';
import { getPlanInfo } from '../../redux_modules/planInfo';

const StyleCheckbox = withStyles({
    root: {
        color: '#717171',
        '&$checked': {
            color: '#13e2a1',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

function StudentManage({ match, history }) {
    const dispatch = useDispatch();

    const { num } = match.params;

    const [studentDatas, setStudentDatas] = useState({});
    const [selectState, setSelectState] = useState({});
    const [checkstate, setCheckState] = useState({});

    const handleSelectChange = (e) => {
        const { name, value } = e.target;

        setSelectState({
            ...selectState,
            [name]: value,
        });
    };
    const handleChange = (event) => {
        setCheckState({ ...checkstate, [event.target.name]: event.target.checked });
    };
    const handleMoveReport = (e) => {
        const { name } = e.target;

        if (selectState[name]) {
            history.push(`/class/${num}/share/${selectState[name]}/details?user=${name}`);
        }
    };
    const handleDelete = () => {
        let arr = [];
        Object.keys(checkstate)
            .filter((i) => checkstate[i] === true)
            .map((i) => arr.push(`'${i}'`));

        Axios.delete(`${apiUrl}/students-in-class/students/${num}`, {
            data: {
                students: arr.join(','),
            },
            withCredentials: true,
        })
            .then((res) => {
                alert('학생 삭제가 완료되었습니다!');
                history.replace(`/class/${num}/student-manage`);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        Axios.get(`${apiUrl}/assignment-result/report-students/${match.params.num}`, { withCredentials: true })
            .then((res) => {
                window.data = res.data;

                let obj = {};
                let selectObj = {};
                let checkObj = {};
                for (let i = 0; i < res.data.length; i++) {
                    if (!Object.keys(obj).includes(res.data[i]['student_id'])) {
                        obj[res.data[i]['student_id']] = [];
                        selectObj[res.data[i]['student_id']] = '';
                        checkObj[res.data[i]['student_id']] = false;
                    }
                    obj[res.data[i]['student_id']].push({
                        name: res.data[i]['name'],
                        actived_number: res.data[i]['actived_number'],
                        title: res.data[i]['title'],
                        idx: res.data[i]['idx'],
                    });
                }

                setStudentDatas(obj);
                setSelectState(selectObj);
                setCheckState(checkObj);
            })
            .catch((err) => {
                console.error(err);
            });

        dispatch(getPlanInfo(true));
    }, []);

    window.selectState = selectState;
    window.studentDatas = studentDatas;
    window.checkstate = checkstate;

    return (
        <ClassWrapper col="col">
            <div className="class-student-manage-root">
                <div className="manage-header">
                    <h2 className="manage-title">수강생 관리</h2>
                </div>
                <div className="manage-inputs">
                    <div className="manage-inputs-header">
                        <div className="header-left">
                            수강 학생 <span>({Object.keys(studentDatas).length}명)</span>
                        </div>
                        <div className="header-right" onClick={handleDelete}>
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
                        {Object.keys(studentDatas).map((i) => (
                            <div key={i} className="list">
                                <StyleCheckbox checked={checkstate.i} onChange={handleChange} name={i} />
                                <div className="list-box">
                                    <div className="list-box-left">
                                        <TooltipCard title={studentDatas[i][0]['name']}>
                                            <div>{studentDatas[i][0]['name']}</div>
                                        </TooltipCard>

                                        <select name={i} onChange={handleSelectChange}>
                                            <option value="">과제 리포트 선택</option>
                                            {studentDatas[i]
                                                .filter((item) => item['idx'] !== null)
                                                .map((j) => (
                                                    <option key={j['actived_number']} value={j['actived_number']}>
                                                        {j['title']}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="list-box-right">
                                        <button name={i} onClick={handleMoveReport}>
                                            확인하기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ClassWrapper>
    );
}

export default withRouter(StudentManage);
