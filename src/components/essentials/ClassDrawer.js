import React, { useState } from 'react';
import '../../styles/class_drawer.scss';
import ToggleSwitch from './ToggleSwitch';
import { useSelector, useDispatch } from 'react-redux';
import { postDraft } from '../../redux_modules/assignmentDraft';
import { withRouter } from 'react-router-dom';

function ClassDrawer({ handleClose }) {
    /** redux-state */
    const { data, loading, error } = useSelector((state) => state.assignmentDraft.draftDatas);
    const dispatch = useDispatch();

    let titleArr = [];
    if (!titleArr) {
        Object.keys(data).map((i) => titleArr.push(data[i]['title'].replace(/(\s*)/g, '')));
    }

    /** 여러개 input 상태 관리 */
    //1. text-input
    const [inputs, setInputs] = useState({
        title: '',
        description: '',
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
    const [timeInputs, setTimeInputs] = useState({
        mm: '',
        ss: '',
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
        eyetrack: true,
        timeAttack: true,
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

    /** 생성하기, 생성 및 공유하기 */
    const onCardDraft = (e) => {
        //1. title, description 빈칸 아님 체크
        if (!title) {
            setInputsError({
                ...inputsError,
                title_error: '빈칸을 채워주세요!',
            });
            return;
        }
        if (!description) {
            setInputsError({
                ...inputsError,
                description_error: '빈칸을 채워주세요!',
            });
            return;
        }

        //2. title_error, description_error 빈칸 체크
        if (title_error !== '' || description_error !== '') {
            console.log('아직 오류 중..');
            return;
        }

        //3. axios-post 작업
        dispatch(postDraft(inputs, timeInputs, toggleState, handleClose, e));
        handleClose(e);
    };

    if (loading) return <div style={{ width: '700px' }}>로딩 중!!!!</div>; // 로딩중이고 데이터 없을때만
    if (error) return <div>에러 발생!</div>;
    if (!data) return null;

    return (
        <div className="class-drawer-root">
            <div style={{ width: '100%' }}>
                <h2 className="drawer-title">과제를 생성해보세요 :)</h2>
                <p className="drawer-subTitle">과제의 기본적인 정보를 입력해주세요.</p>

                <div className="drawer-inputs">
                    <div className="drawer-input">
                        <input
                            name="title"
                            value={title}
                            className="input-name"
                            placeholder="과제 이름"
                            onChange={onInputChange}
                            onBlur={onInputOut}
                        ></input>
                        <div className="drawer-error">{title_error}</div>
                    </div>
                    <div className="drawer-input">
                        <input
                            name="description"
                            value={description}
                            className="input-desc"
                            placeholder="과제 한 줄 설명"
                            onChange={onInputChange}
                            onBlur={onInputOut}
                        ></input>
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

            <div className="drawer-footer">
                <button className="drawer-button" name="drawer-draft" onClick={onCardDraft}>
                    생성하기
                </button>
                <button className="drawer-button" name="drawer-share" onClick={onCardDraft}>
                    생성 및 공유하기
                </button>
            </div>
        </div>
    );
}

export default React.memo(withRouter(ClassDrawer));
