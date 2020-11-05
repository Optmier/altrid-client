import React, { useCallback, useEffect } from 'react';
import Axios from 'axios';
import './styles/common.scss';
import { Element } from 'react-scroll';
import Class from './pages/Class';
import Main from './pages/Main';
import { Route, withRouter } from 'react-router-dom';
import ScrollTop from './components/essentials/ScrollTop';
import Footer from './components/essentials/Footer';
import TrashButton from './components/essentials/TrashButton';
import TofelEditorTemp from './pages/TofelEditorTemp';
import UserExample from './components/TOFELRenderer/UserExample';
import EyetrackingPlayer from './components/TOFELRenderer/EyetrackingPlayer';
import PlayerExample from './components/TOFELRenderer/PlayerExample';
import Login from './pages/Login';
import LoginAdmin from './pages/LoginAdmin';
import { apiUrl } from './configs/configs';
import { useDispatch } from 'react-redux';
import { saveSession, deleteSession, updateSession } from './redux_modules/sessions';
import { $_loginAdmin, $_loginDefault, $_loginStudent, $_loginTeacher, $_root } from './configs/front_urls';

window.lastUrl = '/';
const loginUrls = [$_loginDefault, $_loginStudent, $_loginTeacher, $_loginAdmin];
const excludesForAdminUrls = [];
const excludesForTeacherUrls = [];
const excludesForStudentUrls = [];

function App({ history }) {
    const dispatch = useDispatch();
    const saveSessions = useCallback(
        (userName, userType, academyCode, academyName, issuer, iat, exp) =>
            dispatch(saveSession(userName, userType, academyCode, academyName, issuer, iat, exp)),
        [dispatch],
    );
    const updateSessions = useCallback((updateStates) => dispatch(updateSession(updateStates)), [dispatch]);
    const deleteSessions = useCallback(() => dispatch(deleteSession()), [dispatch]);

    if (!loginUrls.includes(history.location.pathname)) window.lastUrl = history.location.pathname;

    window.logout = () => {
        Axios.delete(`${apiUrl}/auth`, { withCredentials: true })
            .then((res) => {
                deleteSessions();
                document.body.innerHTML = '로그아웃 되었습니다.';
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
                switch (res1.data.usertype) {
                    case 'admins':
                        if (excludesForAdminUrls.includes(history.location.pathname)) {
                            history.goBack();
                            alert('권한이 없는 사용자 입니다.');
                        }
                        break;
                    case 'teachers':
                        if (excludesForTeacherUrls.includes(history.location.pathname)) {
                            history.goBack();
                            alert('권한이 없는 사용자 입니다.');
                        }
                        break;
                    case 'students':
                        if (excludesForStudentUrls.includes(history.location.pathname)) {
                            history.goBack();
                            alert('권한이 없는 사용자 입니다.');
                        }
                        break;
                }
                const { academyCode, exp, iat, iss, username, usertype } = res1.data;
                saveSessions(username, usertype, academyCode, null, iss, iat, exp);
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
                console.log(err);
                if (err.response.status === 401) {
                    if (!loginUrls.includes(history.location.pathname)) {
                        alert('로그인이 필요합니다.');
                        history.replace($_loginDefault);
                    }
                }
                console.error(err);
            });
    }, [history.location]);
    return (
        <>
            <Element name="main_top_start" />
            <ScrollTop>
                <main>
                    <Route path={$_root} component={Main} exact />
                    <Route path={$_loginDefault} component={Login} exact />
                    <Route path={$_loginAdmin} component={LoginAdmin} exact />
                    <Route path="/class/:num/:id" component={Class} />
                    <Route path="/temp" component={TofelEditorTemp} />
                    <Route path="/user-example" component={UserExample} />
                    <Route path="/player-example" component={PlayerExample} />
                </main>
            </ScrollTop>
            {history.location.pathname === '/' ? (
                <Footer />
            ) : history.location.pathname === '/class/draft' || history.location.pathname === '/class/share' ? (
                <TrashButton />
            ) : (
                ''
            )}
        </>
    );
}

export default withRouter(App);
