import React, { useState, useEffect } from 'react';
import HeaderBar from '../components/essentials/HeaderBar';
import { Element } from 'react-scroll';
import { Grid, Drawer, Divider } from '@material-ui/core';
import '../styles/main_page.scss';
import CardRoot from '../components/essentials/CardRoot';
import CardLists from '../components/essentials/CardLists';
import CardAddNew from '../components/essentials/CardAddNew';
import CardEntry from '../components/MainPage/CardEntry';
import CreateNewEntry from '../components/MainPage/CreateNewEntry';
import { Link } from 'react-router-dom';

const testDatas = [
    {
        id: 0,
        title: 'Class 01011101101110100101011',
        description:
            '에듀이티학원 토플 700점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반',
        assignmentOnProgress: true,
        teacherName: '최세인',
        totalStudents: 30000000000000,
        totalAssignments: 3,
    },
    {
        id: 1,
        title: 'Class 2',
        description:
            '에듀이티학원 토플 900점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반',
        assignmentOnProgress: true,
        teacherName: '최세인2',
        totalStudents: 25,
        totalAssignments: 5,
    },
    {
        id: 2,
        title: 'Class 3',
        description:
            '에듀이티학원 토플 800점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반 에듀이티학원 토플 700점 이상을 위한 집중관리 반',
        assignmentOnProgress: false,
        teacherName: '최세인3',
        totalStudents: 17,
        totalAssignments: 4,
    },
];

function Main() {
    const [academyName, setAcademyName] = useState('에듀이티학원');
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };

    return (
        <>
            <Element name="main_top_start" />
            <HeaderBar />
            <Drawer anchor="right" open={openCreateNewDrawer} onClose={toggleDrawer(false)}>
                <CreateNewEntry handleClose={toggleDrawer(false)} />
            </Drawer>
            <main className="main-page">
                <section className="decorator-root"></section>
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
                                    <h4>{academyName} 클래스</h4>
                                </div>
                            </>
                        }
                        maxColumn={3}
                    >
                        <CardRoot>
                            <CardAddNew onClick={toggleDrawer(true)}>클래스 생성</CardAddNew>
                        </CardRoot>
                        {testDatas.map(({ id, title, description, assignmentOnProgress, teacherName, totalStudents, totalAssignments }) => (
                            <CardRoot key={id}>
                                <Link to="/class/draft">
                                    <CardEntry
                                        title={title}
                                        description={description}
                                        assignmentOnProgress={assignmentOnProgress}
                                        teacherName={teacherName}
                                        totalStudents={totalStudents}
                                        totalAssignments={totalAssignments}
                                        onClick={() => {
                                            console.log(id);
                                        }}
                                    />
                                </Link>
                            </CardRoot>
                        ))}

                        <CardRoot></CardRoot>
                    </CardLists>

                    <Divider className="main-divider" />
                </section>
            </main>
        </>
    );
}

export default Main;
