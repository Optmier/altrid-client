import React, { useState, useEffect, useRef, useCallback } from 'react';
import ClassWrapper from '../essentials/ClassWrapper';
import '../../styles/manage_page.scss';
import classNames from 'classnames';
import MultipleAutocomplete from '../essentials/MultipleAutocomplete';
import * as $ from 'jquery';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { withRouter } from 'react-router-dom';
import ClassDialogDelete from '../essentials/ClassDialogDelete';
import { Button, withStyles } from '@material-ui/core';
import styled from 'styled-components';
import PopOverClipboard from '../essentials/PopOverClipboard';
import StudentManage from '../ClassStudentManage/StudentManage';
import Leaderboard from '../ClassStudentManage/Leaderboard';

const CopyButton = styled.div`
    pointer-events: ${(props) => (props.state ? 'none' : 'all')};
`;
const FormButton = styled.button`
    background-color: ${(props) => (props.able ? '#FFFFFF' : '#F4F1FA')};
    color: ${(props) => (props.able ? '#3B1689' : '#3B1689')};
    border: ${(props) => (props.able ? '2px solid #3B1689' : 'none')};
    border-radius: 11px;
    font-size: 1rem;
    font-weight: 500;
    width: 129px;
    height: 54px;
    & + & {
        margin-left: 8px;
    }
`;
const ButtonAble = styled.button`
    color: ${(props) => (props.able ? '#3B168A' : '#b2b2b2')};
    border-bottom: ${(props) => (props.able ? '2px solid #3B168A' : 'none')};
`;

const CreateButton = withStyles((theme) => ({
    root: {
        borderRadius: '104px',
        backgroundColor: '#3B1689',
        color: '#FFFFFF',
        fontFamily: 'inherit',
        fontSize: '0.9rem',
        width: '150px',
        height: '56px',

        '&.critical': {
            backgroundColor: '#FFFFFF',
            color: '#11171C',
            border: ' 1.5px solid #9AA5AF',
        },
    },
}))(Button);

