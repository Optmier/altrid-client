import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import LogoWhite from '../images/logos/nav_logo_white.png';
import Footer from '../components/essentials/Footer';
import LoginButtons from '../components/Login/LoginButtons';
import '../styles/logins.scss';
import { apiUrl } from '../configs/configs';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';
import * as $ from 'jquery';
import { $_loginDefault, $_loginStudent, $_loginTeacher } from '../configs/front_urls';
import Radio from '@material-ui/core/Radio';
import styled from 'styled-components';
import isMobile from '../controllers/isMobile';

const WhiteRadio = withStyles({
    root: {
        color: 'white',
        '&$checked': {
            color: 'white',
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const RequestButton = styled.button`
    background-color: ${(props) => (props.disable ? (props.usertype === 'students' ? '#43138B' : '#13E2A1') : '#707070')};
    pointer-events: ${(props) => (props.disable ? 'auto' : 'none')};
    box-shadow: 0px 3px 6px #00000029;
    color: white;
    font-family: inherit;
    width: 126px;
    height: 45px;
    border-radius: 11px;
`;

function Login({ history }) {
    const [usertype, setUsertype] = useState('students');
    const [profileData, setProfileData] = useState({
        email: '',
        authId: '',
        image: '',
        authWith: '',
    });
    const [loginStep, setLoginStep] = useState(0);
    const [inputState, setInputState] = useState({
        real_name: '',
        academy_code: '',
        teacher_selected: [],
    });
    const [inputError, setInputError] = useState({
        real_name: false,
        academy_code: false,
    });
    const [academyInfo, setAcademyInfo] = useState({
        is_exists: false,
        name: '',
        address: '',
        teachers: [],
    });
    const [requestButtonEnable, setRequestButtonEnable] = useState(true);

    const loginMethod = (email, authId) => {
        Axios.post(
            apiUrl + '/auth/' + usertype,
            {
                email: email || '',
                authId: authId || '',
            },
            { withCredentials: true },
        )
            .then(() => {
                history.replace(window.lastUrl);
            })
            .catch((err) => {
                console.error(err);
                switch (err.response.data.code) {
                    case 'not-in-database':
                        alert('회원 정보가 없습니다.\n등록을 해주세요.');
                        break;
                    case 'not-approved':
                        alert(`승인이 필요한 계정입니다.\n${usertype === 'students' ? '선생님의' : '관리자의'} 승인을 기다려주세요!`);
                        break;
                    default:
                        break;
                }
            });
    };

    const issueTempToken = (email, authId) => {
        Axios.post(`${apiUrl}/auth/temp`, { email: email, authId: authId }, { withCredentials: true })
            .then((res) => {
                // console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const onSuccessGoogleAuth = ({ profileObj }) => {
        setProfileData({
            ...profileData,
            email: profileObj.email,
            authId: profileObj.googleId,
            authWith: 'google',
            image: profileObj.imageUrl,
        });
        Axios.get(`${apiUrl}/${usertype}/exists/${profileObj.googleId}`, { withCredentials: true })
            .then((res) => {
                const isExists = res.data;
                // 존재하면 로그인
                if (isExists) {
                    loginMethod(profileObj.email, profileObj.googleId);
                }
                // 아니면 등록하기
                else {
                    if (usertype === 'students')
                        // 민감한 정보 접근을 위한 임시토큰 발급
                        issueTempToken(profileObj.email, profileObj.googleId);
                    setLoginStep(1);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const onFailedGoogleAuth = (err) => {
        console.error(err);
        alert('로그인에 실패했습니다. 에러코드 :: ' + err);
    };

    const onSuccessKakaoAuth = ({ profile }) => {
        // console.log(profile.kakao_account.email || profile.id);
        // console.log(profile);
        setProfileData({
            ...profileData,
            email: profile.kakao_account.email,
            authId: profile.id,
            authWith: 'kakao',
            image: profile.properties.profile_image,
        });
        Axios.get(`${apiUrl}/${usertype}/exists/${profile.id}`, { withCredentials: true })
            .then((res) => {
                const isExists = res.data;
                // console.log(res);
                // 존재하면 로그인
                if (isExists) {
                    loginMethod(profile.kakao_account.email, profile.id + '');
                }
                // 아니면 등록하기
                else {
                    if (usertype === 'students')
                        // 민감한 정보 접근을 위한 임시토큰 발급
                        issueTempToken(profile.kakao_account.email, profile.id + '');
                    setLoginStep(1);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const onFailedKakaoAuth = (err) => {
        console.error(err);
        alert('로그인에 실패했습니다. 에러코드 :: ' + err);
    };

    const handleChangeUsertype = (e) => {
        if (e.target.value === 'teachers') {
            history.replace($_loginTeacher);
        } else {
            history.replace($_loginStudent);
        }
    };

    const handleInputChange = (e) => {
        setInputState({
            ...inputState,
            [e.target.name]: e.target.value,
        });
        if ($(e.target).hasClass('error')) {
            if (e.target.value.trim()) $(e.target).removeClass('error');
        }
    };

    const handleTeachersListChange = (e, value) => {
        setInputState({
            ...inputState,
            teacher_selected: value,
        });
    };

    const handleRequestButtonClick = () => {
        setInputError({
            real_name: !inputState['real_name'].trim(),
            academy_code: !inputState['academy_code'].trim(),
        });

        // 이메일
        const email = profileData.email;
        // 성함
        const name = inputState.real_name;
        // 인증 아이디(이메일 대체용)
        const authId = profileData.authId;
        // 구글 또는 카카오
        const authWith = profileData.authWith;
        // 학원 코드
        const academyCode = inputState.academy_code;
        //프로필 이미지
        const image = profileData.image;
        // 전화번호
        const phone = '';
        // 승인 여부( 선생님, 학생 모두 즉시 승인)
        const approved = 1;
        // 현재 등록하는 대상이 학생인 경우 선생님 선택 목록 구성
        const teachers = inputState.teacher_selected.map((data) => [data.auth_id, authId, academyCode]);

        if (usertype === 'students') {
            Axios.post(
                `${apiUrl}/students`,
                {
                    email: email || '',
                    name: name || '',
                    authId: authId,
                    authWith: authWith,
                    academyCode: '',
                    approved: approved,
                    image: image,
                },
                { withCredentials: true },
            )
                .then((res1) => {
                    // console.log(res1);
                    // if (teachers.length > 0)
                    //     Axios.post(`${apiUrl}/students-in-teacher/first`, { teachers: teachers }, { withCredentials: true })
                    //         .then((res2) => {
                    //             alert('계정 등록이 완료 되었습니다.\n선생님이 클래스를 생성 할때까지 기다려 주세요 :)');
                    //             loginMethod(email, authId);
                    //         })
                    //         .catch((err) => {
                    //             console.error(err);
                    //         });
                    // else {
                    //     alert('계정 등록이 완료 되었습니다.\n선생님이 클래스를 생성 할때까지 기다려 주세요 :)');
                    //     loginMethod(email, authId);
                    // }
                    alert('계정 등록이 완료 되었습니다 :)');
                    loginMethod(email, authId);
                })
                .catch((err) => {
                    console.error(err);
                });
        } else if (usertype === 'teachers') {
            Axios.post(
                `${apiUrl}/teachers`,
                {
                    email: email || '',
                    name: name || '',
                    authId: authId,
                    authWith: authWith,
                    academyCode: academyCode,
                    approved: approved,
                    image: image,
                },
                { withCredentials: true },
            )
                .then((res) => {
                    alert('계정 등록이 완료 되었습니다:)');
                    loginMethod(email, authId);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    useEffect(() => {
        if (!inputState.academy_code.trim()) return;
        // 학원 코드 조회 및 검증하기
        Axios.get(`${apiUrl}/academies/exists/${inputState['academy_code']}`, { withCredentials: true })
            .then((res1) => {
                setUsertype((usertype) => {
                    if (usertype === 'students') {
                        Axios.get(`${apiUrl}/teachers/in-class/${inputState.academy_code}`, { withCredentials: true })
                            .then((res2) => {
                                setAcademyInfo({
                                    ...academyInfo,
                                    is_exists: res1.data.is_exists,
                                    name: res1.data.name,
                                    address: res1.data.address,
                                    teachers: res2.data,
                                });
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    } else if (usertype === 'teachers') {
                        setAcademyInfo({
                            ...academyInfo,
                            is_exists: res1.data.is_exists,
                            name: res1.data.name,
                            address: res1.data.address,
                        });
                    }
                    return usertype;
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }, [inputState.academy_code]);

    useEffect(() => {
        if (usertype === 'students') {
            if (!inputState['real_name'].trim()) {
                setRequestButtonEnable(false);
            } else {
                setRequestButtonEnable(true);
            }
        } else {
            if (!inputState['real_name'].trim() || !academyInfo.is_exists) {
                setRequestButtonEnable(false);
            } else {
                setRequestButtonEnable(true);
            }
        }

        // console.log(inputState, usertype, academyInfo, profileData);
    }, [usertype, academyInfo, inputState, profileData]);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(history.location.search);
        const queryUserType = urlSearchParams.get('user') || localStorage.getItem('loginFor');
        if (!['students', 'teachers'].includes(queryUserType)) {
            setUsertype(localStorage.getItem('loginFor'));
        } else {
            localStorage.setItem('loginFor', queryUserType);
            setUsertype(queryUserType);
        }
        setLoginStep(0);
    }, [history.location]);

    useEffect(() => {
        // console.log(history);
        if (!localStorage.getItem('loginFor')) localStorage.setItem('loginFor', 'students');
        const urlSearchParams = new URLSearchParams(history.location.search);
        const queryUserType = urlSearchParams.get('user') || localStorage.getItem('loginFor');
        if (!['students', 'teachers'].includes(queryUserType)) {
            history.replace($_loginDefault);
        } else {
            localStorage.setItem('loginFor', queryUserType);
            history.replace(`${$_loginDefault}?user=${queryUserType}`);
        }
    }, []);

    const getContentsForStep = (step) => {
        switch (step) {
            case 0:
                return (
                    <div className={classNames(usertype === 'students' ? 'bg-s' : 'bg-t', 'login-form')}>
                        {/* <h4>{usertype === 'students' ? '학생' : '선생님'} 로그인</h4> */}
                        <h3>
                            알트리드만의 <br />
                            시선흐름 추적을 통해 <br />
                            <b className={classNames(usertype === 'students' ? 'bold-s' : 'bold-t')}>학습 관리</b>를 경험해보세요.
                        </h3>
                        <div className="login-right">
                            <span>
                                <WhiteRadio
                                    onChange={handleChangeUsertype}
                                    checked={usertype === 'students'}
                                    value="students"
                                    name="students"
                                />
                                학생
                            </span>
                            <span>
                                <WhiteRadio
                                    onChange={handleChangeUsertype}
                                    checked={usertype === 'teachers'}
                                    value="teachers"
                                    name="teachers"
                                />
                                선생님
                            </span>

                            <LoginButtons
                                onSuccessGoogleAuth={onSuccessGoogleAuth}
                                onFailedGoogleAuth={onFailedGoogleAuth}
                                onSuccessKakaoAuth={onSuccessKakaoAuth}
                                onFailedKakaoAuth={onFailedKakaoAuth}
                                style={{ marginTop: '1.2rem' }}
                            />
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="additional-auth-root">
                        <div className={classNames('additional-auth-box', usertype === 'students' ? 'bg-s' : 'bg-t')}>
                            {usertype === 'students' ? (
                                <h3>
                                    학생의 이름을 <br />
                                    정확히 <br />
                                    입력해 주세요.
                                </h3>
                            ) : (
                                <h3>
                                    본인의 이름과 <br /> 학원 코드를 <br />
                                    입력해 주세요.
                                </h3>
                            )}

                            <div className="auth-right">
                                <h5>
                                    해당 정보는 본인 확인을 위한 용도로 이용되니, <br />
                                    정확히 기입 해주시기 바랍니다.
                                </h5>
                                <div className="form">
                                    <input
                                        className={classNames('default', inputError.real_name ? 'error' : '')}
                                        type="text"
                                        name="real_name"
                                        id="real_name"
                                        placeholder="이름"
                                        onChange={handleInputChange}
                                        value={inputState['real_name']}
                                    />
                                    {usertype === 'students' ? (
                                        ''
                                    ) : (
                                        <input
                                            className={classNames('default', inputError.academy_code ? 'error' : '')}
                                            type="text"
                                            name="academy_code"
                                            id="academy_code"
                                            placeholder="학원 코드"
                                            onChange={handleInputChange}
                                            value={inputState['academy_code']}
                                        />
                                    )}

                                    {academyInfo.name ? (
                                        <div className="academy-search-results">
                                            <p className="name">{academyInfo.name}</p>
                                            <p className="address">{academyInfo.address}</p>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="request-button">
                            <RequestButton disable={requestButtonEnable} usertype={usertype} onClick={handleRequestButtonClick}>
                                계정 등록
                            </RequestButton>
                        </div>
                    </div>
                );
            default:
                return <div>알 수 없는 오류 입니다.</div>;
        }
    };
    return (
        <>
            <header className={'header-bar'}>
                <div className="container left">
                    <img src={LogoWhite} alt="logo" />
                </div>
                <div className="container center"></div>
                <div className="container right"></div>
            </header>
            <main className={classNames('login-page', usertype === 'students' ? 'students' : 'teachers')}>
                <section className="contents-root">{getContentsForStep(loginStep)}</section>
            </main>
            {isMobile ? null : <Footer />}
        </>
    );
}

export default withRouter(Login);
