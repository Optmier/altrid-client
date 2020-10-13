import React, { useState, useRef } from 'react';
import '../../styles/class_drawer.scss';
import ToggleSwitch from './ToggleSwitch';

function ClassDrawer() {
    const [timeInputs, setTimeInputs] = useState({
        hh: '',
        mm: '',
    });

    const [toggleState, setToggleState] = useState({
        eyetrack: true,
        timeAttack: true,
    });

    const handleChange = (event) => {
        setToggleState({ ...toggleState, [event.target.name]: event.target.checked });

        if (!event.target.checked) {
            setTimeInputs({
                hh: '--',
                mm: '--',
            });
        } else {
            setTimeInputs({
                hh: '',
                mm: '',
            });
        }
    };

    const { hh, mm } = timeInputs;

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
                <h2 className="drawer-title">과제를 생성해보세요 :)</h2>
                <p className="drawer-subTitle">과제의 기본적인 정보를 입력해주세요.</p>

                <div className="drawer-inputs">
                    <input className="input-name" placeholder="과제 이름"></input>
                    <input className="input-desc" placeholder="과제 한 줄 설명"></input>
                    <input className="input-age" placeholder="학습자 나이"></input>
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
                        <ToggleSwitch name={'eyetrack'} toggle={toggleState['eyetrack']} handleChange={handleChange} type={'drawer'} />
                    </span>
                    <span>
                        <p>제한시간 설정</p>

                        <div className="time-inputs">
                            <input
                                type="number"
                                name="hh"
                                value={hh}
                                readOnly={hh === '--' ? true : false}
                                onChange={onChange}
                                placeholder="00"
                            />{' '}
                            :{' '}
                            <input
                                type="number"
                                name="mm"
                                value={mm}
                                readOnly={mm === '--' ? true : false}
                                onChange={onChange}
                                placeholder="00"
                            />
                        </div>

                        <ToggleSwitch name={'timeAttack'} toggle={toggleState['timeAttack']} handleChange={handleChange} type={'drawer'} />
                    </span>
                </div>
            </div>

            <div className="drawer-footer">
                <div className="drawer-button">생성하기</div>
                <div className="drawer-button">생성 및 공유하기</div>
            </div>
        </div>
    );
}

export default ClassDrawer;
