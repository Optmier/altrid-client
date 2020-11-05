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
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import Footer from '../components/essentials/Footer';
import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AddTeacher from '../components/MainPage/AddTeacher';
import classNames from 'classnames';

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
                                        history.push(`/class/${idx}`);
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
