import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StyleDiv = styled.div`
    position: fixed;
    z-index: 1300;

    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 24px;

    width: 100%;
    height: 50px;
    background-color: #2fe8b1;

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

const switchAlertText = (pathname, restricted) => {
    // const {
    //     analysisPattern,
    //     analysisTime,
    //     analysisType,
    //     classCreation,
    //     classReport,
    //     editorCreation,
    //     eyetrack,
    //     fileCreation,
    //     studentInvited,
    //     studentReport,
    //     teacherInvited,
    //     timeLimit,
    //     videoLecture,
    // } = restricted;

    const fileCreation = true;
    const eyetrack = false;

    switch (pathname) {
        case '/':
            if (fileCreation && !eyetrack)
                return <div className="text">'파일 업로드를 통한 과제 생성'과 '시선흐름 과제 게시' 기능이 제한되었습니다.</div>;
            else if (!fileCreation && eyetrack)
                return <div className="text">'파일 업로드를 통한 과제 생성'과 '시선흐름 과제 게시' 기능이 제한되었습니다.</div>;
            else return <div className="text">'파일 업로드를 통한 과제 생성'과 '시선흐름 과제 게시' 기능이 제한되었습니다.</div>;

        case '/main-draft':
            return <div className="text">'파일 업로드를 통한 과제 생성'과 '시선흐름 과제 게시' 기능이 제한되었습니다.</div>;
        default:
            break;
    }
};

function AlertSubscribe({ history }) {
    const { pathname } = history.location;

    const [renderState, setRenderState] = useState(false);
    const [text, setText] = useState('');

    const { userType } = useSelector((state) => state.RdxSessions);
    const restricted = useSelector((state) => state.planInfo.restricted);
    const {
        analysisPattern,
        analysisTime,
        analysisType,
        classCreation,
        classReport,
        editorCreation,
        eyetrack,
        fileCreation,
        studentInvited,
        studentReport,
        teacherInvited,
        timeLimit,
        videoLecture,
    } = restricted;

    const handleAlert = () => {};

    useEffect(() => {
        console.log(pathname, fileCreation, eyetrack);
        switch (pathname) {
            case '/':
                if (teacherInvited) {
                    setRenderState(true);
                    setText('선생님 초대');
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
                }
                break;

            default:
                break;
        }
    }, [pathname, restricted]);

    if (!renderState || userType === 'students') return null;
    return (
        <StyleDiv>
            <div></div>
            <div className="middle">
                <div className="text">{text} 기능이 제한되었습니다.</div>
                <button>
                    구독 설정
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

export default withRouter(AlertSubscribe);
