import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import PopOverClipboard from '../essentials/PopOverClipboard';
/** https://github.com/jeanlescure/short-unique-id
 * Copyright (c) 2018-2020 Short Unique ID Contributors.
 * Licensed under the Apache License 2.0.
 */
import ShortUniqueId from 'short-unique-id';
import { withRouter } from 'react-router-dom';

const BtnAble = styled.button`
    pointer-events: ${(props) => (props.btnAbleState ? 'auto' : 'none')};
`;

function Profile({ history }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const textCopy = useRef();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailWith, setEmailWith] = useState('');
    const [academyName, setAcademyName] = useState('');
    const [academyCode, setAcademyCode] = useState('');
    const [imgSrc, setImgSrc] = useState(null);
    const [imgBlob, setImgBlob] = useState(null);
    const [btnAbleState, setBtnAbleState] = useState(false);
    const [clipboardState, setClipboardState] = useState(false);

    const handleSave = () => {
        const saveDB = (_imgsrc) => {
            // 1. db에 저장...
            Axios.put(
                `${apiUrl}/my-page/profile`,
                {
                    name: name,
                    image: _imgsrc ? _imgsrc : null,
                },
                { withCredentials: true },
            )
                .then((res) => {
                    //2. 세션 처리...
                    Axios.patch(
                        `${apiUrl}/auth`,
                        {
                            userName: name,
                            image: _imgsrc ? _imgsrc : null,
                        },
                        { withCredentials: true },
                    )
                        .then((res2) => {
                            // console.log('refresh token!');
                        })
                        .catch((err) => {
                            console.log('refresh error...');
                            console.error(err);
                        });
                    window.location.reload();
                    // history.replace();
                })
                .catch((err) => {
                    console.error(err);
                });
        };

        if (imgBlob) {
            const randomStr = new ShortUniqueId();
            const randomFileName = 'profile_' + randomStr.randomUUID(16);
            const profImageForm = new FormData();
            console.log(randomFileName, imgBlob, randomFileName);

            profImageForm.append(randomFileName, imgBlob, randomFileName);

            Axios.post(`${apiUrl}/files/profile-images`, profImageForm, { withCredentials: true })
                .then((res) => {
                    saveDB(apiUrl + '/files/' + res.data.file_name);
                })
                .catch((err) => {
                    alert('프로필 이미지를 저장하는 도중 오류가 발생했습니다.');
                    console.error(err);
                });
        } else {
            saveDB(imgSrc);
        }
    };
    const handleInput = (e) => {
        const { value } = e.target;
        setName(value);
        setBtnAbleState(true);
    };
    const handleChangeFile = (e) => {
        if (!e.target.files[0]) return;
        if (e.target.files[0].size > 3 * 1024 * 1024) {
            alert('이미지 최대 크기는 3MB입니다.');
            return;
        }

        setBtnAbleState(true);

        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        let maxW = 512;
        let maxH = 512;
        let img = new Image();
        img.onload = function () {
            let iw = img.width;
            let ih = img.height;
            let scale = Math.min(maxW / iw, maxH / ih);
            let iwScaled = iw * scale;
            let ihScaled = ih * scale;
            canvas.width = iwScaled;
            canvas.height = ihScaled;
            ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
            // console.log(canvas.toDataURL('image/jpeg'));
            canvas.toBlob((blob) => {
                setImgBlob(blob);
            });
        };
        img.src = URL.createObjectURL(e.target.files[0]);
        setImgSrc(img.src);
    };
    const handleDeleteImg = () => {
        setImgSrc(null);
        setBtnAbleState(true);
    };
    /**  복사하기 버튼 */
    const handleCopy = () => {
        if (clipboardState) return;

        textCopy.current.select();
        textCopy.current.setSelectionRange(0, 9999);

        document.execCommand('copy');

        setClipboardState(true);
        setTimeout(function () {
            setClipboardState(false);
        }, 3000);
    };

    useEffect(() => {
        if (sessions.userType) {
            Axios.get(`${apiUrl}/my-page/profile`, { withCredentials: true })
                .then((res) => {
                    const { email, auth_with } = res.data;

                    setEmail(email);
                    setEmailWith(auth_with);
                    setName(sessions.userName);
                    setAcademyName(sessions.academyName);
                    setAcademyCode(sessions.academyCode);
                    setImgSrc(sessions.image);
                })
                .catch((err) => {
                    console.error(err);
                });
        }

        return () => {};
    }, [sessions.academyName]);

    return (
        <>
            <PopOverClipboard state={clipboardState} />
            <div className="profile-root">
                <div className="mypage-title">프로필 설정</div>
                <section>
                    <div className="mypage-header">프로필 사진</div>
                    <div className="mypage-contents profile-image">
                        <canvas id="canvas" width="75" height="75"></canvas>

                        {imgSrc ? (
                            <img src={imgSrc} alt="my_profile.." />
                        ) : (
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16.9999 0.333984C7.79992 0.333984 0.333252 7.80065 0.333252 17.0007C0.333252 26.2007 7.79992 33.6673 16.9999 33.6673C26.1999 33.6673 33.6666 26.2007 33.6666 17.0007C33.6666 7.80065 26.1999 0.333984 16.9999 0.333984ZM16.9999 5.33398C19.7666 5.33398 21.9999 7.56732 21.9999 10.334C21.9999 13.1007 19.7666 15.334 16.9999 15.334C14.2333 15.334 11.9999 13.1007 11.9999 10.334C11.9999 7.56732 14.2333 5.33398 16.9999 5.33398ZM16.9999 29.0007C12.8333 29.0007 9.14992 26.8673 6.99992 23.634C7.04992 20.3173 13.6666 18.5007 16.9999 18.5007C20.3166 18.5007 26.9499 20.3173 26.9999 23.634C24.8499 26.8673 21.1666 29.0007 16.9999 29.0007Z"
                                    fill="#707070"
                                />
                            </svg>
                        )}

                        <div className="profile-image-right">
                            <div style={{ height: '47px', widht: '97px', display: 'flex' }}>
                                <input id="file-click" type="file" accept="image/gif,image/jpeg,image/png" onChange={handleChangeFile} />
                                <label htmlFor="file-click" className="btn-purple">
                                    사진 변경
                                </label>
                            </div>

                            <button className="btn-gray" onClick={handleDeleteImg}>
                                삭제하기
                            </button>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="mypage-header">이름 / 학원명</div>
                    <div className="mypage-contents white-box profile-info">
                        <div className="row">
                            <div className="row-title">이름</div>
                            <div className="row-desc">
                                <input placeholder={name} type="text" onChange={handleInput} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="row-title">이메일</div>
                            <div className="row-desc">
                                {email} <span>({emailWith})</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="row-title">학원명</div>
                            {/* {console.log('useState', academyName, 'session', sessions.academyName)} */}
                            <div className="row-desc">{academyName ? academyName : '클래스에 입장하시면, 자동으로 학원이 등록됩니다.'}</div>
                        </div>

                        {sessions.userType === 'teachers' ? (
                            <div className="row">
                                <div className="row-title">학원코드</div>
                                <div className="row-desc">
                                    <input readOnly type="text" className="code-input" defaultValue={academyCode} ref={textCopy} />
                                    <button className="btn-purple" onClick={handleCopy}>
                                        복사하기
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </section>
                <section>
                    <div className="mypage-footer">
                        <BtnAble btnAbleState={btnAbleState} className="btn-green" onClick={handleSave}>
                            저장하기
                        </BtnAble>
                    </div>
                </section>
            </div>
        </>
    );
}

export default withRouter(Profile);
