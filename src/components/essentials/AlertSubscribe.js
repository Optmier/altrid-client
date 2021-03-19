import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as $ from 'jquery';

const StyleDiv = styled.div`
    position: fixed;
    top: 0;
    z-index: 1300;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 24px;

    width: 100%;
    height: 55px;
    background-color: #2fe8b1;

    & svg {
        cursor: pointer;
    }
    & .middle {
        display: flex;
        align-items: center;
        justify-content: center;
        & .text {
            font-size: 1rem;
            font-weight: 500;
            color: white;
        }
        & button {
            margin-left: 1rem;
            border-radius: 11px;
            background-color: #28bf92;
            padding: 0.3rem 0.5rem;
            font-size: 0.95rem;
            font-weight: 500;
            color: white;
            & > svg {
                margin-left: 8px;
            }
        }
    }
    & .text {
        font-size: 1rem;
        font-weight: 500;
        color: white;
    }
    & button {
        cursor: pointer;
        margin-left: 1rem;
        border-radius: 11px;
        background-color: #28bf92;
        padding: 0.3rem 0.5rem;
        font-size: 0.95rem;
        font-weight: 500;
        color: white;
        & > svg {
            margin-left: 8px;
        }
    }
`;

function AlertSubscribe({ history }) {
    const { pathname } = history.location;

    const [renderState, setRenderState] = useState(false);
    const [text, setText] = useState('');

    const { userType } = useSelector((state) => state.RdxSessions);
    const restricted = useSelector((state) => state.planInfo.restricted);
    const { analysisPattern, eyetrack, fileCreation, studentInvited, teacherInvited, videoLecture } = restricted;

    const handleAlert = () => {
        $('#main').css({ paddingTop: '0px' });
        $('#subpage-top-nav').css({ marginTop: '0px' });
        $('#alert-subscribe').css({ top: '-55px' });
    };

    useEffect(() => {
        let name = pathname;
        if (name.includes('details')) {
            name = '/details';
        } else if (name.includes('vid-lecture')) {
            name = '/vid-lecture';
        }

        switch (name) {
            case '/':
                if (teacherInvited) {
                    setRenderState(true);
                    setText('선생님 초대');
                } else {
                    setRenderState(false);
                }
                break;
            case '/main-draft':
                if (fileCreation === true && eyetrack === false) {
                    setRenderState(true);
                    setText(`'파일 업로드를 통한 과제 생성'`);
                } else if (fileCreation === false && eyetrack === true) {
                    setRenderState(true);
                    setText(`'시선흐름 과제 게시'`);
                } else if (fileCreation === true && eyetrack === true) {
                    setRenderState(true);
                    setText(`'파일 업로드를 통한 과제 생성' 기능과 '시선흐름 과제 게시'`);
                } else {
                    setRenderState(false);
                }
                break;
            case '/details':
                if (analysisPattern) {
                    setRenderState(true);
                    setText(`'문제 풀이 패턴 분석'`);
                } else {
                    setRenderState(false);
                }
                break;
            case '/vid-lecture':
                if (videoLecture) {
                    setRenderState(true);
                    setText(`'화상 강의 기능'`);
                } else {
                    setRenderState(false);
                }
                break;
            default:
                setRenderState(false);
                break;
        }
    }, [pathname, restricted]);

    if (!renderState || userType === 'students') {
        $('#main').css({ paddingTop: '0px' });
        $('#subpage-top-nav').css({ marginTop: '0px' });

        return null;
    } else {
        $('#main').css({ paddingTop: '55px' });
        $('#subpage-top-nav').css({ marginTop: '55px' });

        return (
            <StyleDiv id="alert-subscribe">
                <div></div>
                <div className="middle">
                    <div className="text">{text} 기능이 제한되었습니다.</div>
                    <button onClick={() => history.replace('/mypage/manage-plan/now-plan')}>
                        플랜 정보
                        <svg width="19" height="7" viewBox="0 0 19 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1H16L11.2743 6" stroke="white" strokeWidth="2" />
                        </svg>
                    </button>
                </div>
                <svg onClick={handleAlert} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                        fill="white"
                    />
                </svg>
            </StyleDiv>
        );
    }
}

export default withRouter(AlertSubscribe);
