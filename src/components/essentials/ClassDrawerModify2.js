import React, { useState, useEffect } from 'react';
import '../../styles/class_drawer.scss';
import ToggleSwitch from './ToggleSwitch';
import styled from 'styled-components';
import { SecondtoMinute } from './TimeChange';
import { Route, withRouter } from 'react-router-dom';
import MakeContents from '../../pages/MakeContents';
import { useSelector, useDispatch } from 'react-redux';
import { patchDraft, goToHome } from '../../redux_modules/assignmentDraft';

const StyleInput = styled.input`
    &::placeholder {
        color: black;
        font-weight: 600;
    }
`;
function ClassDrawerModify({ cardData, handleClose }) {
    /** redux state */
    const { data, loading, error } = useSelector((state) => state.assignmentDraft.draftDatas); //axios 작업 없으니, loading과 error는 필요 x
    const dispatch = useDispatch();

    let titleArr = [];
    Object.keys(data).map((i) => titleArr.push(data[i]['title'].replace(/(\s*)/g, '')));

    /** 여러개 input 상태 관리 */
    //1. text-input
    const [inputs, setInputs] = useState({
        title: cardData['title'],
        description: cardData['description'],
    });
    const [inputsError, setInputsError] = useState({
        title_error: '',
        description_error: '',
    });

    const { title, description } = inputs;
    const { title_error, description_error } = inputsError;

    const onInputChange = (e) => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    };
    const onInputOut = (e) => {
        const { name, value } = e.target;
        console.log('input out!', titleArr, value);

        if (name === 'title') {
            if (value === '') {
                setInputsError({
                    ...inputsError,
                    title_error: '빈칸을 채워주세요!',
                });
            } else {
                titleArr.includes(title)
                    ? setInputsError({
                          ...inputsError,
                          title_error: '과제 제목이 중복되었습니다 :(',
                      })
                    : setInputsError({
                          ...inputsError,
                          title_error: '',
                      });
            }
        } else if (name === 'description') {
            if (value === '') {
                setInputsError({
                    ...inputsError,
                    description_error: '빈칸을 채워주세요!',
                });
            } else {
                setInputsError({
                    ...inputsError,
                    description_error: '',
                });
            }
        }
    };

    //2. time-input
    let mmm, sss, time_limit;

    if (!cardData['time_limit']) {
        mmm = '--';
        sss = '--';
        time_limit = false;
    } else {
        mmm = SecondtoMinute(cardData['time_limit'])[0];
        sss = SecondtoMinute(cardData['time_limit'])[1];
        time_limit = true;
    }

    const [timeInputs, setTimeInputs] = useState({
        mm: mmm,
        ss: sss,
    });
    const { mm, ss } = timeInputs;
    const onTimeChange = (e) => {
        const { value, name } = e.target;
        if (value.length > '2') {
            return 0;
        }

        setTimeInputs({
            ...timeInputs,
            [name]: value,
        });
    };

    /** toggle-state 상태 관리 */
    const [toggleState, setToggleState] = useState({
        eyetrack: cardData['eyetrack'],
        timeAttack: time_limit,
    });

    const handleChange = (event) => {
        setToggleState({ ...toggleState, [event.target.name]: event.target.checked });

        if (!event.target.checked && event.target.name === 'timeAttack') {
            setTimeInputs({
                mm: '--',
                ss: '--',
            });
        } else if (event.target.checked && event.target.name === 'timeAttack') {
            setTimeInputs({
                mm: '',
                ss: '',
            });
        }
    };

    /** card 정보 수정하기 */
    const onCardModify = (e) => {
        //1. title, description 빈칸 아님 체크
        if (!title) {
            setInputsError({
                ...inputsError,
                title_error: '빈칸을 채워주세요!',
            });
            console.log('아직 오류 중..');
            return;
        }
        if (!description) {
            setInputsError({
                ...inputsError,
                description_error: '빈칸을 채워주세요!',
            });
            console.log('아직 오류 중..');
            return;
        }

        //2. title_error, description_error 빈칸 체크
        if (title_error !== '' || description_error !== '') {
            console.log('아직 오류 중..');
            return;
        }

        //3. axios-patch 작업
        let result = window.confirm('과제 내용을 수정하시겠습니까?');
        if (result) {
            dispatch(patchDraft(cardData, inputs, timeInputs, toggleState, handleClose, e));
            handleClose(e);
        }
    };

    if (loading) return <div style={{ width: '700px' }}>로딩 중....</div>; // 로딩중이고 데이터 없을때만
    if (error) return <div>에러 발생!</div>;
    if (!data) return null;

    return (
        <div className="class-drawer-root">
            <div style={{ width: '100%' }}>
                <h2 className="drawer-title">과제 수정이 가능합니다 !</h2>
                <p className="drawer-subTitle">
                    수정된 정보는 <b style={{ fontWeight: '600' }}>이미 공유된 과제</b>에 반영되지 않습니다. <br /> 수정된 정보의 반영을
                    원하시는 경우, 다시 공유를 해주시길 바랍니다.
                </p>

                <div className="drawer-inputs">
                    <div className="drawer-input">
                        <StyleInput
                            name="title"
                            value={title}
                            className="input-name"
                            onChange={onInputChange}
                            onBlur={onInputOut}
                        ></StyleInput>
                        <div className="drawer-error">{title_error}</div>
                    </div>
                    <div className="drawer-input">
                        <StyleInput
                            name="description"
                            value={description}
                            className="input-desc"
                            onChange={onInputChange}
                            onBlur={onInputOut}
                        ></StyleInput>
                        <div className="drawer-error">{description_error}</div>
                    </div>
                    <div className="drawer-input">
                        <div className="input-upload">
                            <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M38.7 12.08C37.34 5.18 31.28 0 24 0C18.22 0 13.2 3.28 10.7 8.08C4.68 8.72 0 13.82 0 20C0 26.62 5.38 32 12 32H38C43.52 32 48 27.52 48 22C48 16.72 43.9 12.44 38.7 12.08ZM28 18V26H20V18H14L24 8L34 18H28Z"
                                    fill="#969393"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="drawer-toggle">
                    <span>
                        <p>시선흐름 측정</p>
                        <ToggleSwitch
                            name={'eyetrack'}
                            toggle={toggleState['eyetrack']}
                            handleToggleChange={handleChange}
                            type={'drawer'}
                        />
                    </span>
                    <span>
                        <p>제한시간 설정</p>

                        <div className="time-inputs">
                            <input
                                type="text"
                                name="mm"
                                value={mm}
                                readOnly={mm === '--' ? true : false}
                                onChange={onTimeChange}
                                placeholder="00"
                            />
                            <p>분</p>
                            <input
                                type="text"
                                name="ss"
                                value={ss}
                                readOnly={ss === '--' ? true : false}
                                onChange={onTimeChange}
                                placeholder="00"
                            />
                            <p>초</p>
                        </div>

                        <ToggleSwitch
                            name={'timeAttack'}
                            toggle={toggleState['timeAttack']}
                            handleToggleChange={handleChange}
                            type={'drawer'}
                        />
                    </span>
                </div>
            </div>
            <div className="drawer-footer" onClick={onCardModify}>
                <div className="drawer-button">수정하기</div>
            </div>
        </div>
    );
}

export default withRouter(ClassDrawerModify);
