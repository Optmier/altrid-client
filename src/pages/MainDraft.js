import React, { useState, useEffect } from 'react';
import CardDraft from '../components/ClassDraft/CardDraft';
import CardAddNew from '../components/essentials/CardAddNew';
import CardLists from '../components/essentials/CardLists';
import CardRoot from '../components/essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import ClassDrawer from '../components/essentials/ClassDrawer';
// import ClassHeaderBox from '../essentials/ClassHeaderBox';
import { withRouter } from 'react-router-dom';
import TypeBanner from '../components/essentials/TypeBanner';
import ClassWrapper from '../components/essentials/ClassWrapper';
import HeaderBar from '../components/essentials/HeaderBar';
import '../styles/class.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getDrafts } from '../redux_modules/assignmentDraft';
import { getClasses, getClassesError } from '../redux_modules/classes';
import BackdropComponent2 from '../components/essentials/BackdropComponent2';
import Axios from 'axios';
import { apiUrl } from '../configs/configs';

function MainDraft({ match }) {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) =>
        state.assignmentDraft.draftDatas.data ? state.assignmentDraft.draftDatas : { loading: true, data: [], error: null },
    );
    const sessions = useSelector((state) => state.RdxSessions);

    const [stMatch, setStMatch] = useState({ id: null, path: null });

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName) return;

        setStMatch({ ...stMatch, id: match.params.id, path: match.path });

        if (sessions.userType === 'teachers') {
            dispatch(getDrafts());

            Axios.get(`${apiUrl}/classes/current`, { withCredentials: true })
                .then((res) => {
                    dispatch(getClasses(res.data));
                })
                .catch((err) => {
                    dispatch(getClassesError(err));
                });
        }
        return () => {};
    }, [sessions.authId, sessions.academyName]);

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
            <BackdropComponent2 open={loading && !data.length} />

            <div className="class-page-root">
                <Drawer anchor="right" open={openCreateNewDrawer}>
                    <ClassDrawer handleClose={toggleDrawer(false)} ver="draft" />
                </Drawer>

                <ClassWrapper>{/* <ClassHeaderBox />
                <TypeBanner situation="info" /> */}</ClassWrapper>

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
            </div>
        </>
    );
}

export default withRouter(React.memo(MainDraft));
