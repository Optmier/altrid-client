/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-computed-key */
import React, { useState, useEffect } from 'react';
import '../../styles/student_manage_page.scss';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { apiUrl } from '../../configs/configs';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPlanInfo } from '../../redux_modules/planInfo';
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    Button as MuiButton,
    FormControlLabel,
    InputAdornment,
} from '@material-ui/core';
import Button from '../../AltridUI/Button/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PhoneIcon from '@material-ui/icons/Phone';
import HomeIcon from '@material-ui/icons/Home';
import AltCheckedIcon from '../../AltridUI/Icons/AltCheckedIcon';
import AltUncheckedIcon from '../../AltridUI/Icons/AltUncheckedIcon';
import TextField from '../../AltridUI/TextField/TextField';
import styled from 'styled-components';
import GroupBox from '../../AltridUI/GroupBox/GroupBox';
import { openAlertSnackbar } from '../../redux_modules/alertMaker';
import Typography from '../../AltridUI/Typography/Typography';

// const StyleCheckbox = withStyles({
//     root: {
//         color: '#717171',
//         '&$checked': {
//             color: '#13e2a1',
//         },
//     },
//     checked: {},
// })((props) => <Checkbox color="default" {...props} />);

const Accordion = withStyles({
    root: {
        boxShadow: 'none',
        '&:not(:first-child)': {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        },
        '&:last-child': {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
        },
        '&:not(:last-child)': {
            borderBottom: 0,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
        '& + &': {
            marginTop: 2,
            ['@media all and (min-width: 800px) and (max-width: 1191px)']: {
                marginTop: 8,
            },
        },
        ['@media all and (max-width: 799px)']: {
            '& + &': {
                marginTop: 8,
            },
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: ({ mark }) => (mark % 2 === 1 ? '#F6F8F9' : '#ffffff'),
        border: 'none',
        borderRadius: 8,
        fontFamily: [
            'inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ],
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: '22px',
        marginBottom: -1,
        minHeight: 52,
        paddingLeft: 0,
        '&$expanded': {
            minHeight: 52,
            backgroundColor: '#ffffff',
        },
        ['@media all and (min-width: 800px) and (max-width: 1191px)']: {
            backgroundColor: ({ leftnavstate }) => (leftnavstate === 'true' ? '#ffffff' : null),
            paddingRight: ({ leftnavstate }) => (leftnavstate === 'true' ? 0 : null),
        },
        ['@media all and (max-width: 799px)']: {
            backgroundColor: '#ffffff !important',
            paddingRight: 0,
        },
    },
    content: {
        alignItems: 'center',
        margin: '0 18px',
        color: '#11171C',
        ['@media all and (min-width: 800px) and (max-width: 1191px)']: {
            flexDirection: ({ leftnavstate }) => (leftnavstate === 'true' ? 'column' : null),
            padding: ({ leftnavstate }) => (leftnavstate === 'true' ? '16px 0' : null),
        },
        ['@media all and (max-width: 799px)']: {
            flexDirection: 'column',
            padding: '14px 0',
        },
        '&$expanded': {
            margin: '0 18px',
        },
    },
    expandIcon: {
        right: 16,
        top: 4,
        ['@media all and (min-width: 800px) and (max-width: 1191px)']: {
            position: ({ leftnavstate }) => (leftnavstate === 'true' ? 'absolute' : null),
        },
        ['@media all and (max-width: 799px)']: {
            position: 'absolute',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        ['@media all and (min-width: 800px) and (max-width: 1191px)']: {
            paddingTop: ({ leftnavstate }) => (leftnavstate === 'true' ? 0 : null),
        },
        ['@media all and (max-width: 799px)']: {
            paddingTop: 0,
        },
    },
}))(MuiAccordionDetails);

const StudentNameWrapper = styled.div`
    align-items: center;
    display: flex;
    flex-basis: 27%;
    @media all and (min-width: 800px) and (max-width: 1191px) {
        align-self: ${({ leftnavstate }) => (leftnavstate ? 'flex-start' : null)};
    }
    @media all and (max-width: 799px) {
        align-self: flex-start;
    }
`;
const StudentInfoWrapper = styled.div`
    align-items: center;
    display: flex;
    flex-basis: 73%;
    @media all and (min-width: 800px) and (max-width: 1191px) {
        font-size: ${({ leftnavstate }) => (leftnavstate ? '16px' : null)};
        font-weight: ${({ leftnavstate }) => (leftnavstate ? 400 : null)};
        line-height: ${({ leftnavstate }) => (leftnavstate ? '20px' : null)};
        flex-direction: ${({ leftnavstate }) => (leftnavstate ? 'column' : null)};
        width: ${({ leftnavstate }) => (leftnavstate ? '100%' : null)};
    }
    @media all and (max-width: 799px) {
        font-size: 16px;
        font-weight: 400;
        line-height: 20px;
        flex-direction: column;
        width: 100%;
    }
`;

const SummaryStudentName = styled.div`
    flex-basis: 25%;
    justify-content: center;
    /* margin-left: 29px; */
`;
const SummaryStudentPhone = styled.div`
    align-items: center;
    display: flex;
    flex-basis: 24%;
    margin-left: 8px;
    & svg {
        margin-right: 8px;
    }
    & p {
        display: none;
    }
    @media all and (min-width: 800px) and (max-width: 1191px) {
        justify-content: ${({ leftnavstate }) => (leftnavstate ? 'space-between' : null)};
        margin-left: ${({ leftnavstate }) => (leftnavstate ? 0 : null)};
        padding: ${({ leftnavstate }) => (leftnavstate ? '4px 0' : null)};
        width: ${({ leftnavstate }) => (leftnavstate ? '100%' : null)};
        & svg {
            display: ${({ leftnavstate }) => (leftnavstate ? 'none' : null)};
        }
        & p {
            display: ${({ leftnavstate }) => (leftnavstate ? 'initial' : null)};
        }
    }
    @media all and (max-width: 799px) {
        justify-content: space-between;
        margin-left: 0;
        padding: 4px 0;
        width: 100%;
        & svg {
            display: none;
        }
        & p {
            display: initial;
        }
    }
`;
const SummaryStudentAddress = styled.div`
    align-items: center;
    display: flex;
    flex-basis: 62%;
    font-weight: 700;
    & svg {
        margin-right: 8px;
    }
    & p {
        display: none;
    }
    @media all and (min-width: 800px) and (max-width: 1191px) {
        box-shadow: ${({ leftnavstate }) => (leftnavstate ? 'inset 0px -1px 0px #E9EDEF' : null)};
        font-weight: ${({ leftnavstate }) => (leftnavstate ? 400 : null)};
        justify-content: ${({ leftnavstate }) => (leftnavstate ? 'space-between' : null)};
        padding: ${({ leftnavstate }) => (leftnavstate ? '4px 0' : null)};
        width: ${({ leftnavstate }) => (leftnavstate ? '100%' : null)};
        & svg {
            display: ${({ leftnavstate }) => (leftnavstate ? 'none' : null)};
        }
        & p {
            display: ${({ leftnavstate }) => (leftnavstate ? 'initial' : null)};
        }
    }
    @media all and (max-width: 799px) {
        box-shadow: inset 0px -1px 0px #e9edef;
        font-weight: 400;
        justify-content: space-between;
        padding: 4px 0;
        width: 100%;
        & svg {
            display: none;
        }
        & p {
            display: initial;
        }
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
    justify-content: space-between;
    margin-top: 16px;
`;
const ReportSelect = styled.select`
    cursor: pointer;
    background: url(/bg_images/Vector.png) no-repeat 92% 50%;
    background-color: #f4f1fa;
    display: inline-block;
    min-height: 36px;
    min-width: 128px;
    max-width: 320px;
    width: 50%;
    padding: 8px 38px 8px 16px;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 1rem;
    font-weight: 700;
    border: none;
    border-radius: 36px;
    color: #6c46a1;
    letter-spacing: -0.02em;
    line-height: 1.25rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const StudentManagementRoot = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 auto;
    padding: 0;
    width: 100%;
`;

function StudentManage({ onChangeStudentSelection, match, history }) {
    const dispatch = useDispatch();
    const { leftNavGlobal } = useSelector((state) => state.RdxGlobalLeftNavState);

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
                dispatch(openAlertSnackbar('기록이 저장되었습니다.'));
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <StudentManagementRoot>
            <GroupBox
                fullWidth
                title={
                    <>
                        수강 학생 <span style={{ color: '#3AE2A1' }}>{Object.keys(studentDatas).length}</span>
                    </>
                }
            >
                {Object.keys(studentDatas).map((key, idx) => (
                    <Accordion
                        key={key}
                        expanded={expanded === key}
                        leftnavstate={(window.innerWidth > 902 && leftNavGlobal) + ''}
                        onChange={actionExpand(key)}
                    >
                        <AccordionSummary
                            leftnavstate={(window.innerWidth > 902 && leftNavGlobal) + ''}
                            expandIcon={<ExpandMoreIcon />}
                            mark={idx}
                            aria-controls={`${key}bh-content`}
                            id={`${key}bh-header`}
                        >
                            <StudentNameWrapper leftnavstate={window.innerWidth > 902 && leftNavGlobal}>
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
                                <SummaryStudentName>
                                    <Typography type="label" size="xl" bold>
                                        {studentDatas[key][0]['name']}
                                    </Typography>
                                </SummaryStudentName>
                            </StudentNameWrapper>
                            <StudentInfoWrapper leftnavstate={window.innerWidth > 902 && leftNavGlobal}>
                                <SummaryStudentAddress leftnavstate={window.innerWidth > 902 && leftNavGlobal}>
                                    <HomeIcon fontSize="inherit" />
                                    <p>주소</p>
                                    {studentDatas[key][0]['address'] ? studentDatas[key][0]['address'] : '-'}
                                </SummaryStudentAddress>
                                <SummaryStudentPhone leftnavstate={window.innerWidth > 902 && leftNavGlobal}>
                                    <PhoneIcon fontSize="inherit" />
                                    <p>연락처</p>
                                    {studentDatas[key][0]['phone'] ? studentDatas[key][0]['phone'] : '-'}
                                </SummaryStudentPhone>
                            </StudentInfoWrapper>
                        </AccordionSummary>
                        <AccordionDetails leftnavstate={(window.innerWidth > 902 && leftNavGlobal) + ''}>
                            <DetailsRoot>
                                <Notes>
                                    <TextField
                                        multiline
                                        minRows={4}
                                        fullWidth
                                        id={'input-notes-id_' + key}
                                        value={notes['notes-input-' + key]}
                                        variant="filled"
                                        label="특이사항 입력"
                                        name={'notes-input-' + key}
                                        onChange={onNotesInputChange(key)}
                                        InputProps={{
                                            disableUnderline: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <MuiButton
                                                        onClick={() => {
                                                            updateStudentNotes(key);
                                                        }}
                                                    >
                                                        저장
                                                    </MuiButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
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
                                        리포트 보기
                                    </Button>
                                </ReportSelectContainer>
                            </DetailsRoot>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </GroupBox>
        </StudentManagementRoot>
    );
}

export default withRouter(StudentManage);
