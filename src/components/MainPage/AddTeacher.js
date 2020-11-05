import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Button, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import * as $ from 'jquery';
import MultipleAutocomplete from '../essentials/MultipleAutocomplete';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';

const AddButton = withStyles((theme) => ({
    root: {
        color: '#474747',
        fontFamily: 'inherit',
        minWidth: 128,
        minHeight: 52,
    },
}))(Button);

function AddTeacher({ handleClose }) {
    const [addButtonEnabled, setAddButtonEnabled] = useState(false);
    const [inputState, setInputState] = useState('');
    const [inputError, setInputError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('존재하지 않는 이메일 또는 아이디 값입니다.');

    const handleInputChange = (e) => {
        if ($(e.target).hasClass('default')) {
            setInputState(e.target.value);
        }
    };

    const handleClickAdd = () => {
        if (!inputState.trim()) {
            setInputError(true);
            return;
        } else {
            setInputError(false);
        }
        Axios.get(`${apiUrl}/teachers/in-class/current/${inputState}`, { withCredentials: true })
            .then((res) => {
                console.log(res);
                if (!res.data.is_exists) {
                    setErrorMessage('존재하지 않는 이메일 또는 아이디 값입니다.');
                    setInputError(true);
                } else {
                    setInputError(false);
                    Axios.post(
                        `${apiUrl}/students-in-teacher`,
                        {
                            teacherId: inputState,
                        },
                        { withCredentials: true },
                    )
                        .then((res) => {
                            alert('성공적으로 추가되었습니다!\n선생님이 클래스를 생성하실 경우 목록에서 확인하실 수 있습니다.');
                        })
                        .catch((err) => {
                            console.error(err);
                            if (err.response.data.code === 'ER_DUP_ENTRY') {
                                setErrorMessage('이미 추가된 선생님 입니다.');
                                setInputError(true);
                            }
                        });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (!inputState.trim()) {
            setAddButtonEnabled(false);
        } else {
            setAddButtonEnabled(true);
            setInputError(false);
        }

        // 중복 체크하기
    }, [inputState]);

    return (
        <div className="create-new-entry-root">
            <div className="close-icon" onClick={handleClose}>
                <CloseIcon />
            </div>
            <div className="title">
                <h2>선생님의 이메일 또는 인증 아이디를 입력해 주세요.</h2>
            </div>
            <div className="form-container">
                <input
                    className={classNames('default', inputError ? 'error' : '')}
                    type="text"
                    name="teacher_id"
                    id="teacher_id"
                    placeholder="선생님 이메일 또는 인증 아이디"
                    onChange={handleInputChange}
                    value={inputState}
                />
                {inputError ? <p style={{ color: '#ff4646', fontSize: '0.875rem', margin: '2px 2px' }}>{errorMessage}</p> : null}
            </div>
            <div className="create-button">
                <AddButton size="large" variant="contained" disabled={!addButtonEnabled} onClick={handleClickAdd}>
                    전송
                </AddButton>
            </div>
        </div>
    );
}

export default AddTeacher;