function Manage({ match, history }) {
    const textCopy = useRef();

    const { num } = match.params;
    const [inputState, setInputState] = useState({
        entry_new_name: '',
        entry_new_description: '',
        entry_new_students: null,
    });
    const [selectOpen, setSelectOpen] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [studentsData, setStudentsData] = useState([]);
    const [createButtonEnabled, setCreateButtonEnabled] = useState(false);
    const [codeState, setCodeState] = useState('');
    const [clipboardState, setClipboardState] = useState(false);
    const [buttonAble, setButtonAble] = useState({
        월: false,
        화: false,
        수: false,
        목: false,
        금: false,
        토: false,
        일: false,
    });
    const [ablestate, setAblesate] = useState({
        leaderboard: true,
        studentmanage: false,
        classmanage: false,
    });

    const handleInputChange = (e, value) => {
        if ($(e.target).hasClass('default')) {
            setInputState({
                ...inputState,
                [e.target.name]: e.target.value,
            });
        } else {
            setInputState({
                ...inputState,
                entry_new_students: value,
            });
        }
    };
    const handleShareCardList = useCallback(
        (e) => {
            const { name, value } = e.target;

            setAblesate({
                leaderboard: false,
                studentmanage: false,
                classmanage: false,
            });
            setAblesate((prevState) => ({
                ...prevState,
                [name]: !(value === 'true'),
            }));
        },
        [ablestate],
    );

    const fetchStudents = () => {
        Axios.get(`${apiUrl}/students-in-teacher/current`, { withCredentials: true })
            .then((res) => {
                // console.log('선생님의 학생들 : ', res.data);
                setStudentsData(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (!inputState['entry_new_name'].trim()) {
            setCreateButtonEnabled(false);
        } else {
            setCreateButtonEnabled(true);
        }

        // 중복 체크하기
    }, [inputState]);

    useEffect(() => {
        Axios.get(`${apiUrl}/classes/class/${num}`, { withCredentials: true })
            .then((res1) => {
                // Axios.get(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
                //     .then((res2) => {
                //         setInputState({
                //             ...inputState,
                //             entry_new_name: res1.data[0]['class_name'],
                //             entry_new_description: res1.data[0]['description'],
                //             entry_new_students: res2.data.map(({ name, student_id }) => ({
                //                 ...inputState.entry_new_students,
                //                 name: name,
                //                 student_id: student_id,
                //             })),
                //         });
                //     })
                //     .catch((err) => {
                //         console.error(err);
                //     });

                setInputState({
                    ...inputState,
                    entry_new_name: res1.data[0]['class_name'],
                    entry_new_description: res1.data[0]['description'],
                });
                setCodeState(res1.data[0]['class_code']);

                if (res1.data[0]['class_day']) {
                    let daysObj = {};
                    res1.data[0]['class_day'].split(',').map((i) => (daysObj[i] = true));

                    setButtonAble({
                        ...buttonAble,
                        ...daysObj,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });

        // return () => {
        //     setInputState(null);
        // };
    }, []);

    useEffect(() => {
        if (!selectOpen) {
            setStudentsData([]);
        } else {
            fetchStudents();
        }
    }, [selectOpen]);

    /** delete-dialog 메소드 */
    const [deleteDialogopen, setDeleteDialogopen] = useState(false);
    const handleDeleteDialogOpen = () => {
        setDeleteDialogopen(true);
    };
    const handleDeleteDateDialogClose = (e) => {
        const { name } = e.target;

        if (name === 'yes') {
            handleClassDelete(name);
            setDeleteDialogopen(false);
        } else {
            setDeleteDialogopen(false);
        }
    };

    /** 수강생 데이터 처리 */
    const handleStudentInClass = (name) => {
        //수정의 경우 : 학생 데이터 없는 경우-> delete만 진행 // 있는 경우 -> delete 후 post작업 진행
        //삭제의 경우 : 무조건 delete

        Axios.delete(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
            .then((res1) => {
                // // 수정버튼 클릭시
                // if (name === 'modify') {
                //     //수강생이 있는 경우에만, post 작업
                //     if (inputState.entry_new_students.length === 0) {
                //         alert('클래스 정보 수정이 완료되었습니다!');
                //     } else {
                //         Axios.post(
                //             `${apiUrl}/students-in-class`,
                //             {
                //                 classNumber: num,
                //                 students: inputState.entry_new_students,
                //             },
                //             { withCredentials: true },
                //         )
                //             .then((res2) => {
                //                 alert('클래스 정보 수정이 완료되었습니다!');
                //             })
                //             .catch((err) => {
                //                 console.error(err);
                //             });
                //     }
                //     history.replace(`/class/${num}/manage`);
                // }
                // // 삭제버튼 클릭시, 삭제만 진행
                // else {
                alert('삭제 완료되었습니다!');
                history.replace('/');
                //}
            })
            .catch((err) => {
                console.error(err);
            });
    };

    /** 클래스 데이터 삭제 */
    const handleClassDelete = (name) => {
        Axios.delete(`${apiUrl}/classes/${num}`, { withCredentials: true })
            .then((res) => {
                //class table - name, description 삭제 완료!
                handleStudentInClass(name); //수강생 데이터 처리...
            })
            .catch((err) => {
                console.error(err);
            });
    };
    /** 수정, 삭제하기 버튼 */
    const handleButton = (e) => {
        const $target = $(e.target);

        if (!inputState['entry_new_name'].trim()) {
            setInputError(true);
            return;
        } else {
            setInputError(false);
        }

        let name = '';
        if ($target.parents('.button-modify').length !== 0 || $target.attr('class').includes('button-modify')) {
            name = 'modify';
        } else if ($target.parents('.button-delete').length !== 0 || $target.attr('class').includes('button-delete')) {
            name = 'delete';
        }
        if (name === 'modify') {
            let daysArr = [];
            Object.keys(buttonAble)
                .filter((i) => buttonAble[i] === true)
                .map((i) => daysArr.push(i));

            Axios.patch(
                `${apiUrl}/classes/${num}`,
                {
                    name: inputState.entry_new_name,
                    description: inputState.entry_new_description,
                    class_day: daysArr.toString(),
                },
                { withCredentials: true },
            )
                .then((res) => {
                    //name, description 수정 완료!
                    alert('클래스 정보 수정이 완료되었습니다!');
                })
                .catch((err) => {
                    console.error(err);
                });
        } else if (name === 'delete') {
            handleDeleteDialogOpen();
        }
    };
    /**  수업 요일 버튼 */
    const handleDaysButtons = (e) => {
        const { name } = e.target;

        setButtonAble({
            ...buttonAble,
            [name]: !buttonAble[name],
        });
    };
    /**  복사하기 버튼 */
    const handleCopy = () => {
        if (clipboardState) return;

        textCopy.current.select();
        textCopy.current.setSelectionRange(0, 9999);

        document.execCommand('copy');

        console.log(clipboardState);

        setClipboardState(true);
        setTimeout(function () {
            setClipboardState(false);
        }, 3000);
    };

    return (
        <>
            <>
                <ClassWrapper>
                    <div className="class-section-root">
                        <div className="class-share-header">
                            <div className="header-title">학생 및 클래스 </div>
                            <div className="header-menu">
                                <ButtonAble
                                    name="leaderboard"
                                    able={ablestate['leaderboard']}
                                    value={ablestate['leaderboard']}
                                    onClick={handleShareCardList}
                                >
                                    리더보드
                                </ButtonAble>
                                <ButtonAble
                                    name="classmanage"
                                    able={ablestate['classmanage']}
                                    value={ablestate['classmanage']}
                                    onClick={handleShareCardList}
                                >
                                    클래스 관리
                                </ButtonAble>
                                <ButtonAble
                                    name="studentmanage"
                                    able={ablestate['studentmanage']}
                                    value={ablestate['studentmanage']}
                                    onClick={handleShareCardList}
                                >
                                    학생 관리
                                </ButtonAble>
                            </div>
                        </div>
                    </div>
                </ClassWrapper>
                {ablestate['studentmanage'] ? (
                    <div className="test">
                        <StudentManage />
                    </div>
                ) : ablestate['classmanage'] ? (
                    <div className="test">
                        <PopOverClipboard state={clipboardState} />
                        <ClassDialogDelete ver="class" open={deleteDialogopen} handleDialogClose={handleDeleteDateDialogClose} />
                        <ClassWrapper col="col">
                            <div className="class-manage-root">
                                <div>
                                    <div className="manage-inputs">
                                        <h3>클래스 소개</h3>

                                        <div className="class-discription">
                                            <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M3.29348 11C3.09548 10.1513 2.20215 9.45732 1.83549 8.99998C1.20761 8.21551 0.814117 7.26963 0.700328 6.27129C0.586539 5.27296 0.757085 4.26279 1.19232 3.35715C1.62756 2.4515 2.30977 1.68723 3.16039 1.15237C4.011 0.617512 4.99541 0.333824 6.00021 0.333984C7.005 0.334145 7.98932 0.61815 8.83976 1.15328C9.6902 1.68841 10.3722 2.4529 10.8071 3.35869C11.2421 4.26447 11.4123 5.27469 11.2982 6.27299C11.1841 7.27129 10.7903 8.21705 10.1622 9.00132C9.79548 9.45798 8.90348 10.152 8.70548 11H3.29282H3.29348ZM8.66615 12.3333V13C8.66615 13.3536 8.52568 13.6927 8.27563 13.9428C8.02558 14.1928 7.68644 14.3333 7.33282 14.3333H4.66615C4.31253 14.3333 3.97339 14.1928 3.72334 13.9428C3.47329 13.6927 3.33282 13.3536 3.33282 13V12.3333H8.66615ZM6.66615 5.66998V2.99998L3.66615 7.00332H5.33282V9.66998L8.33282 5.66998H6.66615V5.66998Z"
                                                    fill="#FFC043"
                                                />
                                            </svg>
                                            &nbsp; 클래스 소개를 입력해주세요.
                                        </div>

                                        <input
                                            className={classNames('default', inputError ? 'error' : '')}
                                            type="text"
                                            name="entry_new_name"
                                            id="entry_new_name"
                                            placeholder="클래스 이름"
                                            onChange={handleInputChange}
                                            value={inputState['entry_new_name']}
                                        />
                                        <textarea
                                            className="default"
                                            type="text"
                                            name="entry_new_description"
                                            id="entry_new_description"
                                            placeholder="클래스 한줄 설명"
                                            onChange={handleInputChange}
                                            value={inputState['entry_new_description']}
                                        />
                                    </div>
                                    <div className="manage-inputs">
                                        <h3>수업 요일</h3>
                                        <div className="class-discription">
                                            <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M3.29348 11C3.09548 10.1513 2.20215 9.45732 1.83549 8.99998C1.20761 8.21551 0.814117 7.26963 0.700328 6.27129C0.586539 5.27296 0.757085 4.26279 1.19232 3.35715C1.62756 2.4515 2.30977 1.68723 3.16039 1.15237C4.011 0.617512 4.99541 0.333824 6.00021 0.333984C7.005 0.334145 7.98932 0.61815 8.83976 1.15328C9.6902 1.68841 10.3722 2.4529 10.8071 3.35869C11.2421 4.26447 11.4123 5.27469 11.2982 6.27299C11.1841 7.27129 10.7903 8.21705 10.1622 9.00132C9.79548 9.45798 8.90348 10.152 8.70548 11H3.29282H3.29348ZM8.66615 12.3333V13C8.66615 13.3536 8.52568 13.6927 8.27563 13.9428C8.02558 14.1928 7.68644 14.3333 7.33282 14.3333H4.66615C4.31253 14.3333 3.97339 14.1928 3.72334 13.9428C3.47329 13.6927 3.33282 13.3536 3.33282 13V12.3333H8.66615ZM6.66615 5.66998V2.99998L3.66615 7.00332H5.33282V9.66998L8.33282 5.66998H6.66615V5.66998Z"
                                                    fill="#FFC043"
                                                />
                                            </svg>
                                            &nbsp; 수업 요일을 모두 선택해주세요. 중복선택이 가능합니다.
                                        </div>
                                        <div className="form-buttons">
                                            <FormButton name="월" able={buttonAble['월']} onClick={handleDaysButtons}>
                                                월
                                            </FormButton>
                                            <FormButton name="화" able={buttonAble['화']} onClick={handleDaysButtons}>
                                                화
                                            </FormButton>
                                            <FormButton name="수" able={buttonAble['수']} onClick={handleDaysButtons}>
                                                수
                                            </FormButton>
                                            <FormButton name="목" able={buttonAble['목']} onClick={handleDaysButtons}>
                                                목
                                            </FormButton>
                                            <FormButton name="금" able={buttonAble['금']} onClick={handleDaysButtons}>
                                                금
                                            </FormButton>
                                            <FormButton name="토" able={buttonAble['토']} onClick={handleDaysButtons}>
                                                토
                                            </FormButton>
                                            <FormButton name="일" able={buttonAble['일']} onClick={handleDaysButtons}>
                                                일
                                            </FormButton>
                                        </div>
                                    </div>
                                </div>

                                <div className="manage-footer">
                                    <CreateButton
                                        className="button-delete critical"
                                        size="large"
                                        variant="contained"
                                        disabled={!createButtonEnabled}
                                        name="delete"
                                        onClick={handleButton}
                                    >
                                        삭제하기
                                    </CreateButton>
                                    <CreateButton
                                        className="button-modify"
                                        size="large"
                                        variant="contained"
                                        disabled={!createButtonEnabled}
                                        name="modify"
                                        onClick={handleButton}
                                    >
                                        수정하기
                                    </CreateButton>
                                </div>
                            </div>
                        </ClassWrapper>
                    </div>
                ) : ablestate['leaderboard'] ? (
                    <div className="test">
                        <Leaderboard />
                    </div>
                ) : null}
            </>
        </>
    );
}

export default withRouter(Manage);
