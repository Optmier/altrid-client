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
import styled from 'styled-components';
import { IoIosArrowForward } from 'react-icons/io';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import Footer from '../components/essentials/Footer';
import Error from './Error';

const InfoBanner = styled.a`
    width: 100%;
    margin: 95px 0;

    & .banner-root {
        box-sizing: border-box;
        width: 100%;
        padding: 2rem 1.5rem;
        border-radius: 11px;
        border: 1px solid rgba(0, 0, 0, 0.12);

        & .banner-top {
            display: flex;
            align-items: center;
            width: 85%;
            color: black;
            font-size: 1.3rem;
            font-weight: 600;
            line-height: 1.4;

            & svg {
                margin-right: 1rem;
            }
        }
        & .banner-central {
            width: 85%;
            margin-top: 0.5rem;
            margin-left: 36px;
            color: #969393;
            font-size: 0.95rem;
            font-weight: 400;
            line-height: 1.4;
        }
        & .banner-footer {
            margin-top: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            cursor: pointer;
            text-align: right;
            color: black;
            font-size: 0.8rem;
            font-weight: 400;
            line-height: 1.3;
        }
        & .banner-footer:hover {
            margin-right: -5px;
            transition: all 0.4s;
        }
    }
`;

const StyleHr = styled.div`
    width: 100%;
    height: 1px;
    flex-shrink: 0;
    background-color: rgba(0, 0, 0, 0.12);
`;

function MainDraft({ match }) {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) =>
        state.assignmentDraft.draftDatas.data ? state.assignmentDraft.draftDatas : { loading: true, data: [], error: null },
    );
    const sessions = useSelector((state) => state.RdxSessions);

    const [stMatch, setStMatch] = useState({ id: null, path: null });
    const [errorState, setErrorState] = useState(false);

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName) return;

        if (sessions.userType === 'students') {
            setErrorState(true);
        }
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

    if (errorState) return <Error />;
    return (
        <>
            <HeaderBar />
            <BackdropComponent2 open={loading && !data.length} />
            <Drawer anchor="right" open={openCreateNewDrawer}>
                <ClassDrawer handleClose={toggleDrawer(false)} ver="draft" />
            </Drawer>

            <div className="draft-header"></div>

            <div className="class-page-root" style={{ minHeight: '0' }}>
                <div style={{ paddingTop: '80px' }} className="class-section-root">
                    <div className="class-draft-header">
                        <h2>
                            빠른 과제 생성을 통해<br></br>학습 성장을 경험해보세요.
                        </h2>
                    </div>
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
            <ClassWrapper col="none" type="main_page">
                <StyleHr className="draft-footer"></StyleHr>
                <InfoBanner href="https://www.notion.so/07bd3c8f53ac4e449242cda7eccdcb4e" alt="more_analysis" target="_blank">
                    <div className="banner-root">
                        <div className="banner-top">
                            <BsExclamationTriangleFill />
                            과제 최소 조건을 맞추면 유형별 분석이 가능합니다!
                        </div>
                        <div className="banner-central">
                            유형별 분석이 가능한 과제를 생성시, 더 많은 리포트 정보를 받아보실 수 있습니다.
                        </div>
                        <div className="banner-footer">
                            자세히 알아보기 <IoIosArrowForward style={{ marginRight: '5px' }} />
                        </div>
                    </div>
                </InfoBanner>
            </ClassWrapper>
            <Footer />
        </>
    );
}

export default withRouter(React.memo(MainDraft));
