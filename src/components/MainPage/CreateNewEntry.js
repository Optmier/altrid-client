import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Button, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import * as $ from 'jquery';
import MultipleAutocomplete from '../essentials/MultipleAutocomplete';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';

const CreateButton = withStyles((theme) => ({
    root: {
        color: '#474747',
        fontFamily: 'inherit',
        minWidth: 128,
        minHeight: 52,
    },
}))(Button);

function CreateNewEntry({ history, handleClose }) {
    const [createButtonEnabled, setCreateButtonEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectOpen, setSelectOpen] = useState(false);
    const [inputState, setInputState] = useState({
        entry_new_name: '',
        entry_new_description: '',
        entry_new_students: [],
    });
    const [inputError, setInputError] = useState(false);
    const [studentsData, setStudentsData] = useState([]);

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

    const handleClickCreate = () => {
        if (!inputState['entry_new_name'].trim()) {
            setInputError(true);
            return;
        } else {
            setInputError(false);
        }
        Axios.post(
            `${apiUrl}/classes`,
            {
                name: inputState.entry_new_name,
                description: inputState.entry_new_description,
            },
            { withCredentials: true },
        )
            .then((res1) => {
                if (inputState.entry_new_students.length > 0)
                    Axios.post(
                        `${apiUrl}/students-in-class`,
                        {
                            classNumber: res1.data.insertId,
                            students: inputState.entry_new_students,
                        },
                        { withCredentials: true },
                    )
                        .then((res2) => {
                            console.log('클래스가 생성됨.');
                            history.push(`/class/${res1.data.insertId}`);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                else {
                    console.log('클래스가 생성됨.');
                    history.push(`/class/${res1.data.insertId}`);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const fetchStudents = () => {
        setLoading(true);
        Axios.get(`${apiUrl}/students-in-teacher/current`, { withCredentials: true })
            .then((res) => {
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
        if (!inputState['entry_new_name'].trim()) {
            setCreateButtonEnabled(false);
        } else {
            setCreateButtonEnabled(true);
        }

        // 중복 체크하기
    }, [inputState]);

    useEffect(() => {
        if (!selectOpen) {
            setStudentsData([]);
        } else {
            fetchStudents();
        }
    }, [selectOpen]);

    return (
        <div className="create-new-entry-root">
            <div className="close-icon" onClick={handleClose}>
                <CloseIcon />
            </div>
            <div className="title">
                <h2>클래스를 생성하여 시작해보세요 :)</h2>
            </div>
            <div className="form-container">
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
                <div style={{ marginTop: 24 }}>
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
            <div className="create-button">
                <CreateButton size="large" variant="contained" disabled={!createButtonEnabled} onClick={handleClickCreate}>
                    만들기
                </CreateButton>
            </div>
        </div>
    );
}

export default CreateNewEntry;
