import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/essentials/HeaderBar';
import { Element } from 'react-scroll';
import { Drawer, Divider, Button } from '@material-ui/core';
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
import { useSelector, useDispatch } from 'react-redux';
import AddClass from '../components/MainPage/AddClass';
import classNames from 'classnames';
import { $_classDefault } from '../configs/front_urls';
import moment from 'moment';
import BackdropComponent from '../components/essentials/BackdropComponent';
import ClassWrapper from '../components/essentials/ClassWrapper';
import { IoIosArrowForward } from 'react-icons/io';
import isMobile from '../controllers/isMobile';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        '@media (min-width: 0) and (max-width: 662px)': {
            width: '100%',
        },
    },
}));

function Main({ history }) {
    const classes = useStyles();

    const sessions = useSelector((state) => state.RdxSessions);

    const [backdropOpen, setBackdropOpen] = useState(false);
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);
    const [openAddTeacher, setOpenAddTeacher] = useState(false);
    const [cardDatas, setCardDatas] = useState([]);

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
    const fetchCardData = () => {
        Axios.get(`${apiUrl}/classes/current`, { withCredentials: true })
            .then((res) => {
                setCardDatas(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setBackdropOpen(false);
            });
    };

    useEffect(() => {
        setBackdropOpen(true);
        fetchCardData();
    }, []);

    return (
        <>
            <BackdropComponent open={backdropOpen} blind="#f7f9f8" />
            <Element name="main_top_start" />
            <HeaderBar />
            <Drawer
                anchor="right"
                open={openCreateNewDrawer}
                onClose={toggleDrawer(false)}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <CreateNewEntry history={history} handleClose={toggleDrawer(false)} />
            </Drawer>

            <Drawer
                anchor="right"
                open={openAddTeacher}
                onClose={toggleAddTeacherDrawer(false)}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <AddClass handleClose={toggleAddTeacherDrawer(false)} />
            </Drawer>
            <main className="main-page">
                <section className={classNames('decorator-root', sessions.userType)}></section>
                <section className="contents-root">
                    <CardLists
                        upperDeck={
                            <>
                                <div className="introduce">
                                    <h2>
                                        ALTRID 클래스 관리<br></br>솔루션에 오신것을 환영합니다.
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
                                <CardAddNew type={sessions.userType} onClick={toggleDrawer(true)}>
                                    클래스 생성
                                </CardAddNew>
                            </CardRoot>
                        ) : (
                            <CardRoot>
                                <CardAddNew type={sessions.userType} onClick={toggleAddTeacherDrawer(true)}>
                                    클래스 입장
                                </CardAddNew>
                            </CardRoot>
                        )}
                        {cardDatas.map(
                            ({ idx, name, class_count, max_due_date, description, class_day, teacher_name, num_of_students }) => (
                                <CardRoot key={idx}>
                                    <CardEntry
                                        title={name}
                                        description={description}
                                        class_day={class_day}
                                        assignmentOnProgress={
                                            moment(max_due_date).format('YYMMDDHHmmss') > moment().format('YYMMDDHHmmss')
                                                ? max_due_date !== null
                                                    ? true
                                                    : false
                                                : false
                                        }
                                        teacherName={teacher_name}
                                        totalStudents={num_of_students}
                                        totalAssignment={class_count}
                                        onClick={() => {
                                            history.push(`${$_classDefault}/${idx}/share`);
                                        }}
                                    />
                                </CardRoot>
                            ),
                        )}
                    </CardLists>
                    {sessions.userType === 'students' && (!cardDatas || !cardDatas.length) ? null : <Divider className="main-divider" />}
                </section>
                {sessions.userType === 'students' ? (
                    <section>
                        <ClassWrapper col="none" type="main_page">
                            <div className="contents-bottom-fullWidth">
                                <div className="bottom-fullWidth-top">서비스 관련 궁금하신 점이 있으신가요?</div>
                                <div className="bottom-fullWidth-central">
                                    1대 1 바로 상담을 원하는 경우에는 우하단 물음표 버튼을 클릭해주세요.
                                </div>
                                <a
                                    className="bottom-fullWidth-footer"
                                    href="https://www.notion.so/ALTRID-8e6f5fe90beb42f0a10cb9b11a84f22a"
                                    alt="more_service"
                                    target="_blank"
                                >
                                    서비스 사용 가이드 <IoIosArrowForward style={{ marginRight: '5px' }} />
                                </a>
                            </div>
                        </ClassWrapper>
                    </section>
                ) : (
                    <section>
                        <ClassWrapper col="none" type="main_page">
                            <div className="contents-bottom-root">
                                <div className="bottom-left">
                                    <div className="bottom-left-top">알트리드는 문제 풀이 중 모든 것을 관찰하고 기록합니다.</div>
                                    <div className="bottom-left-central">
                                        시선흐름 추적 기술과 문제 패턴 데이터 수집을 통해 맞춤형 리포트를 제공합니다.
                                    </div>
                                    <a
                                        className="bottom-left-footer"
                                        href="https://www.notion.so/optmier/a4daf8676b2b4460b75613f25249abf3"
                                        alt="more_eyetrack"
                                        target="_blank"
                                    >
                                        자세히 알아보기 <IoIosArrowForward style={{ marginRight: '5px' }} />
                                    </a>
                                </div>

                                {
                                    // 데모클래스 생성되면 추가할 것 !! (20.03.03)
                                    /* <div className="bottom-right" onClick={() => alert('준비중입니다 !')}>
                                    <h4>
                                        데모 클래스 <IoIosArrowForward style={{ marginLeft: '10px' }} />
                                    </h4>
                                    <h5>클래스에서 데모버전의 과제를 확인해보세요.</h5>
                                </div> */
                                }
                            </div>
                        </ClassWrapper>
                    </section>
                )}
            </main>

            {isMobile ? null : <Footer />}
        </>
    );
}

export default Main;
