/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import '../../styles/logins.scss';
import { apiUrl } from '../../configs/configs';
import { withRouter } from 'react-router-dom';
import { Link, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import * as $ from 'jquery';
import TeachersList from '../../components/Login/TeachersList';
import styled from 'styled-components';
import Button from '../../AltridUI/Button/Button';
import TextField from '../../AltridUI/TextField/TextField';
import BackgroundTheme from '../../AltridUI/ThemeColors/BackgroundTheme';
import { useDispatch } from 'react-redux';
import { openAlertSnackbar } from '../../redux_modules/alertMaker';

const MainContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    height: calc(100vh - 360px);
`;
const LoginFormPaper = styled.section`
    border: 1px solid #e9edef;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1));
    padding: 16px;
    max-width: 320px;
    width: 100%;
`;
// const LoginDemoButton = withStyles((theme) => ({
//     root: {
//         color: 'white',
//         fontFamily: 'inherit',
//         fontSize: '1rem',
//         fontWeight: 600,

//         '&.MuiButton-outlined': {
//             borderWidth: 2,
//             borderColor: 'white',
//         },
//     },
// }))(Button);

const RequestButton = withStyles((theme) => ({
    root: {
        color: '#474747',
        fontFamily: 'inherit',
        minWidth: 128,
        minHeight: 52,
    },
}))(Button);

function LoginCandidated({ history }) {
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
        candidated_code: '',
    });
    const [inputError, setInputError] = useState({
        real_name: false,
        academy_code: false,
        candidated_code: false,
    });
    const [academyInfo, setAcademyInfo] = useState({
        is_exists: false,
        name: '',
        address: '',
        teachers: [],
    });
    const [requestButtonEnable, setRequestButtonEnable] = useState(true);

    const dispatch = useDispatch();

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
                        dispatch(openAlertSnackbar('?????? ????????? ????????????.\n????????? ????????????.', 'error'));
                        break;
                    case 'not-approved':
                        dispatch(
                            openAlertSnackbar(
                                `????????? ????????? ???????????????.\n${usertype === 'students' ? '????????????' : '????????????'} ????????? ??????????????????!`,
                                'warning',
                            ),
                        );
                        break;
                    default:
                        break;
                }
            });
    };

    const handleChangeUsertype = () => {
        if (usertype === 'students') {
            history.push('/login-candidated?user=teachers');
        } else {
            history.push('/login-candidated?user=students');
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

        // ?????????
        const email = profileData.email;
        // ??????
        const name = inputState.real_name;
        // ?????? ?????????(????????? ?????????)
        const authId = profileData.authId;
        // ?????? ?????? ?????????
        const authWith = profileData.authWith;
        // ?????? ??????
        const academyCode = inputState.academy_code;
        // ????????????
        // const phone = '';
        // ?????? ??????(????????? ?????? ??????)
        const approved = usertype === 'students' ? 1 : 0;
        // ?????? ???????????? ????????? ????????? ?????? ????????? ?????? ?????? ??????
        const teachers = inputState.teacher_selected.map((data) => [data.auth_id, authId, academyCode]);
        // console.log(email, name, authId, authWith, academyCode, phone, approved, teachers);

        if (usertype === 'students') {
            Axios.post(
                `${apiUrl}/students`,
                {
                    email: email || '',
                    name: name || '',
                    authId: authId,
                    authWith: authWith,
                    academyCode: academyCode,
                    approved: approved,
                },
                { withCredentials: true },
            )
                .then((res1) => {
                    // console.log(res1);
                    if (teachers.length > 0)
                        Axios.post(`${apiUrl}/students-in-teacher/first`, { teachers: teachers }, { withCredentials: true })
                            .then((res2) => {
                                dispatch(
                                    openAlertSnackbar(
                                        '?????? ????????? ?????? ???????????????.\n???????????? ???????????? ?????? ???????????? ????????? ?????????.',
                                        'success',
                                    ),
                                );
                                loginMethod(email, authId);
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    else {
                        dispatch(
                            openAlertSnackbar('?????? ????????? ?????? ???????????????.\n???????????? ???????????? ?????? ???????????? ????????? ?????????.', 'success'),
                        );
                        loginMethod(email, authId);
                    }
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
                },
                { withCredentials: true },
            )
                .then((res) => {
                    dispatch(openAlertSnackbar('?????? ????????? ?????? ???????????????.\n????????? ???????????? ????????? ?????????', 'success'));
                    setTimeout(() => {
                        document.location.replace('/login');
                    }, 2000);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    useEffect(() => {
        if (!inputState.academy_code.trim()) return;
        // ?????? ?????? ?????? ??? ????????????
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
        if (!inputState['real_name'].trim() || !academyInfo.is_exists || (!inputState.teacher_selected && usertype === 'students')) {
            setRequestButtonEnable(false);
        } else {
            setRequestButtonEnable(true);
        }
        // console.log(inputState, usertype, academyInfo, profileData);
    }, [usertype, academyInfo, inputState, profileData]);

    useEffect(() => {
        // console.log(history);
        if (!localStorage.getItem('loginFor')) localStorage.setItem('loginFor', 'students');
        const urlSearchParams = new URLSearchParams(history.location.search);
        const queryUserType = urlSearchParams.get('user') || localStorage.getItem('loginFor');
        if (!['students', 'teachers'].includes(queryUserType)) {
            history.replace('/login-candidated');
        } else {
            localStorage.setItem('loginFor', queryUserType);
            history.replace(`${'/login-candidated'}?user=${queryUserType}`);
        }
    }, []);

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

    const getContentsForStep = (step) => {
        switch (step) {
            case 0:
                return (
                    <div className="login-form" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h4>{usertype === 'students' ? '??????' : '?????????'} ?????? ?????????</h4>
                        <TextField
                            fullWidth
                            className={classNames('default', inputError.candidated_code ? 'error' : '')}
                            type="text"
                            name="candidated_code"
                            id="candidated_code"
                            label="?????? ??????"
                            onChange={handleInputChange}
                            value={inputState['candidated_code']}
                            variant="filled"
                            InputProps={{ disableUnderline: true }}
                            style={{ marginTop: 16 }}
                        />
                        <Button
                            fullWidth
                            variant="filled"
                            onClick={() => {
                                loginMethod(inputState['candidated_code'], inputState['candidated_code']);
                            }}
                            style={{ marginTop: 16 }}
                            colors="purple"
                        >
                            ?????????
                        </Button>
                        <div className="usertype-change-link">
                            <Link color="inherit" onClick={handleChangeUsertype}>
                                {usertype === 'students' ? '?????????' : '??????'} ?????? ?????? ??????
                            </Link>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="additional-auth">
                        <h4>????????? ????????? ?????? ????????? ????????? ?????????.</h4>
                        <h4>
                            ?????? ????????? ?????? ????????? ?????? ????????? ????????????, <span style={{ backgroundColor: '#ff0000a0' }}>?????????</span> ??????
                            ???????????? ????????????.
                        </h4>
                        <div className="form">
                            <input
                                className={classNames('default', inputError.real_name ? 'error' : '')}
                                type="text"
                                name="real_name"
                                id="real_name"
                                placeholder="??????"
                                onChange={handleInputChange}
                                value={inputState['real_name']}
                            />
                            <input
                                className={classNames('default', inputError.academy_code ? 'error' : '')}
                                type="text"
                                name="academy_code"
                                id="academy_code"
                                placeholder="?????? ??????"
                                onChange={handleInputChange}
                                value={inputState['academy_code']}
                            />
                            <div className="academy-search-results">
                                <p className="name">{academyInfo.name}</p>
                                <p className="address">{academyInfo.address}</p>
                            </div>
                            {academyInfo.is_exists && usertype === 'students' ? (
                                <TeachersList
                                    id="autocomplete-teachers"
                                    placeholder="????????? ??????"
                                    onChange={handleTeachersListChange}
                                    getOptionLabel={(option) => option.name + ' ?????????'}
                                    options={academyInfo.teachers}
                                />
                            ) : null}
                        </div>
                        <div className="request-button">
                            <RequestButton disabled={!requestButtonEnable} fullWidth variant="contained" onClick={handleRequestButtonClick}>
                                ?????? ??????
                            </RequestButton>
                        </div>
                    </div>
                );
            default:
                return <div>??? ??? ?????? ?????? ?????????.</div>;
        }
    };
    return (
        <>
            {/* <header className={'header-bar'}> */}
            {/* <div className="container left"><img src={LogoWhite} alt="logo" /></div> */}
            {/* <div className="container center"></div> */}
            {/* <div className="container right"></div> */}
            {/* </header> */}
            <BackgroundTheme colors="#ffffff" />
            <MainContainer className={classNames('login-page', usertype === 'students' ? 'students' : 'teachers')}>
                <LoginFormPaper className="contents-root">{getContentsForStep(loginStep)}</LoginFormPaper>
            </MainContainer>
        </>
    );
}

export default withRouter(LoginCandidated);
