import React, { useState, useEffect } from 'react';
import CardDraft from './CardDraft';
import CardAddNew from '../essentials/CardAddNew';
import CardLists from '../essentials/CardLists';
import CardRoot from '../essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import ClassDrawer from '../essentials/ClassDrawer';
import ClassHeaderBox from '../essentials/ClassHeaderBox';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

function Draft() {
    /** redux state */
    const { data, loading, error } = useSelector((state) => state.assignmentDraft.draftDatas) || {
        loading: false,
        data: null,
        error: null,
    }; // 아예 데이터가 존재하지 않을 때가 있으므로, 비구조화 할당이 오류나지 않도록
    const sessions = useSelector((state) => state.RdxSessions);

    let cardDatas = {};

    // cardDatas 변수에 불러온 값 저장하기
    data ? (cardDatas = data) : (cardDatas = {});

    window.data = data;

    /** draft.js 자체 메소드 */
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };

    if (loading && !data) return <div>로딩 중....</div>; // 로딩중이고 데이터 없을때만
    if (error) return <div>에러 발생!</div>;
    if (!data) return null;

    return (
        <>
            <Drawer anchor="right" open={openCreateNewDrawer} onClose={toggleDrawer(false)}>
                <ClassDrawer handleClose={toggleDrawer(false)} ver="draft" />
            </Drawer>

            <ClassHeaderBox />

            <div className="class-section-root">
                <div className="class-draft-card">
                    <CardLists
                        upperDeck={
                            <div className="class-title">
                                <b>{sessions.userName}</b> 선생님께서 만드신 과제는 총 <b>{cardDatas.length}개</b> 입니다.
                            </div>
                        }
                    >
                        <CardRoot cardHeight="281px">
                            <CardAddNew onClick={toggleDrawer(true)}>과제 생성</CardAddNew>
                        </CardRoot>

                        {Object.keys(cardDatas).map((i, idx) => (
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
