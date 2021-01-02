import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Button, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import * as $ from 'jquery';
import MultipleAutocomplete from '../essentials/MultipleAutocomplete';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { $_classDefault } from '../../configs/front_urls';
import styled from 'styled-components';

const CreateButton = withStyles((theme) => ({
    root: {
        borderRadius: '10px',
        backgroundColor: '#13E2A1',
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '0.9rem',
        width: '150px',
        height: '56px',
    },
}))(Button);

const FormButton = styled.button`
    background-color: ${(props) => (props.able ? '#43138b' : '#f6f7f9')};
    color: ${(props) => (props.able ? 'white' : '#707070')};

    border-radius: 11px;
    font-size: 1rem;
    font-weight: 500;
    padding: 14px 24px;
`;

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
    const [buttonAble, setButtonAble] = useState({
        월: false,
        화: false,
        수: false,
        목: false,
        금: false,
        토: false,
        일: false,
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

    const handleClickCreate = () => {
        let daysArr = [];

        if (!inputState['entry_new_name'].trim()) {
            setInputError(true);
            return;
        } else {
            setInputError(false);
        }

        Object.keys(buttonAble)
            .filter((i) => buttonAble[i] === true)
            .map((i) => daysArr.push(i));

        Axios.post(
            `${apiUrl}/classes`,
            {
                name: inputState.entry_new_name,
                description: inputState.entry_new_description,
                days: daysArr.toString(),
            },
            { withCredentials: true },
        )
            .then((res1) => {
                // if (inputState.entry_new_students.length > 0)
                //     Axios.post(
                //         `${apiUrl}/students-in-class`,
                //         {
                //             classNumber: res1.data.insertId,
                //             students: inputState.entry_new_students,
                //         },
                //         { withCredentials: true },
                //     )
                //         .then((res2) => {
                //             // console.log('클래스가 생성됨.');
                //             history.push(`${$_classDefault}/${res1.data.insertId}/draft`);
                //         })
                //         .catch((err) => {
                //             console.error(err);
                //         });
                // else {
                //     // console.log('클래스가 생성됨.');
                //     history.push(`${$_classDefault}/${res1.data.insertId}/draft`);
                // }
                history.push(`${$_classDefault}/${res1.data.insertId}/share`);
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

    const handleButtons = (e) => {
        const { name } = e.target;
        console.log(name, buttonAble[name]);

        setButtonAble({
            ...buttonAble,
            [name]: !buttonAble[name],
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
            <div className="drawer-header">
                <div className="title">
                    <h2>클래스를 생성하여 시작해보세요 :)</h2>
                </div>
                <div className="close-icon" onClick={handleClose}>
                    <CloseIcon />
                </div>
            </div>

            <div className="form-container">
                <div className="form-title">클래스 소개</div>
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
                {/* <div style={{ marginTop: 24 }}>
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
                        renderOption={(option, state) => (
                            <React.Fragment>
                                {option.name} [{option.email}]
                            </React.Fragment>
                        )}
                        loading={loading}
                        placeholder="수강생 선택"
                    />
                </div> */}
                <div className="form-title">
                    <div>
                        수업 요일<span>(선택)</span>
                    </div>
                    <span className="form-info">*수업 요일을 모두 선택해주세요.</span>
                </div>
                <div className="form-buttons">
                    <FormButton name="월" able={buttonAble['월']} onClick={handleButtons}>
                        월
                    </FormButton>
                    <FormButton name="화" able={buttonAble['화']} onClick={handleButtons}>
                        화
                    </FormButton>
                    <FormButton name="수" able={buttonAble['수']} onClick={handleButtons}>
                        수
                    </FormButton>
                    <FormButton name="목" able={buttonAble['목']} onClick={handleButtons}>
                        목
                    </FormButton>
                    <FormButton name="금" able={buttonAble['금']} onClick={handleButtons}>
                        금
                    </FormButton>
                    <FormButton name="토" able={buttonAble['토']} onClick={handleButtons}>
                        토
                    </FormButton>
                    <FormButton name="일" able={buttonAble['일']} onClick={handleButtons}>
                        일
                    </FormButton>
                </div>
            </div>
            <div className="create-button">
                <CreateButton size="large" variant="contained" disabled={!createButtonEnabled} onClick={handleClickCreate}>
                    생성하기
                </CreateButton>
            </div>
        </div>
    );
}

export default CreateNewEntry;
