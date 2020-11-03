import React, { useState } from 'react';
import CardShare from './CardShare';
import CardLists from '../essentials/CardLists';
import CardRoot from '../essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import testDummy from '../../datas/testDummy.json';
import ClassDrawer from '../essentials/ClassDrawer';
import ClassHeaderBox from '../essentials/ClassHeaderBox';

function Share() {
    let shareJson = {};

    Object.keys(testDummy)
        .filter((i) => testDummy[i]['progress'])
        .map((i) => (shareJson[i] = testDummy[i]));

    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };

    return (
        <>
            <Drawer anchor="right" open={openCreateNewDrawer} onClose={toggleDrawer(false)}>
                <ClassDrawer />
            </Drawer>

            <ClassHeaderBox />

            <div className="class-draft-root">
                <div className="class-draft-card">
                    <CardLists
                        upperDeck={
                            <div className="class-title">
                                <b>총 3개</b>의 과제중 <b>2개</b>의 과제가 <span>진행중</span>입니다.
                            </div>
                        }
                    >
                        {Object.keys(shareJson).map((key) => (
                            <CardRoot key={key} wider cardHeight="300px">
                                <CardShare testNum={key} cardData={shareJson[key]} />
                            </CardRoot>
                        ))}
                    </CardLists>
                </div>
            </div>
        </>
    );
}

export default Share;
