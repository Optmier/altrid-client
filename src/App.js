/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react';
import Axios from 'axios';
import './styles/common.scss';
import { Element } from 'react-scroll';
import Class from './pages/Classes/Class';
import Main from './pages/Mains/Main';
import { Switch, Route, withRouter } from 'react-router-dom';
import ScrollTop from './components/essentials/ScrollTop';
import TrashButton from './components/essentials/TrashButton';
import Login from './pages/Logins/Login';
import Error from './pages/Errors/Error';
import isMobile from './controllers/isMobile';
import LoginAdmin from './pages/Logins/LoginAdmin';
import { apiUrl } from './configs/configs';
import { useDispatch, useSelector } from 'react-redux';
import { saveSession, deleteSession, updateSession } from './redux_modules/sessions';
import { getServerDate } from './redux_modules/serverdate';
import { getPlanInfo } from './redux_modules/planInfo';
import { $_loginAdmin, $_loginDefault, $_loginStudent, $_loginTeacher, $_root } from './configs/front_urls';
import AdminMain from './pages/Admins/AdminMain';
import AssignmentDoItNow from './pages/Assignments/AssignmentDoItNow';
import RestrictRoute from './components/essentials/RestrictRoute';
import RefreshToken from './components/essentials/Authentication';
import channelIOAccessKey from './components/ChannelIO/accessKeys';
import ChannelService from './components/ChannelIO/ChannelService';
import generateHash from './components/ChannelIO/generateHash';
import CustomChannelIOButton from './components/ChannelIO/CustomChannelIOButton';
import LoginCandidated from './pages/Logins/LoginCandidated';
import VideoLectureEyetracker from './components/VideoLectures/VideoLectureEyetracker';
import VideoLectureEyetrackDetectionList from './components/VideoLectures/VideoLectureEyetrackDetectionList';
import LoginMobileAppRedirect from './pages/Logins/LoginMobileAppRedirect';
import MyPage from './pages/Accounts/MyPage';
import Price from './pages/PriceAndPayments/Price';
import PriceDetails from './components/Price/PriceDetails';
import Payment from './pages/PriceAndPayments/Payment';
import PayState from './pages/PriceAndPayments/PayState';
import AlertSubscribe from './components/essentials/AlertSubscribe';
import TimerTest from './pages/_TempPages/TimerTest';
import { attachOptimer } from './redux_modules/optimerHelper';
import ComponentTest from './pages/_TempPages/ComponentTest';
import CamStudyEyetracker from './components/Camstudy/components/CamStudyEyetracker';
import Calendar from './pages/Classes/components/Calendar';
import Profile from './components/MyPage/Profile';
import styled from 'styled-components';
import HeaderBar from './components/essentials/HeaderBar';
import Footer from './components/essentials/Footer';
import MainDraft from './pages/MainDrafts/MainDraft';
import Dashboard from './pages/Dashboards/Dashboard';

const MainContainer = styled.main`
    flex: 1;
`;

