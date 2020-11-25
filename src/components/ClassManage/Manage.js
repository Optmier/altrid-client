import React, { useState, useEffect } from 'react';
import ClassWrapper from '../essentials/ClassWrapper';
import '../../styles/manage_page.scss';
import classNames from 'classnames';
import MultipleAutocomplete from '../essentials/MultipleAutocomplete';
import * as $ from 'jquery';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { withRouter } from 'react-router-dom';

function Manage({ match }) {
    const { num } = match.params;
    const [inputState, setInputState] = useState({
        entry_new_name: '',
        entry_new_description: '',
        entry_new_students: [{ name: 'aaa', student_id: '11' }],
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

    useEffect(() => {}, []);

    useEffect(() => {
        if (!selectOpen) {
            setStudentsData([]);
        } else {
            fetchStudents();
        }
    }, [selectOpen]);

    console.log(inputState);
    return (
        <div className="class-manage-root">
            <ClassWrapper col="col">
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
                            getOptionLabel={(option) => option.name + ' - ' + option.student_id}
                            loading={loading}
                            placeholder="수강생 선택"
                        />
                    </div>
                </div>
            </ClassWrapper>
        </div>
    );
}

export default withRouter(Manage);
