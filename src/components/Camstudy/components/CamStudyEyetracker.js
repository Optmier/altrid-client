/* eslint-disable react-hooks/exhaustive-deps */
import Axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { useSelector } from 'react-redux';
import { apiUrl } from '../../../configs/configs';
import io from 'socket.io-client';
import EyetrackerCore from '../../essentials/EyetrackerCore';

let eyetrackModerator = null;
let eyetrackDetectedTime = 0;
let eyetrackDetectChanged = true;
let sAuthId = null;

function CamStudyEyetracker({ history, match }) {
    const sessions = useSelector((state) => state.RdxSessions);
    sAuthId = sessions.authId;
    // const serverdate = useSelector((state) => state.RdxServerDate).datetime;
    const optimerModule = useSelector((state) => state.RdxOpTimerHelper.optimer);
    const classNum = match.params.classnum;
    const urlSearchParams = new URLSearchParams(history.location.search);
    const roomId = urlSearchParams.get('roomId');
    const groupId = `${roomId}&${classNum}`;
    const socket = useRef();
    const detectionTimeLimit = 3000;
    window.camStudyEyetrackCablib = false;

    const onAfterCalib = () => {
        console.log('calibration completed!');
        window.camStudyEyetrackCablib = true;
        // otp 생성
        Axios.post(
            `${apiUrl}/cam-study/otp`,
            {
                roomId: roomId,
                username: sessions.userName,
                roleId: 'participant',
                ignorePasswd: false,
                apiUserId: sessions.authId,
            },
            { withCredentials: true },
        )
            .then((res) => {
                const otpCode = res.data.data.roomUserOtp.otp;
                console.log(otpCode);
                socket.current.emit('join', {
                    groupId: groupId,
                    data: {
                        authId: sAuthId,
                    },
                });
                window.camStudyOpener = window.open(
                    `https://biz.gooroomee.com/room/otp/${otpCode}`,
                    'Gooroomee Biz',
                    `toolbar=no, scrollbars=no, resizable=no, status=no`,
                    true,
                );
                console.log(optimerModule);
                if (!optimerModule || !optimerModule.classNum) return;
                if (!optimerModule.isStarted) {
                    console.warn('옵타이머를 시작합니다.');
                    optimerModule.start();
                }
            })
            .catch((err) => {
                console.error(err);
                alert('캠 스터디에 입장하지 못했습니다.\n증상이 지속될 경우 고객센터로 문의 바랍니다.');
            });
    };

    const onUpdate = (data, elapsedTime, precisionTime) => {
        if (!window.camStudyEyetrackCablib) return;
        if (window.camStudyOpener && window.camStudyOpener.closed) {
            socket.current.emit('leave', {
                groupId: groupId,
                data: {
                    authId: sAuthId,
                },
            });
            window.close();
            return;
        }
        if (!eyetrackModerator) {
            eyetrackModerator = setInterval(() => {
                /////////////////////////////////////////////////
                if (!data) {
                    if (precisionTime - eyetrackDetectedTime > detectionTimeLimit && !eyetrackDetectChanged) {
                        console.log('out of range!!');
                        optimerModule.pause();
                        socket.current.emit('detectEyetrack', {
                            groupId: groupId,
                            data: { authId: sAuthId, code: 'out-of-range' },
                        });
                        eyetrackDetectChanged = true;
                    }
                } else {
                    if (eyetrackDetectChanged) {
                        console.log('face detected!');
                        optimerModule.resume();
                        socket.current.emit('detectEyetrack', { groupId: groupId, data: { authId: sAuthId } });
                        eyetrackDetectChanged = false;
                    }
                    eyetrackDetectedTime = precisionTime;
                }
                /////////////////////////////////////////////////
                clearInterval(eyetrackModerator);
                eyetrackModerator = null;
            }, 500);
        }
        // if (!data) {
        //     console.log('false!!!');
        //     // if (precisionTime - eyetrackDetectedTime) socket.current.emit('detectEyetrack', 'out of range!');
        //     setEyetrackDetectedTime((eyetrackDetectedTime) => {
        //         console.log(eyetrackDetectedTime);
        //         return eyetrackDetectedTime;
        //     });
        // } else {
        //     console.log('true!!');
        //     // setEyetrackDetectedTime(precisionTime);
        // }
    };

    useEffect(() => {
        if (classNum === null || classNum === undefined || !sessions.authId || !optimerModule) return;
        if (optimerModule.classNum === parseInt(classNum)) return;
        optimerModule.updateClassNumber(parseInt(classNum));
    }, [classNum, sessions, optimerModule]);

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
        socket.current = io.connect(`${apiUrl}/cam_study`);
        socket.current.on('connected', (id) => {});
        socket.current.on('joined', (msg) => {
            console.log('joined >> ', msg);
        });
        // socket.current.on('eyetrackFeedback', (msg) => {
        //     console.log('Eyetrack Feedback >> ', msg);
        // });
        return () => {
            socket.current.emit('leave', {
                groupId: groupId,
                data: {
                    authId: sAuthId,
                },
            });
        };
    }, []);

    useBeforeunload((e) => {
        optimerModule.stopAndSave();
        socket.current.emit('leave', {
            groupId: groupId,
            data: {
                authId: sAuthId,
            },
        });
        return null;
    });

    return (
        <>
            <EyetrackerCore onAfterCalib={onAfterCalib} onUpdate={onUpdate} relative={false} />이 창을 캠 스터디가 진행 되는 동안 절대로
            닫지 마시오!
        </>
    );
}

CamStudyEyetracker.defaultProps = {};

export default CamStudyEyetracker;
