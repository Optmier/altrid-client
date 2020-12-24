import React, { useCallback, useEffect } from 'react';
import Axios from 'axios';
import './styles/common.scss';
import { Element } from 'react-scroll';
import Class from './pages/Class';
import Main from './pages/Main';
import { Switch, Route, withRouter } from 'react-router-dom';
import ScrollTop from './components/essentials/ScrollTop';
import TrashButton from './components/essentials/TrashButton';
import Login from './pages/Login';
import Error from './pages/Error';

import LoginAdmin from './pages/LoginAdmin';
import { apiUrl } from './configs/configs';
import { useDispatch, useSelector } from 'react-redux';
import { saveSession, deleteSession, updateSession } from './redux_modules/sessions';
import { getServerDate } from './redux_modules/serverdate';
import { $_loginAdmin, $_loginDefault, $_loginStudent, $_loginTeacher, $_root } from './configs/front_urls';
import AdminMain from './pages/AdminMain';
import AssignmentDoItNow from './pages/AssignmentDoItNow';
import RestrictRoute from './components/essentials/RestrictRoute';
import RefreshToken from './components/essentials/Authentication';
import channelIOAccessKey from './components/ChannelIO/accessKeys';
import ChannelService from './components/ChannelIO/ChannelService';
import generateHash from './components/ChannelIO/generateHash';
import CustomChannelIOButton from './components/ChannelIO/CustomChannelIOButton';
import LoginCandidated from './pages/LoginCandidated';
import ErrorOS from './components/essentials/ErrorOS';
import GooroomeeService from './components/Gooroomee/GooroomeeService';

window.axios = Axios;
window.lastUrl = '/';
window.tokenRefresher = null;
const loginUrls = [$_loginDefault, $_loginStudent, $_loginTeacher, $_loginAdmin, '/login-candidated'];
// const excludesForAdminUrls = [];
// const excludesForTeacherUrls = ['/admins', '/admins/members', '/admins/contents-requests'];
// const excludesForStudentUrls = ['/admins', '/admins/members', '/admins/contents-requests'];

window.axios = Axios;
function App({ history }) {
    const dispatch = useDispatch();
    const saveSessions = useCallback(
        (authId, userName, userType, academyCode, academyName, issuer, iat, exp) =>
            dispatch(saveSession(authId, userName, userType, academyCode, academyName, issuer, iat, exp)),
        [dispatch],
    );
    const updateSessions = useCallback((updateStates) => dispatch(updateSession(updateStates)), [dispatch]);
    const deleteSessions = useCallback(() => dispatch(deleteSession()), [dispatch]);
    const sessions = useSelector((state) => state.RdxSessions);

    if (!loginUrls.includes(history.location.pathname)) window.lastUrl = history.location.pathname;

    window.logout = () => {
        Axios.delete(`${apiUrl}/auth`, { withCredentials: true })
            .then((res) => {
                deleteSessions();
                // document.body.innerHTML = '로그아웃 되었습니다.';
                // alert('성공적으로 로그아웃 되었습니다!');
                document.location.replace($_loginDefault);
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
                const { authId, academyCode, exp, iat, iss, userName, userType } = res1.data;
                saveSessions(authId, userName, userType, academyCode, null, iss, iat, exp);

                Axios.get(`${apiUrl}/academies/current/name`, { withCredentials: true })
                    .then((res2) => {
                        const academyName = res2.data.name;
                        updateSessions({ academyName: academyName });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                // console.log(err.response);
                if (err.response.status === 401) {
                    if (!loginUrls.includes(history.location.pathname)) {
                        // alert('로그인이 필요합니다.');
                        history.replace($_loginDefault);
                    }
                } else if (err.response.data.code === 'TokenExpiredError') {
                    alert('세션이 만료되어 다시 로그인 해야합니다.');
                    window.logout();
                }
            });
    }, [history.location]);

    useEffect(() => {
        GooroomeeService.test();
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
    }, [sessions]);

    return (
        <>
            <CustomChannelIOButton />
            <Element name="main_top_start" />

            <ScrollTop>
                <ErrorOS os={navigator.userAgent.toLowerCase()} />
                <main>
                    <Switch>
                        <Route path={$_root} component={Main} exact />
                        <Route path={$_loginDefault} component={Login} exact />
                        <Route path={'/login-candidated'} component={LoginCandidated} exact />
                        <Route path={$_loginAdmin} component={LoginAdmin} exact />
                        <RestrictRoute path="/admins" component={AdminMain} role={sessions.userType} allowedTypes={['admins']} />
                        {/* <Route path={'/admins'} component={AdminMain} /> */}
                        <Route path="/class/:num/:id" component={Class} />
                        {/* <Route path="/user-example" component={UserExample} />
                        <Route path="/player-example" component={PlayerExample} /> */}
                        <Route path="/assignments/do-it-now/:classnum/:assignmentid" component={AssignmentDoItNow} exact></Route>
                        <Route>
                            <Error />
                        </Route>
                    </Switch>
                </main>
            </ScrollTop>
            {history.location.pathname === '/class/draft' || history.location.pathname === '/class/share' ? <TrashButton /> : ''}
        </>
    );
}

export default withRouter(App);
