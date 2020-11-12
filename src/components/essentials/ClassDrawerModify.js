import React, { useState } from 'react';
import '../../styles/class_drawer.scss';
import ToggleSwitch from './ToggleSwitch';
import assignmentDummy from '../../datas/assignmentDummy.json';
import styled from 'styled-components';
import { SecondtoMinute } from '../essentials/TimeChange';
import { Route, withRouter } from 'react-router-dom';
import MakeContents from '../../pages/MakeContents';

const StyleInput = styled.input`
    &::placeholder {
        color: black;
        font-weight: 600;
    }
`;
function ClassDrawerModify({ testNum }) {
    let mmm = SecondtoMinute(assignmentDummy[testNum]['time'])[0];
    let sss = SecondtoMinute(assignmentDummy[testNum]['time'])[1];
    let timeState = true;

    if (!mmm) {
        mmm = '--';
        sss = '--';
        timeState = false;
    }

    const [timeInputs, setTimeInputs] = useState({
        mm: '',
        ss: '',
    });
    const { mm, ss } = timeInputs;

    const [toggleState, setToggleState] = useState({
        eyetrack: assignmentDummy[testNum]['eyetrack'],
        timeAttack: timeState,
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

    const onChange = (e) => {
        const { value, name } = e.target;
        if (value.length > '2') {
            return 0;
        }

        setTimeInputs({
            ...timeInputs,
            [name]: value,
        });
    };

    return (
        <div className="class-drawer-root">
            <div style={{ width: '100%' }}>
                <h2 className="drawer-title">과제 수정이 가능합니다 !</h2>
                <p className="drawer-subTitle">
                    수정된 정보는 <b style={{ fontWeight: '600' }}>이미 공유된 과제</b>에 반영되지 않습니다. <br /> 수정된 정보의 반영을
                    원하시는 경우, 다시 공유를 해주시길 바랍니다.
                </p>

                <div className="drawer-inputs">
                    <StyleInput className="input-name" placeholder={assignmentDummy[testNum]['title']}></StyleInput>
                    <StyleInput className="input-desc" placeholder={assignmentDummy[testNum]['desc']}></StyleInput>
                    <StyleInput className="input-age" placeholder={assignmentDummy[testNum]['age']}></StyleInput>
                    <div className="input-upload">
                        <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M38.7 12.08C37.34 5.18 31.28 0 24 0C18.22 0 13.2 3.28 10.7 8.08C4.68 8.72 0 13.82 0 20C0 26.62 5.38 32 12 32H38C43.52 32 48 27.52 48 22C48 16.72 43.9 12.44 38.7 12.08ZM28 18V26H20V18H14L24 8L34 18H28Z"
                                fill="#969393"
                            />
                        </svg>
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
                                onChange={onChange}
                                placeholder={String(mmm)}
                            />
                            <p>분</p>
                            <input
                                type="text"
                                name="ss"
                                value={ss}
                                readOnly={ss === '--' ? true : false}
                                onChange={onChange}
                                placeholder={String(sss)}
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
                <div className="drawer-button">수정하기</div>
            </div>
        </div>
    );
}

export default withRouter(ClassDrawerModify);
