/* eslint-disable react-hooks/exhaustive-deps */
import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiUrl } from '../../configs/configs';
import { Helmet } from 'react-helmet';
import { useBeforeunload } from 'react-beforeunload';
import styled from 'styled-components';
import io from 'socket.io-client';
import { Grid } from '@material-ui/core';

let lectureWindowCloseDetector = null;
let sAuthId = null;

const ListHeader = styled.header`
    border-bottom: 1px solid #c4c4c4;
    padding: 16px;
    margin: 8px 16px 0 16px;

    & h4 {
        font-weight: 500;
    }
`;

const StatusCardListContainer = styled.div`
    height: calc(100vh - 56px - 40px);
    padding: 16px;
`;

const StatusCardView = styled.div`
    box-sizing: border-box;
    padding: 1rem;
    width: 100%;
    min-height: 60px;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    position: relative;

    &.b-1 {
        background-color: #ffaa003a;
    }

    &.b-2 {
        background-color: #ff3c3c3d;
    }

    & div.left {
        align-items: center;
        display: flex;
        font-weight: 400;
        width: 55%;
        margin-left: 0.25rem;
    }

    & div.right {
        align-items: center;
        border-left: 1px solid #c4c4c4;
        display: flex;
        font-weight: 500;
        width: 45%;
        text-align: center;

        & span {
            width: 100%;

            &.c--1 {
                color: rgba(0, 0, 0, 0.26);
            }

            &.c-0 {
                color: #00bb35;
            }

            &.c-1 {
                color: #ffaa00;
            }

            &.c-2 {
                color: #ff3c3c;
            }
        }
    }
`;

function StatusCard({ stdName, statusCode }) {
    function renderStatusText(code) {
        switch (code) {
            case -1:
                return <span className="c--1">미접속</span>;
            case 0:
                return <span className="c-0">참여 중</span>;
            case 1:
                return <span className="c-1">주의 요함</span>;
            case 2:
                return <span className="c-2">시선 이탈</span>;
            default:
                return <></>;
        }
    }
    return (
        <StatusCardView className={'b-' + statusCode}>
            <div className="left">{stdName}</div>
            <div className="right">{renderStatusText(statusCode)}</div>
        </StatusCardView>
    );
}

