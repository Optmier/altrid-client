import React, { useState } from 'react';
import '../../styles/class_draft.scss';
import ClassWrapper from '../essentials/ClassWrapper';
import ClassTitle from '../essentials/ClassTitle';
import DraftCardView from './DraftCardView';

import CardAddNew from '../essentials/CardAddNew';
import CardLists from '../essentials/CardLists';
import CardRoot from '../essentials/CardRoot';
import { Drawer } from '@material-ui/core';

function Draft() {
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
            <ClassWrapper>
                <div className="class-draft-root">
                    <ClassTitle>
                        <b>최준영</b>
                        선생님이 만든 과제는 총 <b>5개</b>입니다.
                    </ClassTitle>

                    <div className="class-cardView-wrapper">
                        {/* <DraftCardView />
                        <DraftCardView />
                        <DraftCardView />
                        <DraftCardView /> */}
                    </div>
                </div>
            </ClassWrapper>

            <CardLists
                upperDeck={
                    <ClassTitle>
                        <b>최준영</b>
                        선생님이 만든 과제는 총 <b>5개</b>입니다.
                    </ClassTitle>
                }
            >
                <CardRoot>
                    <CardAddNew onClick={toggleDrawer(true)}>클래스 생성</CardAddNew>
                </CardRoot>
                <CardRoot>
                    <CardAddNew onClick={toggleDrawer(true)}>클래스 생성</CardAddNew>
                </CardRoot>
                <CardRoot>
                    <CardAddNew onClick={toggleDrawer(true)}>클래스 생성</CardAddNew>
                </CardRoot>
                <CardRoot>
                    <CardAddNew onClick={toggleDrawer(true)}>클래스 생성</CardAddNew>
                </CardRoot>
            </CardLists>
        </>
    );
}

export default Draft;
