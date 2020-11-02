import React, { useEffect } from 'react';
import Axios from 'axios';
import './styles/common.scss';
import { Element } from 'react-scroll';
import Class from './pages/Class';
import Main from './pages/Main';
import { Route, withRouter } from 'react-router-dom';
import ScrollTop from './components/essentials/ScrollTop';
import Footer from './components/essentials/Footer';
import TofelEditorTemp from './pages/TofelEditorTemp';
import UserExample from './components/TOFELRenderer/UserExample';
import EyetrackingPlayer from './components/TOFELRenderer/EyetrackingPlayer';
import PlayerExample from './components/TOFELRenderer/PlayerExample';
import Login from './pages/Login';
import LoginAdmin from './pages/LoginAdmin';
import { apiUrl } from './configs/configs';

window.lastUrl = '/';
const loginUrls = ['/login', '/login/admin'];
const excludesForAdminUrls = [];
const excludesForTeacherUrls = [];
const excludesForStudentUrls = [];

window.logout = () => {
    Axios.delete(`${apiUrl}/auth`, { withCredentials: true })
        .then((res) => {
            alert('성공적으로 로그아웃 되었습니다!');
            document.location.replace('/login');
        })
        .catch((err) => {
            console.error(err);
        });
};

function App({ history }) {
    if (!loginUrls.includes(history.location.pathname)) window.lastUrl = history.location.pathname;

    useEffect(() => {
        Axios.get(apiUrl + '/auth', { withCredentials: true })
            .then((res) => {
                if (loginUrls.includes(history.location.pathname)) history.replace(window.lastUrl);
                switch (res.data.usertype) {
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
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    if (!loginUrls.includes(history.location.pathname)) {
                        alert('로그인이 필요합니다.');
                        history.replace('/login');
                    }
                }
                console.error(err);
            });
    }, [history]);
    return (
        <>
            <Element name="main_top_start" />
            <ScrollTop>
                <main>
                    <Route path="/" component={Main} exact />
                    <Route path="/class/:id" component={Class} />
                    <Route path="/temp" component={TofelEditorTemp} />
                    <Route path="/user-example" component={UserExample} />
                    <Route path="/player-example" component={PlayerExample} />
                    <Route path="/login" component={Login} exact />
                    <Route path="/login/admin" component={LoginAdmin} exact />
                </main>
            </ScrollTop>
        </>
    );
}

export default withRouter(App);
