import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/essentials/HeaderBar';
import { Element } from 'react-scroll';
import { Grid, Drawer, Divider, Button } from '@material-ui/core';
import '../styles/main_page.scss';
import CardRoot from '../components/essentials/CardRoot';
import CardLists from '../components/essentials/CardLists';
import CardAddNew from '../components/essentials/CardAddNew';
import CardEntry from '../components/MainPage/CardEntry';
import CreateNewEntry from '../components/MainPage/CreateNewEntry';
import { Link } from 'react-router-dom';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import Footer from '../components/essentials/Footer';
import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AddTeacher from '../components/MainPage/AddTeacher';
import classNames from 'classnames';
import { $_classDefault } from '../configs/front_urls';

function Main({ history }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);
    const [openAddTeacher, setOpenAddTeacher] = useState(false);
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };
    const toggleAddTeacherDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenAddTeacher(open);
    };
    const [cardDatas, setCardDatas] = useState([]);

    const fetchCardData = () => {
        Axios.get(`${apiUrl}/classes/current`, { withCredentials: true })
            .then((res) => {
                console.log(res);
                setCardDatas(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        fetchCardData();
    }, []);

    const onAssignmentCardItemClick = (idx, classNumber, assignmentTitle) => () => {
        console.log(idx, classNumber);
        const conf = window.confirm('과제를 시작하시겠습니까?\n제한 시간이 있는 과제는 열림과 동시에 시작됩니다.');
        if (!conf) return;
        if (window.mobile || (window.screen.width < 1440 && window.screen.height < 900)) {
            if (window.mobile) {
                alert('시선흐름 분석 서비스는\n테스크탑 브라우저에서만\n지원하고 있습니다.');
            } else {
                alert(
                    '시선흐름 분석 서비스를 위한 최소 해상도를 지켜주세요 :(\n최소 해상도 : 1440*900\n권장 해상도 : 1920*1080 (125% 이하)',
                );
            }
        } else {
            let screenWidth = window.screen.availWidth;
            let screenHeight = window.screen.availHeight;

            // 스크린 크기는 일단 고정해 놓음!
            screenWidth = 1280;
            screenHeight = 750;

            // let centerX = window.screen.width / 2 - screenWidth / 2;
            // let centerY = window.screen.height / 2 - (screenHeight * 2) / 3;

            /* const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
        const width = window.innerWidth
            ? window.innerWidth
            : document.documentElement.clientWidth
            ? document.documentElement.clientWidth
            : window.screen.width;
        const height = window.innerHeight
            ? window.innerHeight
            : document.documentElement.clientHeight
            ? document.documentElement.clientHeight
            : window.screen.height;
        const systemZoom = width / window.screen.availWidth;
        const centerX = (width - screenWidth) / 2 / systemZoom + dualScreenLeft;
        const centerY = (height - screenHeight) / 2 / systemZoom + dualScreenTop; */

            let centerX = (window.screen.width - screenWidth) / 2;
            let centerY = (window.screen.height - screenHeight) / 4;

            const open = window.open(
                `/assignments/do-it-now/${classNumber}/${idx}`,
                'Assignments',
                `height=${screenHeight}, width=${screenWidth}, left=${centerX}, top=${centerY}, toolbar=no, scrollbars=no, resizable=no, status=no`,
                true,
            );
            // open.addEventListener('load', windowOpened);
        }
    };

    return (
        <>
            <Element name="main_top_start" />
            <HeaderBar />
            <Drawer anchor="right" open={openCreateNewDrawer} onClose={toggleDrawer(false)}>
                <CreateNewEntry history={history} handleClose={toggleDrawer(false)} />
            </Drawer>
            <Drawer anchor="right" open={openAddTeacher} onClose={toggleAddTeacherDrawer(false)}>
                <AddTeacher handleClose={toggleAddTeacherDrawer(false)} />
            </Drawer>
            <main className="main-page">
                <section className={classNames('decorator-root', sessions.userType)}></section>
                <section className="contents-root">
                    <CardLists
                        upperDeck={
                            <>
                                <div className="introduce">
                                    <h2>
                                        에듀이티 클래스 관리<br></br>솔루션에 오신것을 환영합니다.
                                    </h2>
                                </div>
                                <div className="academy-name">
                                    <h4>{sessions.userName}님의 클래스</h4>
                                </div>
                            </>
                        }
                        maxColumn={3}
                    >
                        {sessions.userType !== 'students' ? (
                            <CardRoot>
                                <CardAddNew onClick={toggleDrawer(true)}>클래스 생성</CardAddNew>
                            </CardRoot>
                        ) : null}
                        {cardDatas.map(({ idx, name, description, teacher_name, num_of_students }) => (
                            <CardRoot key={idx}>
                                <CardEntry
                                    title={name}
                                    description={description}
                                    assignmentOnProgress={false}
                                    teacherName={teacher_name}
                                    totalStudents={num_of_students}
                                    totalAssignments={0}
                                    onClick={() => {
                                        history.push(`${$_classDefault}/${idx}/draft`);
                                    }}
                                />
                            </CardRoot>
                        ))}
                    </CardLists>
                    <Divider className="main-divider" />
                    {sessions.userType === 'students' ? (
                        <CardLists>
                            <div className="below-card-container">
                                <Button size="large" variant="outlined" startIcon={<GroupAddIcon />} onClick={toggleAddTeacherDrawer(true)}>
                                    선생님 추가하기
                                </Button>
                                <button type="button" onClick={onAssignmentCardItemClick(3, 11, '시선흐름 측정이 있는 과제 샘플')}>
                                    학생용 시선흐름 있는 테스트 창 열기
                                </button>
                                <button type="button" onClick={onAssignmentCardItemClick(4, 11, '시선흐름 측정이 없는 과제 샘플')}>
                                    학생용 시선흐름 없는 테스트 창 열기
                                </button>
                            </div>
                        </CardLists>
                    ) : null}
                </section>
            </main>
            <Footer />
        </>
    );
}

export default Main;