window.axios = Axios;
window.lastUrl = '/';
window.tokenRefresher = null;
const loginUrls = [$_loginDefault, $_loginStudent, $_loginTeacher, $_loginAdmin, '/login-candidated', '/login-mobile-app-redirect'];
// const excludesForAdminUrls = [];
// const excludesForTeacherUrls = ['/admins', '/admins/members', '/admins/contents-requests'];
// const excludesForStudentUrls = ['/admins', '/admins/members', '/admins/contents-requests'];
function App({ history, match }) {
    const dispatch = useDispatch();
    const saveSessions = useCallback(
        (authId, userName, userType, academyCode, academyName, issuer, iat, exp, image) =>
            dispatch(saveSession(authId, userName, userType, academyCode, academyName, issuer, iat, exp, image)),
        [dispatch],
    );
    const updateSessions = useCallback((updateStates) => dispatch(updateSession(updateStates)), [dispatch]);
    const deleteSessions = useCallback(() => dispatch(deleteSession()), [dispatch]);
    const sessions = useSelector((state) => state.RdxSessions);
    const optimerModule = useSelector((state) => state.RdxOpTimerHelper);

    if (!loginUrls.includes(history.location.pathname)) window.lastUrl = history.location.pathname;

    window.logout = () => {
        Axios.delete(`${apiUrl}/auth`, { withCredentials: true })
            .then((res) => {
                deleteSessions();
                // document.body.innerHTML = '로그아웃 되었습니다.';
                // alert('성공적으로 로그아웃 되었습니다!');
                document.location.replace($_loginDefault);
                try {
                    window.Android.CallMobAndroidLogin();
                } catch (error) {}
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        Axios.get(apiUrl + '/auth', { withCredentials: true })
            .then((res1) => {
                if (loginUrls.includes(history.location.pathname)) history.replace(window.lastUrl);
                // switch (res1.data.userType) {
                //     case 'admins':
                //         if (excludesForAdminUrls.includes(history.location.pathname)) {
                //             history.replace($_root);
                //             alert('권한이 없는 사용자 입니다.');
                //         }
                //         break;
                //     case 'teachers':
                //         if (excludesForTeacherUrls.includes(history.location.pathname)) {
                //             history.replace($_root);
                //             alert('권한이 없는 사용자 입니다.');
                //         }
                //         break;
                //     case 'students':
                //         if (excludesForStudentUrls.includes(history.location.pathname)) {
                //             // history.replace($_root);
                //             // alert('권한이 없는 사용자 입니다.');
                //         }
                //         break;
                // }

                const { authId, exp, academyCode, iat, iss, userName, userType, image } = res1.data;
                saveSessions(authId, userName, userType, academyCode, null, iss, iat, exp, image);

                Axios.get(`${apiUrl}/academies/current/name`, { withCredentials: true })
                    .then((res2) => {
                        const academyName = res2.data.name;
                        const academyApproved = res2.data.approved;
                        const academyPlanId = res2.data.plan_id;

                        if (academyName) {
                            updateSessions({
                                academyName: academyName,
                                academyApproved: academyApproved,
                                academyPlanId: academyPlanId,
                            });
                        }
                        try {
                            window.Android.ShowWebView();
                        } catch (error) {
                            // console.error(error);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    if (!loginUrls.includes(history.location.pathname)) {
                        // alert('로그인이 필요합니다.');
                        history.replace($_loginDefault);
                        try {
                            window.Android.CallMobAndroidLogin();
                        } catch (error) {}
                    }
                } else if (err.response.data.code === 'TokenExpiredError') {
                    alert('세션이 만료되어 다시 로그인 해야합니다.');
                    window.logout();
                }
            });
    }, [history.location]);

    useEffect(() => {
        if (channelIOAccessKey.pluginKey) {
            ChannelService.shutdown();
            ChannelService.boot({
                pluginKey: channelIOAccessKey.pluginKey, //please fill with your plugin key
                memberId: sessions.authId,
                hideChannelButtonOnBoot: true,
                profile: {
                    name: sessions.userName,
                    email: null,
                    mobileNumber: null,
                    userType: sessions.userType,
                    academyCode: sessions.academyCode,
                    loginedAt: sessions.iat,
                    referrer: window.location.href,
                },
                memberHash: generateHash(sessions.authId || ''),
            });
        }
        if (!sessions || !sessions.exp || !sessions.academyName) {
            return;
        }

        dispatch(getServerDate());
        dispatch(getPlanInfo());

        !window.tokenRefresher &&
            (window.tokenRefresher = setInterval(() => {
                /** Token 만료 전 재발급 */
                // dispatch(getServerDate());
                RefreshToken(sessions.exp, 1800)
                    .then((res) => {
                        updateSessions({ iat: res.auth.iat, exp: res.auth.exp });
                        clearInterval(window.tokenRefresher);
                        window.tokenRefresher = null;
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                /******************* */
            }, 10000));

        if (!optimerModule.optimer && sessions.userType === 'students') {
            dispatch(attachOptimer(sessions.authId));
        }
    }, [sessions, optimerModule]);

    // console.log(history, match);
    const HeaderBarSelector = (currentPath) => {
        if (currentPath.includes('/login')) return <HeaderBar onlyLogo />;
        else if (
            currentPath === '/' ||
            currentPath.includes('/profile') ||
            currentPath.includes('/mypage') ||
            currentPath.includes('/main-draft') ||
            currentPath.includes('/dashboard') ||
            currentPath.includes('/pricing') ||
            currentPath.includes('/payment') ||
            currentPath.includes('/pay-state')
        )
            return <HeaderBar />;
        else if (
            currentPath.includes('/assignments') ||
            currentPath.includes('/video-lecture-detect-lists') ||
            currentPath.includes('/video-lecture-eyetracker') ||
            currentPath.includes('/cam-study-eyetracker')
        )
            return null;
        else return <HeaderBar shrinked />;
    };

    const FooterSelector = (currentPath, isMobile) => {
        if (
            currentPath === '/' ||
            currentPath.includes('/login') ||
            currentPath.includes('/profile') ||
            currentPath.includes('/mypage') ||
            currentPath.includes('/main-draft') ||
            currentPath.includes('/dashboard') ||
            currentPath.includes('/pricing') ||
            currentPath.includes('/payment') ||
            currentPath.includes('/pay-state')
        ) {
            if (isMobile) return 'mobile footer';
            else return <Footer />;
        } else return null;
    };

    return (
        <>
            <AlertSubscribe />

            <CustomChannelIOButton />
            <Element name="main_top_start" />

            <ScrollTop>
                {/* <ErrorOS os={navigator.userAgent.toLowerCase()} /> */}
                {/* <MobileBody /> */}
                {HeaderBarSelector(history.location.pathname)}
                <MainContainer id="main">
                    <Switch>
                        <Route path={$_root} component={Main} exact />
                        <Route path={'/main-draft'} component={MainDraft} exact />

                        <Route path={$_loginDefault} component={Login} exact />
                        <Route path={'/login-candidated'} component={LoginCandidated} exact />
                        <Route path={$_loginAdmin} component={LoginAdmin} exact />
                        <RestrictRoute path="/admins" component={AdminMain} role={sessions.userType} allowedTypes={['admins']} />
                        {/* <Route path={'/admins'} component={AdminMain} /> */}
                        <Route path="/class/:num/:id" component={Class} />
                        {/* <Route path="/user-example" component={UserExample} />
                        <Route path="/player-example" component={PlayerExample} /> */}
                        <Route path="/assignments/do-it-now/:classnum/:assignmentid" component={AssignmentDoItNow} exact></Route>
                        <Route path="/video-lecture-eyetracker/:classnum" component={VideoLectureEyetracker} exact />
                        <Route path="/video-lecture-detect-lists/:classnum" component={VideoLectureEyetrackDetectionList} exact />
                        <Route path="/cam-study-eyetracker/:classnum" component={CamStudyEyetracker} exact />
                        <Route path="/mypage/:menu" component={MyPage} />
                        <Route path="/:num/dashboard" component={Dashboard} exact />
                        <Route path="/pricing" component={Price} exact />
                        <Route path="/pricing/details" component={PriceDetails} exact />
                        <Route path="/payment" component={Payment} exact />
                        <Route path="/pay-state/:state" component={PayState} exact />
                        <Route path="/profile" component={Profile} exact />
                        {navigator.userAgent.toLowerCase().includes('isnativeapp') ? (
                            <Route path="/login-mobile-app-redirect" component={LoginMobileAppRedirect} exact />
                        ) : null}
                        <Route path="/:num/calendar" component={Calendar} exact />
                        <Route path="/timertest" component={TimerTest} exact />
                        <Route path="/components" component={ComponentTest} exact />

                        <Route>
                            <Error />
                        </Route>
                    </Switch>
                </MainContainer>
                {FooterSelector(history.location.pathname, isMobile)}
            </ScrollTop>
            {history.location.pathname === '/class/draft' || history.location.pathname === '/class/share' ? <TrashButton /> : ''}
        </>
    );
}

export default withRouter(App);
