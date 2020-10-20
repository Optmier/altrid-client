import React, { useState } from 'react';
import CardDraft from './CardDraft';
import CardAddNew from '../essentials/CardAddNew';
import CardLists from '../essentials/CardLists';
import CardRoot from '../essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import ClassDrawer from '../essentials/ClassDrawer';

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
                <ClassDrawer />
            </Drawer>

            <div className="class-draft-root">
                <div className="class-draft-card">
                    <CardLists
                        upperDeck={
                            <div className="class-title">
                                <b>최준영</b>
                                선생님이 만든 과제는 총 <b>5개</b>입니다.
                            </div>
                        }
                    >
                        <CardRoot cardHeight="281px">
                            <CardAddNew onClick={toggleDrawer(true)}>클래스 생성</CardAddNew>
                        </CardRoot>
                        <CardRoot cardHeight="281px">
                            <CardDraft />
                        </CardRoot>
                        <CardRoot cardHeight="281px">
                            <CardDraft />
                        </CardRoot>
                        <CardRoot cardHeight="281px">
                            <CardDraft />
                        </CardRoot>
                    </CardLists>
                </div>
            </div>
        </>
    );
}

export default Draft;
