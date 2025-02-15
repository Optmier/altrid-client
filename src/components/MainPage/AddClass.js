import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import { Button, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import * as $ from 'jquery';
import Axios from 'axios';
import * as configs from '../../configs/config.json';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { openAlertSnackbar } from '../../redux_modules/alertMaker';

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
    const dispatch = useDispatch();
    const [addButtonEnabled, setAddButtonEnabled] = useState(false);
    const [inputState, setInputState] = useState('');
    const [inputError, setInputError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('존재하지 않는 코드이거나 아직 생성되지 않은 클래스입니다.');

    const handleInputChange = (e) => {
        if ($(e.target).hasClass('default')) {
            setInputState(e.target.value);
        }
    };

    const handleClickAdd = async () => {
        if (!inputState.trim()) {
            setInputError(true);
            return;
        } else {
            setInputError(false);
        }

        try {
            const res = await Promise.all([
                Axios.get(`${configs.SERVER_HOST}/classes/class-code/${inputState}`, { withCredentials: true }),
                Axios.get(`${configs.SERVER_HOST}/plan-info/students-num`, { withCredentials: true }),
            ]);

            // 1. 해당 클래스 코드가 존재하는지 조회
            if (!res[0].data[0]['is_exists']) {
                setErrorMessage('존재하지 않는 코드이거나 아직 생성되지 않은 클래스입니다.');
                setInputError(true);
            }
            // 2. 해당 클래스 코드가 다른 학원 클래스 코드인지 확인
            else if (sessions.academyCode !== '' && sessions.academyCode !== res[0].data[0]['academy_code']) {
                setErrorMessage('해당 학원의 코드값이 아닙니다.');
                setInputError(true);
            }
            // 3. 해당 클래스를 소유한 선생님의 학생 수가 63명 미만인지 확인
            else if (res[1].data[0]['studentNums'] >= 63) {
                setErrorMessage('학생 초대 인원이 초과되었습니다. 선생님께 문의 부탁드립니다.');
                setInputError(true);
            } else {
                /** acadamey code 값, token refresh */
                Axios.patch(
                    `${configs.SERVER_HOST}/auth`,
                    {
                        academyCode: res[0].data[0]['academy_code'],
                    },
                    { withCredentials: true },
                )
                    .then((res2) => {
                        console.log('refresh token!');
                    })
                    .catch((err) => {
                        console.log('refresh error...');
                        console.error(err);
                    });

                /**  특정 학원생 academy code update */
                Axios.put(
                    `${configs.SERVER_HOST}/students/academy-code`,
                    {
                        academyCode: res[0].data[0]['academy_code'],
                    },
                    { withCredentials: true },
                )
                    .then((res2) => {
                        console.log('update academy code!');
                    })
                    .catch((err) => {
                        console.log('update error...');
                        console.error(err);
                    });

                /** student-in-class table에 학생 정보 insert */
                Axios.post(
                    `${configs.SERVER_HOST}/students-in-class`,
                    {
                        class_number: res[0].data[0]['idx'],
                        student_id: sessions.authId,
                        class_code: inputState,
                        academy_code: res[0].data[0]['academy_code'],
                    },
                    { withCredentials: true },
                )
                    .then((res2) => {
                        dispatch(openAlertSnackbar('클래스에 성공적으로 입장하였습니다.'));
                        /** 클래스 페이지로 redirect  */
                        history.push(`/${res[0].data[0]['idx']}/dashboard`);
                    })
                    .catch((err) => {
                        console.log('post error...');
                        console.error(err);
                        if (err.response.data.code === 'ER_DUP_ENTRY') {
                            setErrorMessage('이미 추가된 클래스 입니다.');
                            setInputError(true);
                        }
                    });

                setInputError(false);
            }
        } catch (e) {
            dispatch(openAlertSnackbar('서버 에러입니다. 지속될 시 기술 지원 문의 바랍니다.', 'error', 5000));
            console.error(e);
        }
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
                    <h2>코드를 통해 클래스에 입장해주세요 :)</h2>
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
                    placeholder="전달 받은 수업 코드를 입력해주세요."
                    onChange={handleInputChange}
                    value={inputState}
                />
                {inputError ? <p style={{ color: '#ff4646', fontSize: '0.875rem', margin: '10px' }}>{errorMessage}</p> : null}
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
