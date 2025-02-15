/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import LoginButtons from '../../components/Login/LoginButtons';
import '../../styles/logins.scss';
import * as configs from '../../configs/config.json';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';
import * as $ from 'jquery';
import { $_loginDefault, $_loginStudent, $_loginTeacher } from '../../constants/front_urls';
import Radio from '@material-ui/core/Radio';
import styled from 'styled-components';
/** https://github.com/jeanlescure/short-unique-id
 * Copyright (c) 2018-2020 Short Unique ID Contributors.
 * Licensed under the Apache License 2.0.
 */
import ShortUniqueId from 'short-unique-id';
import BackgroundTheme from '../../AltridUI/ThemeColors/BackgroundTheme';
import { useDispatch } from 'react-redux';
import { openAlertSnackbar } from '../../redux_modules/alertMaker';

const LoginMain = styled.div`
    max-width: 672px;
    margin: 0 auto;
    text-align: center;

    & .LoginBox {
        margin-top: 93px;
        @media (min-width: 0px) and (max-width: 480px) {
            /* max-width: 328px; */
            /* width: 100%; */
            padding: 0 16px;
        }
        & .SelectBox {
            border: 1px solid #e9edef;
            box-sizing: border-box;
            max-width: 434px;
            /* width: 100%; */
            margin: 0 auto;
            border-radius: 16px;
            margin-top: 12px;
            height: 100%;
            max-height: 230px;
            filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1));
            /* margin-bottom: 264px; */
            @media (min-width: 0px) and (max-width: 480px) {
                margin: 0 auto;

                /* max-width: 328px; */
                width: 100%;

                max-height: 230px;
                height: 100%;
                margin-bottom: 128px;
            }

            & .radioselect {
                margin-bottom: 32px;
            }
        }
        & .loginTab {
            display: flex;
            max-width: 384px;
            max-height: 36px;
        }
    }
    /* @media (min-width: 0px) and (max-width: 480px) {
        & .SelectBox {
            margin: 0 auto;
            padding-left: 16px;
            max-width: 328px;
            width: 100%auto;
            padding-right: 16px;
            height: 230px;

            & .radioselect {
                & span {
                    & label,
                    input {
                        max-width: 139px;
                        width: 100%;
                    }
                }
            }
        }
        & h2 {
            margin: 0 auto;
            padding-left: 16px;
            max-width: 328px;
        }
    } */
`;

const RadioMenuGroup = styled.div`
    & span {
        & label {
            width: 100%;
            max-width: 184px;
            background-color: #f6f8f9;
            color: #9aa5af;
            border-radius: 8px;
            @media (min-width: 0px) and (max-width: 480px) {
                max-width: 132px;
                width: 100%;
            }
        }
        & input:checked + label {
            background-color: #200656;
            color: #ffffff;
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
        }
    }
`;

const AddName = styled.div`
    max-width: 672px;
    margin: 0 auto;
    text-align: center;
    margin-top: 93px;
    & h3 {
        font-weight: bold;
        font-size: 44px;
        line-height: 48px;
    }
    & h5 {
        font-size: 18px;
        margin-bottom: 32px;
    }
    & input {
        background: #f6f8f9;
        color: #77818b;
        width: 384px;
        padding: 16px;
        border-radius: 16px;
        margin-bottom: 16px;
    }
    & .nextButton {
        margin-bottom: 401px;
    }
    & .Description {
        margin-top: 16px;
        font-size: 18px;
    }
    @media (min-width: 0px) and (max-width: 480px) {
        padding: 0 16px;
        max-width: 328px;
        width: 100%;
        & h3 {
            font-size: 32px;
        }
        & h5 {
            font-size: 18px;
            font-weight: normal;
        }
        & input {
            width: 328px;
        }
    }
`;

const Make = styled.div`
    max-width: 672px;
    margin: 0 auto;
    text-align: center;
    margin-top: 93px;
    & h3 {
        font-weight: bold;
        font-size: 44px;
        margin-bottom: 33px;
    }
    & input {
        background-color: #f6f8f9;
        width: 384px;
        border-radius: 16px;
        margin-bottom: 5px;
        padding: 16px;
    }

    @media (min-width: 0px) and (max-width: 480px) {
        & h3 {
            font-size: 32px;
        }
        & input {
            width: 328px;
        }
    }
`;

