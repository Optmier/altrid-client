import React, { useState, useEffect } from 'react';
import ClassWrapper from '../essentials/ClassWrapper';
import '../../styles/manage_page.scss';
import classNames from 'classnames';
import MultipleAutocomplete from '../essentials/MultipleAutocomplete';
import * as $ from 'jquery';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { withRouter } from 'react-router-dom';
import ClassDialogDelete from '../essentials/ClassDialogDelete';

function Manage({ match, history }) {
    const { num } = match.params;
    const [inputState, setInputState] = useState({
        entry_new_name: '',
        entry_new_description: '',
        entry_new_students: null,
    });
    const [selectOpen, setSelectOpen] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [studentsData, setStudentsData] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const fetchStudents = () => {
        setLoading(true);
        Axios.get(`${apiUrl}/students-in-teacher/current`, { withCredentials: true })
            .then((res) => {
                console.log('선생님의 학생들 : ', res.data);
                setStudentsData(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        Axios.get(`${apiUrl}/classes/class/${num}`, { withCredentials: true })
            .then((res1) => {
                Axios.get(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
                    .then((res2) => {
                        setInputState({
                            ...inputState,
                            entry_new_name: res1.data[0]['class_name'],
                            entry_new_description: res1.data[0]['description'],
                            entry_new_students: res2.data.map(({ name, student_id }) => ({
                                ...inputState.entry_new_students,
                                name: name,
                                student_id: student_id,
                            })),
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
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
    /** 수강생 데이터 처리 */
    const handleStudentInClass = (name) => {
        Axios.delete(`${apiUrl}/students-in-class/${num}`, { withCredentials: true })
            .then((res1) => {
                // 수정버튼 클릭시,
                if (name === 'modify' && inputState.entry_new_students.length !== 0) {
                    //수강생이 있는 경우.. post 작업

                    Axios.post(
                        `${apiUrl}/students-in-class`,
                        {
                            classNumber: num,
                            students: inputState.entry_new_students,
                        },
                        { withCredentials: true },
                    )
                        .then((res2) => {
                            //console.log('추가', res2.data);
                            alert('과제 수정이 완료되었습니다 !');
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }
                // 삭제버튼 클릭시, 삭제만 진행
                else {
                    alert('삭제 완료되었습니다!');
                    history.replace('/');
                }
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
        const { name } = e.target;

        if (name === 'modify') {
            Axios.patch(
                `${apiUrl}/classes/${num}`,
                {
                    name: inputState.entry_new_name,
                    description: inputState.entry_new_description,
                },
                { withCredentials: true },
            )
                .then((res) => {
                    //name, description 수정 완료!
                    handleStudentInClass(name); //수강생 데이터 처리...
                })
                .catch((err) => {
                    console.error(err);
                });
        } else if (name === 'delete') {
            handleDeleteDialogOpen();
        }
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

    return (
        <>
            <ClassDialogDelete open={deleteDialogopen} handleDialogClose={handleDeleteDateDialogClose} />

            <ClassWrapper col="col">
                <div className="class-manage-root">
                    <div>
                        <div className="manage-header">
                            <h2 className="manage-title">클래스 편집이 가능합니다.</h2>
                            <p className="manage-subTitle">과제의 기본적인 정보를 입력해주세요.</p>
                        </div>

                        <div className="manage-inputs">
                            <input
                                className={classNames('default', inputError ? 'error' : '')}
                                type="text"
                                name="entry_new_name"
                                id="entry_new_name"
                                placeholder="클래스 이름"
                                onChange={handleInputChange}
                                value={inputState['entry_new_name']}
                            />
                            <input
                                className="default"
                                type="text"
                                name="entry_new_description"
                                id="entry_new_description"
                                placeholder="클래스 한줄 설명"
                                onChange={handleInputChange}
                                value={inputState['entry_new_description']}
                            />
                            <div className="multiple-input">
                                {inputState.entry_new_students ? (
                                    <MultipleAutocomplete
                                        id="entry_new_students"
                                        onOpen={() => {
                                            setSelectOpen(true);
                                        }}
                                        onClose={() => {
                                            setSelectOpen(false);
                                        }}
                                        onChange={handleInputChange}
                                        value={inputState['entry_new_students']}
                                        options={studentsData}
                                        getOptionLabel={(option) => option.name}
                                        loading={loading}
                                        placeholder="수강생 선택"
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="manage-footer">
                        <button name="delete" onClick={handleButton}>
                            삭제하기
                        </button>
                        <button name="modify" onClick={handleButton}>
                            수정하기
                        </button>
                    </div>
                </div>
            </ClassWrapper>
        </>
    );
}

export default withRouter(Manage);