function VideoLectureEyetrackDetectionList({ match, history }) {
    const sessions = useSelector((state) => state.RdxSessions);
    sAuthId = sessions.authId;
    // const serverdate = useSelector((state) => state.RdxServerDate).datetime;
    const classNum = match.params.classnum;
    const urlSearchParams = new URLSearchParams(history.location.search);
    const roomId = urlSearchParams.get('roomId');
    const groupId = `${roomId}&${classNum}`;
    const socket = useRef();
    const [enableBeforeUnload, setEnableBeforeUnload] = useState(true);
    const [stdList, setStdList] = useState([]);

    useEffect(() => {
        if (!sessions || !sessions.authId) return;
        // 학생 목록 가져오기
        Axios.get(`${apiUrl}/students-in-class/${classNum}`, { withCredentials: true })
            .then((res) => {
                // console.log(res.data.map((d) => ({ stdId: d.student_id, stdName: d.name, statusCode: -1 })));
                setStdList(res.data.map((d, i) => ({ stdId: d.student_id, stdName: d.name, statusCode: -1 })));
            })
            .catch((err) => {
                console.error(err);
            });

        // otp 생성
        Axios.post(
            `${apiUrl}/meeting-room/otp`,
            {
                roomId: roomId,
                username: sessions.userName,
                roleId: sessions.userType === 'students' ? 'participant' : 'emcee',
                ignorePasswd: true,
                apiUserId: sessions.authId,
            },
            { withCredentials: true },
        )
            .then((res) => {
                let screenWidth = window.screen.availWidth;
                let screenHeight = window.screen.availHeight;
                const otpCode = res.data.data.roomUserOtp.otp;
                console.log(otpCode);
                window.vidLectureOpener = window.open(
                    `https://biz.gooroomee.com/room/otp/${otpCode}`,
                    'Gooroomee Biz',
                    `width=${screenWidth - 300}, height=${screenHeight}, toolbar=no, scrollbars=no, resizable=no, status=no`,
                    true,
                );
            })
            .catch((err) => {
                console.error(err);
                alert('화상 강의에 입장하지 못했습니다.\n증상이 지속될 경우 고객센터로 문의 바랍니다.');
            });

        if (!lectureWindowCloseDetector) {
            lectureWindowCloseDetector = setInterval(() => {
                if (window.vidLectureOpener && window.vidLectureOpener.closed) {
                    setEnableBeforeUnload(() => false);
                    socket.current.emit('leave', {
                        groupId: groupId,
                        data: {
                            authId: sAuthId,
                        },
                    });
                    window.close();
                    return;
                }
            }, 1000);
        }
    }, [sessions.authId]);

    useEffect(() => {
        if (!window.opener) {
            alert('잘못된 접근입니다!');
            document.body.innerHTML = '';
            socket.current.emit('leave', {
                groupId: groupId,
                data: {
                    authId: sAuthId,
                },
            });
            window.close();
            return;
        }
        socket.current = io.connect(`${apiUrl}/vid_lecture`);
        socket.current.on('connected', (id) => {
            socket.current.emit('join', {
                groupId: groupId,
                data: {
                    authId: sAuthId,
                },
            });
        });
        socket.current.on('joined', (msg) => {
            console.log('joined >> ', msg);
            setStdList((stdList) =>
                stdList.map((d, i) => {
                    if (d.stdId === msg.authId) {
                        return { ...d, statusCode: 0 };
                    } else {
                        return d;
                    }
                }),
            );
        });
        socket.current.on('eyetrackFeedback', (msg) => {
            // this is a core event!
            console.log('Eyetrack Feedback >> ', msg);
            setStdList((stdList) =>
                stdList.map((d, i) => {
                    if (d.stdId === msg.authId) {
                        switch (msg.code) {
                            case 'caution-of-range':
                                return { ...d, statusCode: 1 };
                            case 'out-of-range':
                                return { ...d, statusCode: 2 };
                            default:
                                return { ...d, statusCode: 0 };
                        }
                    } else {
                        return d;
                    }
                }),
            );
        });
        socket.current.on('leaved', (msg) => {
            console.log('leaved >> ', msg);
            setStdList((stdList) =>
                stdList.map((d, i) => {
                    if (d.stdId === msg.authId) {
                        return { ...d, statusCode: -1 };
                    } else {
                        return d;
                    }
                }),
            );
        });
        window.socket = socket.current;

        return () => {
            socket.current.emit('leave', {
                groupId: groupId,
                data: {
                    authId: sAuthId,
                },
            });
        };
    }, []);

    useBeforeunload((e) => (enableBeforeUnload ? e.preventDefault() : null));

    return (
        <>
            <Helmet>
                <style type="text/css">{`
                    html > body {
                        height: initial;
                    }
                    @media (max-width: 662px) {
                        body > #root > .mobile-body-root {
                            display: none!important;
                        }

                        body > #root > main {
                            display: initial;
                        }
                    }
                `}</style>
            </Helmet>
            <ListHeader className="header">
                <h4>시선흐름 집중도 확인</h4>
            </ListHeader>
            <StatusCardListContainer>
                <Grid container spacing={1}>
                    {stdList.map((d, i) => (
                        <Grid key={d.stdId} item xs={12} sm={6}>
                            <StatusCard stdName={d.stdName} statusCode={d.statusCode} />
                        </Grid>
                    ))}
                </Grid>
            </StatusCardListContainer>
        </>
    );
}

export default React.memo(VideoLectureEyetrackDetectionList);
