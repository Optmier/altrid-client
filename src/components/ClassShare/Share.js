import React, { useState } from 'react';
import CardShare from './CardShare';
import CardAddNew from '../essentials/CardAddNew';
import CardLists from '../essentials/CardLists';
import CardRoot from '../essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import TrashButton from '../essentials/TrashButton';

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
                asdfasdfasdf
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
                        <CardRoot wider cardHeight="300px">
                            <CardShare />
                        </CardRoot>
                        <CardRoot wider cardHeight="300px">
                            <CardShare />
                        </CardRoot>
                        <CardRoot wider cardHeight="300px">
                            <CardShare />
                        </CardRoot>
                    </CardLists>
                </div>
                <div className="class-trash">
                    <TrashButton />
                </div>
            </div>
        </>
    );
}

export default Share;
