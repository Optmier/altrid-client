import React, { useState, useEffect } from 'react';
import CardShare from './CardShare';
import CardLists from '../essentials/CardLists';
import CardRoot from '../essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import ClassDrawer from '../essentials/ClassDrawer';
import ClassHeaderBox from '../essentials/ClassHeaderBox';
import { useSelector, useDispatch } from 'react-redux';
import { getActivedes } from '../../redux_modules/assignmentActived';

function Share({ match }) {
    const { num } = match.params;

    /** redux state */
    const { data, loading, error } = useSelector((state) => state.assignmentActived.activedDatas) || {
        loading: false,
        data: null,
        error: null,
    }; // 아예 데이터가 존재하지 않을 때가 있으므로, 비구조화 할당이 오류나지 않도록
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getActivedes(num));
    }, [dispatch]);
    console.log(data);

    let shareJson = {};

    data ? (shareJson = data) : (shareJson = {});

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
                <ClassDrawer />
            </Drawer>

            <ClassHeaderBox />

            <div className="class-section-root">
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
