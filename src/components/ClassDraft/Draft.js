import React, { useState } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import CardDraft from './CardDraft';
import CardAddNew from '../essentials/CardAddNew';
import CardLists from '../essentials/CardLists';
import CardRoot from '../essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import ClassDrawer from '../essentials/ClassDrawer';
import ClassHeaderBox from '../essentials/ClassHeaderBox';
import assignmentDummy from '../../datas/assignmentDummy.json';
import { apiUrl } from '../../configs/configs';
import { useSelector, useDispatch } from 'react-redux';
import { getDraft } from '../../redux_modules/assignmentDraft';

function Draft() {
    /** redux state */
    const draftArr = useSelector((state) => state.assignmentDraft);
    const dispatch = useDispatch();

    const onGetDraft = useCallback(() => dispatch(getDraft()), [dispatch]);

    useEffect(() => {
        onGetDraft();
        return () => {};
    }, []);

    console.log('state : ', draftArr);

    /** draft.js 자체 메소드 */
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);
    //const [draftArr, setDraftArr] = useState([]);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };

    // useEffect(() => {
    //     Axios.get(`${apiUrl}/assignment-draft`, { withCredentials: true })
    //         .then((res) => {
    //             setDraftArr(res.data);
    //         })
    //         .catch((err) => {
    //             console.error(err.response.data.code);
    //         });
    //     return () => {};
    // }, []);
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
                                <b>최준영</b>
                                선생님이 만든 과제는 총 <b>5개</b>입니다.
                            </div>
                        }
                    >
                        <CardRoot cardHeight="281px">
                            <CardAddNew onClick={toggleDrawer(true)}>클래스 생성</CardAddNew>
                        </CardRoot>

                        {draftArr.map((data, idx) => (
                            <CardRoot key={idx} cardHeight="281px">
                                <CardDraft testNum={data} cardData={data} />
                            </CardRoot>
                        ))}
                    </CardLists>
                </div>
            </div>
        </>
    );
}

export default Draft;
