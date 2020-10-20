import React, { useState } from 'react';
import CardShare from './CardShare';
import CardLists from '../essentials/CardLists';
import CardRoot from '../essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import shareDummy from '../../datas/shareDummy.json';
import ClassDrawer from '../essentials/ClassDrawer';

//console.log(shareDummy['1']['progress']);
// Object.keys(shareDummy).map((key) => {
//     console.log(shareDummy[key]['progress']);
// });
function Share() {
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

            <div className="class-draft-root">
                <div className="class-draft-card">
                    <CardLists
                        upperDeck={
                            <div className="class-title">
                                <b>총 3개</b>의 과제중 <b>2개</b>의 과제가 <span>진행중</span>입니다.
                            </div>
                        }
                    >
                        {Object.keys(shareDummy).map((key) => (
                            <CardRoot key={key} wider cardHeight="300px">
                                <CardShare dummy={shareDummy[key]} />
                            </CardRoot>
                        ))}
                    </CardLists>
                </div>
            </div>
        </>
    );
}

export default Share;
