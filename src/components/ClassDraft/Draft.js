import React, { useState } from 'react';
import CardDraft from './CardDraft';
import CardAddNew from '../essentials/CardAddNew';
import CardLists from '../essentials/CardLists';
import CardRoot from '../essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import ClassDrawer from '../essentials/ClassDrawer';
// import ClassHeaderBox from '../essentials/ClassHeaderBox';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TypeBanner from '../essentials/TypeBanner';
import ClassWrapper from '../essentials/ClassWrapper';
import HeaderBar from '../essentials/HeaderBar';

function Draft() {
    const { data, loading, error } = useSelector((state) => state.assignmentDraft.draftDatas) || {
        loading: false,
        data: null,
        error: null,
    };
    const sessions = useSelector((state) => state.RdxSessions);

    /** draft.js 자체 메소드 */
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };

    return (
        <>
            <HeaderBar />

            <Drawer anchor="right" open={openCreateNewDrawer}>
                <ClassDrawer handleClose={toggleDrawer(false)} ver="draft" />
            </Drawer>

            {/* <ClassWrapper>
                 <ClassHeaderBox /> 
                <TypeBanner situation="info" />
            </ClassWrapper> */}
            <div className="draft-header"></div>
            <div style={{ paddingTop: '95px' }} className="class-section-root">
                <div className="class-draft-card">
                    <CardLists
                        upperDeck={
                            <div style={{ color: 'white', fontSize: '20px' }} className="class-title">
                                <b>{sessions.userName}</b> 선생님께서 만드신 과제는 총 <b>{data.length}개</b> 입니다.
                            </div>
                        }
                    >
                        <CardRoot cardHeight="281px">
                            <CardAddNew onClick={toggleDrawer(true)}>과제 생성</CardAddNew>
                        </CardRoot>

                        {Object.keys(data).map((i, idx) => (
                            <CardRoot key={idx} cardHeight="281px">
                                <CardDraft testNum={data[i]['idx']} cardData={data[i]} />
                            </CardRoot>
                        ))}
                    </CardLists>
                </div>
            </div>
        </>
    );
}

export default React.memo(withRouter(Draft));
