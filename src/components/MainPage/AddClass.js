import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Button, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import * as $ from 'jquery';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { $_classDefault } from '../../configs/front_urls';

const AddButton = withStyles((theme) => ({
    root: {
        borderRadius: '10px',
        backgroundColor: '#a6a6a6',
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '0.9rem',
        width: '150px',
        height: '56px',
    },
}))(Button);

function AddClass({ handleClose, history }) {
    const sessions = useSelector((state) => state.RdxSessions);

    const [addButtonEnabled, setAddButtonEnabled] = useState(false);
    const [inputState, setInputState] = useState('');
    const [inputError, setInputError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('존재하지 않는 코드이거나 아직 생성되지 않은 클래스입니다.');

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
        Axios.get(`${apiUrl}/classes/class-code/${inputState}`, { withCredentials: true })
            .then((res) => {
                if (!res.data[0]['is_exists']) {
                    setErrorMessage('존재하지 않는 코드이거나 아직 생성되지 않은 클래스입니다.');
                    setInputError(true);
                } else {
                    // console.log(res);
                    setInputError(false);
                    Axios.post(
                        `${apiUrl}/students-in-class`,
                        {
                            class_number: res.data[0]['idx'],
                            student_id: sessions.authId,
                            class_code: inputState,
                            academy_code: res.data[0]['academy_code'],
                        },
                        { withCredentials: true },
                    )
                        .then((res2) => {
                            alert('클래스에 성공적으로 입장하였습니다 :)');
                            history.push(`${$_classDefault}/${res.data[0]['idx']}/share`);
                        })
                        .catch((err) => {
                            console.error(err);
                            if (err.response.data.code === 'ER_DUP_ENTRY') {
                                setErrorMessage('이미 추가된 클래스 입니다.');
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
            <div className="drawer-header">
                <div className="title">
                    <h2>클래스에 코드를 통해 입장해보세요 :)</h2>
                </div>
                <div className="close-icon" onClick={handleClose}>
                    <CloseIcon />
                </div>
            </div>
            <div className="form-container">
                <div className="form-title">수업 코드</div>
                <input
                    className={classNames('default', inputError ? 'error' : '')}
                    type="text"
                    name="teacher_id"
                    id="teacher_id"
                    placeholder="발급 받은 수업 코드를 입력해주세요."
                    onChange={handleInputChange}
                    value={inputState}
                />
                {inputError ? <p style={{ color: '#ff4646', fontSize: '0.875rem', margin: '2px 2px' }}>{errorMessage}</p> : null}
            </div>
            <div className="create-button">
                <AddButton size="large" variant="contained" disabled={!addButtonEnabled} onClick={handleClickAdd}>
                    입장하기
                </AddButton>
            </div>
        </div>
    );
}

export default withRouter(AddClass);
