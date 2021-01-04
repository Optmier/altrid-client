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

const dummy = [
    { stdName: '최세인', statusCode: -1 },
    { stdName: '홍길동', statusCode: 0 },
    { stdName: '이몽룡', statusCode: 1 },
    { stdName: '이순신', statusCode: 2 },
];

const StatusCardListContainer = styled.div``;

function StatusCard({ stdName, statusCode }) {
    return <div>상태 카드</div>;
}

function VideoLectureEyetrackDetectionList({ match, history }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const serverdate = useSelector((state) => state.RdxServerDate).datetime;
    const classNum = match.params.classnum;
    const urlSearchParams = new URLSearchParams(history.location.search);
    const roomId = urlSearchParams.get('roomId');
    const groupId = `${roomId}&${classNum}`;
    const socket = useRef();
    const [enableBeforeUnload, setEnableBeforeUnload] = useState(true);

    console.log(roomId, classNum);

    useEffect(() => {
        if (!sessions || !sessions.authId) return;
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
                    `width=${screenWidth - 360}, height=${screenHeight}, toolbar=no, scrollbars=no, resizable=no, status=no`,
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
                    window.close();
                    return;
                }
            }, 1000);
        }
    }, [sessions.authId]);

    useEffect(() => {
        socket.current = io.connect(`${apiUrl}/vid_lecture`);
        socket.current.on('connected', (id) => {
            socket.current.emit('join', groupId);
        });
        socket.current.on('joined', (msg) => {
            console.log(msg);
        });
        socket.current.on('eyetrackFeedback', (msg) => {
            // this is a core event!
            console.log('Eyetrack Feedback >> ' + msg);
        });

        return () => {
            socket.current.emit('leave', groupId);
        };
    }, []);

    useBeforeunload((e) => (enableBeforeUnload ? e.preventDefault() : null));

    return (
        <>
            <Helmet>
                <style type="text/css">{`
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
            <header className="header">여기에 목록이 표시됩니다.</header>
            <StatusCardListContainer>
                <Grid container spacing={3}>
                    {dummy.map((d, i) => (
                        <Grid item xs={12} sm={6}>
                            <StatusCard stdName={d.stdName} statusCode={d.statusCode} />
                        </Grid>
                    ))}
                </Grid>
            </StatusCardListContainer>
        </>
    );
}

export default React.memo(VideoLectureEyetrackDetectionList);