const CodeAcademy = styled.div`
    max-width: 672px;
    margin: 0 auto;
    text-align: center;
    margin-top: 93px;
    & .code {
        margin: 0 auto;
        margin-top: 32px;
        width: 348px;
        height: 110px;
        background: #f4f1fa;
        border-radius: 16px;
        color: #3b1689;
        text-align: center;
    }

    @media (min-width: 0px) and (max-width: 480px) {
        & .code {
            max-width: 328px;
            width: 100%;
            padding: 0 16px;
        }
    }
`;

const WhiteRadio = withStyles({
    root: {
        color: '#E9EDEF',
        '&$checked': {
            color: '#6C46A1',
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const RequestButton = styled.button`
    background-color: ${(props) => (props.disable ? (props.usertype === 'students' ? '#43138B' : '#3B1689') : '#707070')};
    pointer-events: ${(props) => (props.disable ? 'auto' : 'none')};
    box-shadow: 0px 3px 6px #00000029;
    color: ${(props) => (props.disable ? '#fff' : '#ffffff5c')};
    font-family: inherit;
    width: 126px;
    height: 45px;
    border-radius: 11px;

    @media (min-width: 0px) and (max-width: 480px) {
        width: 328px;
        border-radius: 104px;
        padding: 0 16px;
    }
`;

function Login({ history }) {
    const [usertype, setUsertype] = useState('students');
    const [payment, setPayment] = useState(false);
    const [createOrEntrance, setCreateOrEntrance] = useState('create');
    const [profileData, setProfileData] = useState({
        email: '',
        authId: '',
        image: '',
        authWith: '',
    });
    // 로그인, 회원가입 페이지 설정
    const [loginStep, setLoginStep] = useState(0);
    const [inputState, setInputState] = useState({
        real_name: '',
        academy_code: '',
        academy_name: '',
        phone_no: '',
        teacher_selected: [],
    });
    const [inputError, setInputError] = useState({
        real_name: false,
        academy_code: false,
        academy_name: false,
        phone_no: false,
    });
    const [academyInfo, setAcademyInfo] = useState({
        is_exists: false,
        name: '',
        address: '',
        teachers: [],
    });
    const [requestButtonEnable, setRequestButtonEnable] = useState(false);
    const generateUid = useRef();

    const dispatch = useDispatch();

    const loginMethod = (email, authId) => {
        Axios.post(
            configs.SERVER_HOST + '/auth/' + usertype,
            {
                email: email || '',
                authId: authId || '',
            },
            { withCredentials: true },
        )
            .then(() => {
                if (payment === 'true') {
                    history.replace('/pricing');
                } else {
                    history.replace('/');
                }
            })
            .catch((err) => {
                console.error(err);
                switch (err.response.data.code) {
                    case 'not-in-database':
                        dispatch(openAlertSnackbar('회원 정보가 없습니다.\n등록을 해주세요.', 'error'));
                        break;
                    case 'not-approved':
                        dispatch(
                            openAlertSnackbar(
                                `승인이 필요한 계정입니다.\n${usertype === 'students' ? '선생님의' : '관리자의'} 승인을 기다려주세요!`,
                                'warning',
                            ),
                        );
                        break;
                    default:
                        break;
                }
            });
    };

    const issueTempToken = (email, authId) => {
        Axios.post(`${configs.SERVER_HOST}/auth/temp`, { email: email, authId: authId }, { withCredentials: true })
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
        Axios.get(`${configs.SERVER_HOST}/${usertype}/exists/${profileObj.googleId}`, { withCredentials: true })
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
        switch (err.error) {
            case 'popup_closed_by_user':
                break;
            default:
                dispatch(openAlertSnackbar('로그인에 실패했습니다. 에러코드 :: ' + err.error, 'error'));
                break;
        }
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
        Axios.get(`${configs.SERVER_HOST}/${usertype}/exists/${profile.id}`, { withCredentials: true })
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
        dispatch(openAlertSnackbar('로그인에 실패했습니다. 에러코드 :: ' + err, 'error'));
    };

    const handleChangeUsertype = (e, newValue) => {
        if (e.target.value === 'teachers') {
            history.replace($_loginTeacher);
        } else {
            history.replace($_loginStudent);
        }
        setValue(newValue);
    };

    const handleChangeCreateOrEntrance = (e) => {
        setCreateOrEntrance(e.target.value);
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

    // const handleTeachersListChange = (e, value) => {
    //     setInputState({
    //         ...inputState,
    //         teacher_selected: value,
    //     });
    // };

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
        // 학원 이름
        const academyName = inputState.academy_name;
        //프로필 이미지
        const image = profileData.image;
        // 전화번호
        const phone = inputState.phone_no;
        // 승인 여부( 선생님, 학생 모두 즉시 승인)
        const approved = 1;
        // 현재 등록하는 대상이 학생인 경우 선생님 선택 목록 구성
        // const teachers = inputState.teacher_selected.map((data) => [data.auth_id, authId, academyCode]);

        if (usertype === 'students') {
            Axios.post(
                `${configs.SERVER_HOST}/students`,
                {
                    email: email || '',
                    name: name || '',
                    authId: authId,
                    authWith: authWith,
                    academyCode: '',
                    approved: approved,
                    image: image,
                    phone: phone,
                },
                { withCredentials: true },
            )
                .then((res1) => {
                    // console.log(res1);
                    // if (teachers.length > 0)
                    //     Axios.post(`${configs.SERVER_HOST}/students-in-teacher/first`, { teachers: teachers }, { withCredentials: true })
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
                    dispatch(openAlertSnackbar('계정 등록이 완료되었습니다.'));
                    setTimeout(() => {
                        loginMethod(email, authId);
                    }, 2000);
                })
                .catch((err) => {
                    console.error(err);
                });
        } else if (usertype === 'teachers') {
            const addTeacherMethod = () => {
                Axios.post(
                    `${configs.SERVER_HOST}/teachers`,
                    {
                        email: email || '',
                        name: name || '',
                        authId: authId,
                        authWith: authWith,
                        academyCode: academyCode,
                        approved: approved,
                        image: image,
                        phone: phone,
                    },
                    { withCredentials: true },
                )
                    .then((res) => {
                        dispatch(openAlertSnackbar('계정 등록이 완료되었습니다.'));
                        setTimeout(() => {
                            loginMethod(email, authId);
                        }, 2000);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            };

            if (createOrEntrance === 'create') {
                Axios.post(
                    `${configs.SERVER_HOST}/academies`,
                    {
                        code: academyCode,
                        name: academyName,
                        address: null,
                        email: email,
                        phone: phone,
                        numOfStudents: 5,
                        numOfTeachers: 1,
                    },
                    { withCredentials: true },
                )
                    .then((resAcademyCreation) => {
                        addTeacherMethod();
                    })
                    .catch((errorAcademyCreation) => {
                        console.error(errorAcademyCreation);
                    });
            } else {
                Axios.get(`${configs.SERVER_HOST}/plan-info/login-planId/${academyCode}`, { academyCode: academyCode }, { withCredentials: true })
                    .then((res) => {
                        const { teacherNums, planId } = res.data[0];

                        //planId = 1 : teacherNums <= 1
                        //planId = 2 : teacherNums <= 5
                        //planId = 3 : teacherNums <= 10

                        // 여기서는 자기 자신 미포함 수로 체크
                        if ((planId === 1 && teacherNums < 1) || (planId === 2 && teacherNums < 5) || (planId === 3 && teacherNums < 10))
                            addTeacherMethod();
                        else {
                            dispatch(openAlertSnackbar('선생님 초대인원이 초과되었습니다.\n학원 개설자에게 문의해주세요', 'error'));
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        }
    };

    // const handleCheckDuplicateAcademyName = ({ target }) => {
    //     const { value } = target;
    //     console.log(value);
    //     Axios.get(`${configs.SERVER_HOST}/academies/exists-name/${inputState['academy_name']}`, { withCredentials: true })
    //         .then((res) => {
    //             console.log(res.data);
    //             setInputError({ ...inputError, academy_name: res.data.is_exists });
    //             if (res.data.is_exists) alert('다른 곳에서 사용 중인 학원 이름입니다.\n다른 이름을 입력해 주세요.');
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             setInputError({ ...inputError, academy_name: true });
    //         });
    // };

    useEffect(() => {
        if (!inputState.academy_code.trim()) return;
        // 학원 코드 조회 및 검증하기
        Axios.get(`${configs.SERVER_HOST}/academies/exists/${inputState['academy_code']}`, { withCredentials: true })
            .then((res1) => {
                setUsertype((usertype) => {
                    if (usertype === 'students') {
                        Axios.get(`${configs.SERVER_HOST}/teachers/in-class/${inputState.academy_code}`, { withCredentials: true })
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
                                dispatch(openAlertSnackbar('학원 조회 중 오류가 발생했습니다.\n증상 지속시 문의 바랍니다.', 'error'));
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
        switch (loginStep) {
            case 0:
                break;
            case 1:
                if (!inputState['real_name'].trim()) {
                    setRequestButtonEnable(false);
                } else {
                    setRequestButtonEnable(true);
                }
                break;
            case 2:
                const phoneReg = new RegExp('^[0-9]{8,32}$');
                if (createOrEntrance === 'create') {
                    if (
                        !inputState['academy_name'].trim() ||
                        !inputState['phone_no'].trim() ||
                        !inputState['phone_no'].trim().match(phoneReg)
                    ) {
                        setRequestButtonEnable(false);
                    } else {
                        setRequestButtonEnable(true);
                    }
                } else {
                    if (!inputState['academy_code'].trim() || !academyInfo.name) {
                        setRequestButtonEnable(false);
                    } else {
                        setRequestButtonEnable(true);
                    }
                }
                break;
            case 3:
                break;
            default:
                setRequestButtonEnable(false);
                break;
        }

        // console.log(inputState, usertype, academyInfo, profileData);
    }, [usertype, academyInfo, inputState, profileData]);

    useEffect(() => {
        if (loginStep > 2) return;
        setRequestButtonEnable(false);
        setInputState({ ...inputState, academy_name: '', phone_no: '', academy_code: '' });
        setAcademyInfo({ ...academyInfo, is_exists: false, name: '', address: '' });
    }, [loginStep, createOrEntrance]);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(history.location.search);
        const queryUserType = urlSearchParams.get('user') || localStorage.getItem('loginFor');
        const queryPaymetType = urlSearchParams.get('payment') || localStorage.getItem('loginFor');

        if (!['students', 'teachers'].includes(queryUserType)) {
            setUsertype(localStorage.getItem('loginFor'));
        } else {
            localStorage.setItem('loginFor', queryUserType);
            setUsertype(queryUserType);
            setPayment(queryPaymetType);
        }
        // setLoginStep(0);
    }, [history.location]);

    useEffect(() => {
        // console.log(history);
        if (!localStorage.getItem('loginFor')) localStorage.setItem('loginFor', 'students');
        const urlSearchParams = new URLSearchParams(history.location.search);
        const queryUserType = urlSearchParams.get('user') || localStorage.getItem('loginFor');
        const queryPaymetType = urlSearchParams.get('payment')
            ? urlSearchParams.get('payment') || localStorage.getItem('loginFor')
            : 'false';

        if (!['students', 'teachers'].includes(queryUserType)) {
            history.replace($_loginDefault);
        } else {
            localStorage.setItem('loginFor', queryUserType);
            history.replace(`${$_loginDefault}?user=${queryUserType}&payment=${queryPaymetType}`);
        }
        // assign ShortUniqueId function
        generateUid.current = new ShortUniqueId();
    }, []);

    // const headerMenus = [
    //     {
    //         mId: 0,
    //         mName: '선생님',
    //     },
    //     {
    //         mId: 1,
    //         mName: '학생',
    //     },
    // ];
    const [value, setValue] = useState('students');
    window.test = usertype;
    const getContentsForStep = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <LoginMain>
                            <div className="LoginBox">
                                <svg width="71" height="47" viewBox="0 0 71 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M23.337 0.0335945C23.9963 -0.100785 24.3918 0.167979 24.5237 0.839887C24.6555 1.37741 24.3918 1.71337 23.7326 1.84775C18.8542 2.9228 14.8329 4.66976 11.6685 7.08863C8.63603 9.37312 7.11978 11.8592 7.11978 14.5468C7.11978 16.1594 7.64717 17.436 8.70195 18.3767C9.88858 19.3174 13.3825 20.4596 19.1838 21.8034C23.2711 22.8785 26.2377 24.4239 28.0836 26.4396C30.0613 28.4553 31.0501 31.0758 31.0501 34.3009C31.0501 37.9292 29.7976 40.9528 27.2925 43.3717C24.7874 45.7906 21.5571 47 17.6017 47C12.4596 47 8.24048 45.1858 4.94429 41.5575C1.6481 37.7948 0 33.0243 0 27.2459C0 20.258 2.04364 14.4124 6.13092 9.70907C10.35 5.00572 16.0854 1.78056 23.337 0.0335945ZM63.0891 0.0335945C63.7484 -0.100785 64.1439 0.167979 64.2758 0.839887C64.5395 1.37741 64.3417 1.71337 63.6824 1.84775C58.8041 2.9228 54.7827 4.66976 51.6184 7.08863C48.5859 9.37312 47.0696 11.8592 47.0696 14.5468C47.0696 16.1594 47.597 17.436 48.6518 18.3767C49.7066 19.3174 53.1346 20.4596 58.9359 21.8034C63.1551 22.8785 66.1875 24.4239 68.0334 26.4396C70.0111 28.4553 71 31.0758 71 34.3009C71 37.9292 69.7474 40.9528 67.2423 43.3717C64.7372 45.7906 61.507 47 57.5515 47C52.4095 47 48.1903 45.1187 44.8941 41.356C41.598 37.4589 39.9499 32.554 39.9499 26.6412C39.9499 19.7877 41.9935 14.0765 46.0808 9.5075C50.1681 4.93853 55.8375 1.78056 63.0891 0.0335945Z"
                                        fill="#AEFFE0"
                                    />
                                </svg>

                                <h2>
                                    알트리드만의 시선흐름 추적을 통해 <br />
                                    학습 관리를 경험해보세요.
                                </h2>
                                <div className="SelectBox">
                                    <div style={{ marginTop: '29px' }} className="radioselect">
                                        <RadioMenuGroup>
                                            <span>
                                                <input
                                                    style={{ display: 'none' }}
                                                    type="radio"
                                                    onChange={handleChangeUsertype}
                                                    checked={usertype === 'students'}
                                                    onClick={() => {
                                                        setUsertype('students');
                                                    }}
                                                    value="students"
                                                    name="students"
                                                    id="students"
                                                />
                                                <label
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '8px 4px',
                                                        // backgroundColor: '#F6F8F9',
                                                        // width: '192px',
                                                    }}
                                                    htmlFor="students"
                                                >
                                                    학생
                                                </label>
                                            </span>
                                            <span>
                                                <input
                                                    style={{ display: 'none' }}
                                                    type="radio"
                                                    onChange={handleChangeUsertype}
                                                    checked={usertype === 'teachers'}
                                                    onClick={() => {
                                                        setUsertype('teachers');
                                                    }}
                                                    value="teachers"
                                                    name="teachers"
                                                    id="teachers"
                                                />
                                                <label
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '8px 4px',
                                                        // backgroundColor: '#F6F8F9',
                                                        // width: '192px',
                                                    }}
                                                    htmlFor="teachers"
                                                >
                                                    선생님
                                                </label>
                                            </span>
                                        </RadioMenuGroup>
                                        <LoginButtons
                                            onSuccessGoogleAuth={onSuccessGoogleAuth}
                                            onFailedGoogleAuth={onFailedGoogleAuth}
                                            onSuccessKakaoAuth={onSuccessKakaoAuth}
                                            onFailedKakaoAuth={onFailedKakaoAuth}
                                            style={{ marginTop: '1.2rem' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </LoginMain>
                    </>
                    // <div className={classNames(usertype === 'students' ? 'bg-s' : 'bg-t', 'login-form')}>
                    //     {/* <h4>{usertype === 'students' ? '학생' : '선생님'} 로그인</h4> */}
                    //     <h3>
                    //         알트리드만의 <br />
                    //         시선흐름 추적을 통해 <br />
                    //         <b className={classNames(usertype === 'students' ? 'bold-s' : 'bold-t')}>학습 관리</b>를 경험해보세요.
                    //     </h3>
                    //     <div className="login-right">
                    // <span>
                    //     <WhiteRadio
                    //         onChange={handleChangeUsertype}
                    //         checked={usertype === 'students'}
                    //         value="students"
                    //         name="students"
                    //     />
                    //     학생
                    // </span>
                    // <span>
                    //     <WhiteRadio
                    //         onChange={handleChangeUsertype}
                    //         checked={usertype === 'teachers'}
                    //         value="teachers"
                    //         name="teachers"
                    //     />
                    //     선생님
                    // </span>

                    // <LoginButtons
                    //     onSuccessGoogleAuth={onSuccessGoogleAuth}
                    //     onFailedGoogleAuth={onFailedGoogleAuth}
                    //     onSuccessKakaoAuth={onSuccessKakaoAuth}
                    //     onFailedKakaoAuth={onFailedKakaoAuth}
                    //     style={{ marginTop: '1.2rem' }}
                    // />
                    //     </div>
                    // </div>
                );
            case 1:
                return (
                    <>
                        <AddName>
                            {usertype === 'students' ? (
                                <h3>학생의 이름을 정확히 입력해주세요</h3>
                            ) : (
                                <h3>본인의 이름을 정확히 입력해주세요</h3>
                            )}

                            <div className="Description">
                                <h5>해당 정보는 본인 확인을 위한 용도로 이용되니, 정확히 기입 해주시기 바랍니다.</h5>
                            </div>
                            <input
                                type="text"
                                name="real_name"
                                id="real_name"
                                placeholder="이름"
                                onChange={handleInputChange}
                                value={inputState['real_name']}
                            ></input>

                            <div className="nextButton">
                                {usertype === 'students' ? (
                                    <RequestButton disable={requestButtonEnable} usertype={usertype} onClick={handleRequestButtonClick}>
                                        계정 등록
                                    </RequestButton>
                                ) : (
                                    <RequestButton
                                        disable={requestButtonEnable}
                                        usertype={usertype}
                                        onClick={() => {
                                            setLoginStep(2);
                                        }}
                                    >
                                        다음
                                    </RequestButton>
                                )}
                            </div>
                        </AddName>
                    </>
                );
            // <div className="additional-auth-root">
            //     <div className={classNames('additional-auth-box', usertype === 'students' ? 'bg-s' : 'bg-t')}>
            //         {usertype === 'students' ? (
            //             <h3>학생의 이름을 정확히 입력해 주세요.</h3>
            //         ) : (
            //             <h3>본인의 이름을 정확히 입력해 주세요.</h3>
            //         )}

            //         <div className="auth-right">
            //             <h5>해당 정보는 본인 확인을 위한 용도로 이용되니, 정확히 기입 해주시기 바랍니다.</h5>
            //             <div className="form">
            //                 <input
            //                     className={classNames('default', inputError.real_name ? 'error' : '')}
            //                     type="text"
            //                     name="real_name"
            //                     id="real_name"
            //                     placeholder="이름"
            //                     onChange={handleInputChange}
            //                     value={inputState['real_name']}
            //                 />
            //                 {/* {usertype === 'students' ? (
            //                     ''
            //                 ) : (
            //                     <input
            //                         className={classNames('default', inputError.academy_code ? 'error' : '')}
            //                         type="text"
            //                         name="academy_code"
            //                         id="academy_code"
            //                         placeholder="학원 코드"
            //                         onChange={handleInputChange}
            //                         value={inputState['academy_code']}
            //                     />
            //                 )} */}
            //             </div>
            //         </div>
            //     </div>
            //     <div className="request-button">
            //         {usertype === 'students' ? (
            //             <RequestButton disable={requestButtonEnable} usertype={usertype} onClick={handleRequestButtonClick}>
            //                 계정 등록
            //             </RequestButton>
            //         ) : (
            //             <RequestButton
            //                 disable={requestButtonEnable}
            //                 usertype={usertype}
            //                 onClick={() => {
            //                     setLoginStep(2);
            //                 }}
            //             >
            //                 다음
            //             </RequestButton>
            //         )}
            //     </div>
            // </div>

            case 2:
                return (
                    <>
                        <Make>
                            <div className="MakeAcdemy">
                                <h3>
                                    새로운 학원을 개설하거나
                                    <br /> 기존 학원에 입장해주세요.
                                </h3>

                                <span>
                                    <WhiteRadio
                                        onChange={handleChangeCreateOrEntrance}
                                        checked={createOrEntrance === 'create'}
                                        value="create"
                                        name="create"
                                    />
                                    새 학원 개설하기
                                </span>
                                <span>
                                    <WhiteRadio
                                        onChange={handleChangeCreateOrEntrance}
                                        checked={createOrEntrance === 'entrance'}
                                        value="entrance"
                                        name="entrance"
                                    />
                                    학원 입장하기
                                </span>
                                <div className="academy">
                                    {createOrEntrance === 'create' ? (
                                        <>
                                            <input
                                                className={classNames('default', inputError.academy_name ? 'error' : '')}
                                                type="text"
                                                name="academy_name"
                                                id="academy_name"
                                                placeholder="학원 이름"
                                                onChange={handleInputChange}
                                                value={inputState['academy_name']}
                                            />
                                            <input
                                                className={classNames('default', inputError.phone_no ? 'error' : '')}
                                                type="text"
                                                name="phone_no"
                                                id="phone_no"
                                                placeholder="연락처 ('-' 제외)"
                                                onChange={handleInputChange}
                                                value={inputState['phone_no']}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                className={classNames('default', inputError.academy_code ? 'error' : '')}
                                                type="text"
                                                name="academy_code"
                                                id="academy_code"
                                                placeholder="학원 코드"
                                                onChange={handleInputChange}
                                                value={inputState['academy_code']}
                                            />
                                            {academyInfo.name ? (
                                                <div className="academy-search-results">
                                                    <p className="name">{academyInfo.name}</p>
                                                    <p className="address">{academyInfo.address}</p>
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div style={{ marginTop: '32px', marginBottom: '269px' }} className="request-button">
                                {createOrEntrance === 'create' ? (
                                    <RequestButton
                                        disable={requestButtonEnable}
                                        usertype={usertype}
                                        onClick={() => {
                                            const newCode = String.fromCharCode((Date.now() % 26) + 65) + generateUid.current(4);
                                            setInputState({ ...inputState, academy_code: newCode });
                                            setLoginStep(3);
                                        }}
                                    >
                                        다음
                                    </RequestButton>
                                ) : (
                                    <RequestButton disable={requestButtonEnable} usertype={usertype} onClick={handleRequestButtonClick}>
                                        계정 등록
                                    </RequestButton>
                                )}
                            </div>
                        </Make>
                    </>
                    // <div className="additional-auth-root">
                    //     <div className={classNames('additional-auth-box', usertype === 'students' ? 'bg-s' : 'bg-t')}>
                    //         <h3>새로운 학원을 개설하시거나 기존 학원에 입장해주세요.</h3>
                    //         <div className="auth-right">
                    //             <div className="radio-group-container">
                    //                 <span>
                    //                     <WhiteRadio
                    //                         onChange={handleChangeCreateOrEntrance}
                    //                         checked={createOrEntrance === 'create'}
                    //                         value="create"
                    //                         name="create"
                    //                     />
                    //                     새 학원 개설하기
                    //                 </span>
                    //                 <span>
                    //                     <WhiteRadio
                    //                         onChange={handleChangeCreateOrEntrance}
                    //                         checked={createOrEntrance === 'entrance'}
                    //                         value="entrance"
                    //                         name="entrance"
                    //                     />
                    //                     학원 입장하기
                    //                 </span>
                    //             </div>
                    //             <div className="form">
                    //                 {createOrEntrance === 'create' ? (
                    //                     <>
                    //                         <input
                    //                             className={classNames('default', inputError.academy_name ? 'error' : '')}
                    //                             type="text"
                    //                             name="academy_name"
                    //                             id="academy_name"
                    //                             placeholder="학원 이름"
                    //                             onChange={handleInputChange}
                    //                             value={inputState['academy_name']}
                    //                         />
                    //                         <input
                    //                             className={classNames('default', inputError.phone_no ? 'error' : '')}
                    //                             type="text"
                    //                             name="phone_no"
                    //                             id="phone_no"
                    //                             placeholder="연락처 ('-' 제외)"
                    //                             onChange={handleInputChange}
                    //                             value={inputState['phone_no']}
                    //                         />
                    //                     </>
                    //                 ) : (
                    //                     <>
                    //                         <input
                    //                             className={classNames('default', inputError.academy_code ? 'error' : '')}
                    //                             type="text"
                    //                             name="academy_code"
                    //                             id="academy_code"
                    //                             placeholder="학원 코드"
                    //                             onChange={handleInputChange}
                    //                             value={inputState['academy_code']}
                    //                         />
                    //                         {academyInfo.name ? (
                    //                             <div className="academy-search-results">
                    //                                 <p className="name">{academyInfo.name}</p>
                    //                                 <p className="address">{academyInfo.address}</p>
                    //                             </div>
                    //                         ) : (
                    //                             ''
                    //                         )}
                    //                     </>
                    //                 )}
                    //             </div>
                    //         </div>
                    //     </div>
                    //     <div className="request-button">
                    //         {createOrEntrance === 'create' ? (
                    //             <RequestButton
                    //                 disable={requestButtonEnable}
                    //                 usertype={usertype}
                    //                 onClick={() => {
                    //                     const newCode = String.fromCharCode((Date.now() % 26) + 65) + generateUid.current(4);
                    //                     setInputState({ ...inputState, academy_code: newCode });
                    //                     setLoginStep(3);
                    //                 }}
                    //             >
                    //                 다음
                    //             </RequestButton>
                    //         ) : (
                    //             <RequestButton disable={requestButtonEnable} usertype={usertype} onClick={handleRequestButtonClick}>
                    //                 계정 등록
                    //             </RequestButton>
                    //         )}
                    //     </div>
                    // </div>
                );

            case 3:
                return (
                    <>
                        <CodeAcademy>
                            <h3>{inputState['academy_name']}의 학원 코드는 </h3>
                            <div
                                style={{
                                    width: '348px',
                                    backgroundColor: '#f4f1fa',
                                    borderRadius: '16px',
                                    color: '#3b1689',
                                    textAlign: 'center',
                                    padding: ' 33px 0px',
                                    fontSize: '40px',
                                    fontWeight: 'bold',
                                    margin: '0 auto',
                                    marginTop: '32px',
                                    marginBottom: '44px',
                                }}
                                className="code"
                            >
                                {inputState['academy_code']}
                            </div>
                            <div style={{ marginBottom: '304px' }}>
                                <RequestButton disable={requestButtonEnable} usertype={usertype} onClick={handleRequestButtonClick}>
                                    계정 등록
                                </RequestButton>
                            </div>
                        </CodeAcademy>
                    </>
                    // <div className="additional-auth-root">
                    //     <div className={classNames('additional-auth-box new-academy-code', usertype === 'students' ? 'bg-s' : 'bg-t')}>
                    //         <h3 className="no-width">
                    //             <span className="academy-name">{inputState['academy_name']}</span>의 학원 코드는
                    //         </h3>
                    //         <h3 className="code-block">{inputState['academy_code']}</h3>
                    //         <h3 className="no-width ed">입니다.</h3>
                    //     </div>
                    //     <div className="request-button">
                    //         <RequestButton disable={requestButtonEnable} usertype={usertype} onClick={handleRequestButtonClick}>
                    //             계정 등록
                    //         </RequestButton>
                    //     </div>
                    // </div>
                );
            default:
                return <div>알 수 없는 오류 입니다.</div>;
        }
    };
    return (
        <>
            <BackgroundTheme colors="#ffffff" />
            <header className={'header-bar'}>
                {/* <div className="container left">
                    <img src={LogoWhite} alt="logo" />
                </div> */}
                <div className="container center"></div>
                <div className="container right"></div>
            </header>
            <main className={classNames('login-page', usertype === 'students' ? 'students' : 'teachers')}>
                <section className="contents-root">{getContentsForStep(loginStep)}</section>
            </main>
        </>
    );
}

export default withRouter(Login);
