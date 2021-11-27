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
import HeaderBar from '../essentials/HeaderBar';
import icon from '../../images/Profile_icon.png';
import Footer from '../essentials/Footer';

const BtnAble = styled.button`
    pointer-events: ${(props) => (props.btnAbleState ? 'auto' : 'none')};
`;

const Profile_Header = styled.div`
    margin: 0 auto;
    max-width: 1216px;
    & .profile-header {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
        max-height: 260px;
        & .test {
            width: 20%;
        }
        @media (min-width: 0px) and (max-width: 480px) {
            display: block;
            padding: 0 16px;
            text-align: left;
            height: 100px;

            /* & .name {
                text-align: left;
            } */
        }
        & .icon {
            & img {
                max-width: 322px;
                max-height: 227px;
                @media (min-width: 0px) and (max-width: 480px) {
                    display: none;
                }
            }
        }
    }
`;
const Profile_Main = styled.div`
    padding: 0 16px;
    margin: 0 auto;
    max-width: 592px;
    margin-top: 0px;
    margin-bottom: 70px;
    & canvas {
        display: none;
    }

    & input {
        background: #f6f8f9;
        width: 80%;
        border-radius: 16px;
        font-size: 18px;
        padding-left: 16px;
    }
    & .Profile-option {
        @media (min-width: 0px) and (max-width: 480px) {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        & img {
            border-radius: 50%;
        }
        margin-top: 32px;
        display: flex;
        align-items: center;
        margin-bottom: 40px;

        & .button {
            display: flex;
            align-items: center;
            margin-left: 32px;
            @media (min-width: 0px) and (max-width: 480px) {
                margin-top: 10px;
                margin-left: 0px;
            }
            & .input-upload {
                margin-right: 8px;
            }

            & .upload {
                color: #6c46a1;
                border: 1.5px solid #6c46a1;
                box-sizing: border-box;
                border-radius: 104px;
                max-width: 110px;
                height: 28px;
                padding: 3px 12px;
                background: #ffffff;
            }
            & .image-delete {
                background: #ffefed;
                border-radius: 104px;
                box-sizing: border-box;
                color: #ab1300;
                max-width: 110px;
                height: 28px;
                & svg {
                    margin-right: 9px;
                }
            }
        }
    }
    & .profile-inputs {
        & .input-box {
            width: 100%;
            margin-bottom: 8px;
            height: 64px;
            background: #f6f8f9;
            border-radius: 16px;
            & p {
                color: #77818b;
                padding: 0 16px;
                padding-top: 12px;
                padding-bottom: 2px;
                font-size: 12px;
            }
        }
        margin-top: 16px;
    }
    & .save-button {
        margin-bottom: 92px;
        margin-top: 32px;
        display: flex;
        justify-content: space-between;
        & .delete {
            color: #ab1300;
            background: #ffefed;
            max-width: 90px;
            height: 28px;
            border-radius: 104px;
            padding: 3px 12px;
        }
        & .save {
            color: #ffffff;
            background: #3b1689;
            border-radius: 104px;
            max-width: 81px;
            height: 46px;
            padding: 12px 24px;
        }
    }
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
            // console.log(randomFileName, imgBlob, randomFileName);

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
    }, [sessions]);

    const handleDelete = () => {
        const confirm = window.confirm('정말 계정을 삭제하시겠습니까?\n삭제된 계정의 데이터는 복구되지 않습니다.');
        if (!confirm) return;
        Axios.delete(`${apiUrl}/my-page/profile`, { withCredentials: true })
            .then((res) => {
                alert('회원 탈퇴가 완료되었습니다.');
                window.logout();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            <HeaderBar />
            <Profile_Header>
                <div className="profile-header">
                    <div className="test">{/* <h3>sd</h2> */}</div>
                    <div className="name">
                        <h1>프로필 설정</h1>
                    </div>
                    <div className="icon">
                        <img src={icon} alt="pofile_icon" />
                    </div>
                </div>
            </Profile_Header>
            <Profile_Main>
                <h2>프로필 사진</h2>
                <div className="Profile-option">
                    <canvas id="canvas" width="75px" height="75px"></canvas>
                    <div className="profile-image">
                        {imgSrc ? (
                            <img width="96px" height="96px" src={imgSrc} alt="my_profile.." />
                        ) : (
                            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="48" cy="48" r="48" fill="#F4F1FA" />
                            </svg>
                        )}
                    </div>
                    <div className="button">
                        <div className="input-upload">
                            <input
                                style={{ display: 'none' }}
                                className="upload"
                                id="file-click"
                                type="file"
                                accept="image/gif,image/jpeg,image/png"
                                onChange={handleChangeFile}
                            />
                            <label htmlFor="file-click" className="upload">
                                사진 변경
                            </label>
                        </div>
                        <div className="change-image">
                            <button onClick={handleDeleteImg} className="image-delete">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7.5 1H10V2H9V9.5C9 9.63261 8.94732 9.75979 8.85355 9.85355C8.75979 9.94732 8.63261 10 8.5 10H1.5C1.36739 10 1.24021 9.94732 1.14645 9.85355C1.05268 9.75979 1 9.63261 1 9.5V2H0V1H2.5V0H7.5V1ZM3.5 3.5V7.5H4.5V3.5H3.5ZM5.5 3.5V7.5H6.5V3.5H5.5Z"
                                        fill="#AB1300"
                                    />
                                </svg>
                                선택 삭제
                            </button>
                        </div>
                    </div>
                </div>
                <h2 style={{ marginBottom: '16px' }}>프로필 정보</h2>
                <duv className="profile-inputs">
                    <div className="input-box">
                        <p>이름</p>
                        <input value={name} type="text" onChange={handleInput} />
                    </div>

                    <div className="input-box">
                        <p>이메일</p>
                        <input type="text" value={emailWith} />
                    </div>
                    <div className="input-box">
                        <p>학원명</p>
                        <input type="text" value={academyName} />
                    </div>
                    <div className="input-box">
                        <p>학원코드</p>
                        <input type="text" value={academyCode} />
                    </div>
                </duv>
                <div className="save-button">
                    <button onClick={handleDelete} className="delete">
                        회원탈퇴
                    </button>
                    <button onClick={handleSave} className="save">
                        저장
                    </button>
                </div>
            </Profile_Main>
            <Footer />
        </>
    );
}

export default withRouter(Profile);
