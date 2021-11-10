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
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    Button as MuiButton,
    FilledInput,
    FormControlLabel,
    InputAdornment,
    TextField,
} from '@material-ui/core';
import Button from '../../AltridUI/Button/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PhoneIcon from '@material-ui/icons/Phone';
import HomeIcon from '@material-ui/icons/Home';
import AltCheckedIcon from '../../AltridUI/Icons/AltCheckedIcon';
import AltUncheckedIcon from '../../AltridUI/Icons/AltUncheckedIcon';
import styled from 'styled-components';

const StyleCheckbox = withStyles({
    root: {
        color: '#717171',
        '&$checked': {
            color: '#13e2a1',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

const Accordion = withStyles({
    root: {
        boxShadow: 'none',
        '&:not(:first-child)': {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        },
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: ({ mark }) => (mark % 2 === 1 ? '#F6F8F9' : '#ffffff'),
        border: 'none',
        borderRadius: 8,
        marginBottom: -1,
        minHeight: 52,
        paddingLeft: 0,
        '&$expanded': {
            minHeight: 52,
        },
    },
    content: {
        alignItems: 'center',
        margin: '0 18px',
        '&$expanded': {
            margin: '0 18px',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

const SummaryStudentName = styled.div`
    flex-basis: 25%;
    margin-left: 29px;
`;
const SummaryStudentPhone = styled.div`
    align-items: center;
    display: flex;
    flex-basis: 24%;
    & svg {
        margin-right: 8px;
    }
`;
const SummaryStudentAddress = styled.div`
    align-items: center;
    display: flex;
    flex-basis: 40%;
    & svg {
        margin-right: 8px;
    }
`;
const DetailsRoot = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;
const Notes = styled.div``;
const ReportSelectContainer = styled.div`
    display: flex;
`;
const ReportSelect = styled.select``;

function StudentManage({ onChangeStudentSelection, match, history }) {
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
        onChangeStudentSelection({ ...checkstate, [event.target.name]: event.target.checked });
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
                        phone: res.data[i]['phone'],
                        address: res.data[i]['address'],
                        notes: res.data[i]['notes'],
                    });
                }

                const notesInputSet = {};
                for (const key in obj) {
                    notesInputSet['notes-input-' + key] = obj[key][0]['notes'] || '';
                }
                setNotes(notesInputSet);
                setStudentDatas(obj);
                setSelectState(selectObj);
                setCheckState(checkObj);
            })
            .catch((err) => {
                console.error(err);
            });

        dispatch(getPlanInfo(true));
    }, []);

    const [expanded, setExpanded] = useState(false);
    const [notes, setNotes] = useState({});
    const actionExpand = (studentId) => (event, isExpanded) => {
        if (isExpanded) {
        } else {
        }
        setExpanded(isExpanded ? studentId : false);
    };

    const onNotesInputChange =
        (studentId) =>
        ({ target }) => {
            const { name, value } = target;
            // console.log(name, value, studentId);
            setNotes({ ...notes, [name]: value });
        };

    const updateStudentNotes = (studentId) => {
        Axios.patch(
            `${apiUrl}/students-in-class/notes/${num}/${studentId}`,
            { notes: notes['notes-input-' + studentId] },
            { withCredentials: true },
        )
            .then((res) => {
                alert('저장되었습니다.');
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className="class-student-manage-root" style={{ width: '100%' }}>
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
                <div className="" style={{ width: '100%' }}>
                    {Object.keys(studentDatas).map((key, idx) => (
                        <Accordion key={key} expanded={expanded === key} onChange={actionExpand(key)}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                mark={idx}
                                aria-controls={`${key}bh-content`}
                                id={`${key}bh-header`}
                            >
                                <FormControlLabel
                                    aria-label={'select_' + key}
                                    onClick={(event) => event.stopPropagation()}
                                    onFocus={(event) => event.stopPropagation()}
                                    control={
                                        <Checkbox
                                            disableRipple
                                            disableTouchRipple
                                            disableFocusRipple
                                            color="default"
                                            icon={<AltUncheckedIcon />}
                                            checkedIcon={<AltCheckedIcon />}
                                            name={key}
                                            onChange={handleChange}
                                        />
                                    }
                                />
                                <SummaryStudentName>{studentDatas[key][0]['name']}</SummaryStudentName>
                                <SummaryStudentPhone>
                                    <PhoneIcon fontSize="inherit" />
                                    {studentDatas[key][0]['phone'] ? studentDatas[key][0]['phone'] : '-'}
                                </SummaryStudentPhone>
                                <SummaryStudentAddress>
                                    <HomeIcon fontSize="inherit" />
                                    {studentDatas[key][0]['address'] ? studentDatas[key][0]['address'] : '-'}
                                </SummaryStudentAddress>
                            </AccordionSummary>
                            <AccordionDetails>
                                <DetailsRoot>
                                    <Notes>
                                        <FormControl variant="filled" fullWidth>
                                            <InputLabel htmlFor="input-notes">특이사항 입력</InputLabel>
                                            <FilledInput
                                                id={'input-notes-id_' + key}
                                                value={notes['notes-input-' + key]}
                                                name={'notes-input-' + key}
                                                onChange={onNotesInputChange(key)}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <MuiButton
                                                            onClick={() => {
                                                                updateStudentNotes(key);
                                                            }}
                                                        >
                                                            저장
                                                        </MuiButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </Notes>
                                    <ReportSelectContainer>
                                        <ReportSelect name={key} onChange={handleSelectChange}>
                                            <option value="">과제 리포트 선택</option>
                                            {studentDatas[key]
                                                .filter((item) => item['idx'] !== null)
                                                .map((j) => (
                                                    <option key={j['actived_number']} value={j['actived_number']}>
                                                        {j['title']}
                                                    </option>
                                                ))}
                                        </ReportSelect>
                                        <Button sizes="medium" colors="purple" name={key} onClick={handleMoveReport}>
                                            리포트 바로가기
                                        </Button>
                                    </ReportSelectContainer>
                                </DetailsRoot>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default withRouter(StudentManage);
