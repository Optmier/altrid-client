import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Groupbox from '../../_tempComponents/Groupbox';
import HeaderMenu from '../../_tempComponents/HeaderMenu';
import ClassWrapper from '../essentials/ClassWrapper';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CamstudyListItem from './components/CamstudyListItem';
import CreateAndEditCamstudy from './components/CreateAndEditCamstudy';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';

const CamstudyMainRoot = styled.div``;
const HeaderContainer = styled.div`
    display: flex;
    width: 100%;
`;
const Contents = styled.div`
    margin-top: 54px;
    width: 100%;
`;

const StyledButton = styled.button`
    &.video-lecture {
        background-color: #707070;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        font-size: 0.9rem;
        font-weight: 500;
        color: white;
        padding: 12px 0;
        border-radius: 11px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.25);
        width: 96px;

        &.main {
            background-color: #3f1990;
            width: 96px;
        }
        &.sub {
            background-color: #6d2bf5;
            width: 190px;
        }

        & svg.MuiSvgIcon-root {
            margin-right: 12px;
            font-size: 1rem;
        }

        @media (min-width: 0) and (max-width: 767px) {
            &,
            &.main,
            &.sub {
                width: 100%;
            }
        }
    }
`;

const camstudyCandidatedDummy = [];
const camstudyListsDummy = [];

function CamStudyMainLists() {
    const headerMenus = [
        {
            mId: 0,
            mName: '나의 캠스터디',
        },
        {
            mId: 1,
            mName: '전체 목록',
        },
    ];
    const [menuStatus, setMenuStatus] = useState(0);
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);
    const [currentCamstudyData, setCurrentCamstudyData] = useState(null);
    const [dataListMine, setDataListMine] = useState([]);
    const [dataListInvited, setDataListInvited] = useState([]);
    const [dataListTotal, setDataListTotal] = useState([]);
    const dataListMineRef = useRef();
    dataListMineRef.current = dataListMine;
    const dataListInvitedRef = useRef();
    dataListInvitedRef.current = dataListInvited;
    const dataListTotalRef = useRef();
    dataListTotalRef.current = dataListTotal;
    const [totalDataListPage, setTotalDataListPage] = useState(0);

    const actionClickHeaderMenuItem = (menuId) => {
        setMenuStatus(menuId);
    };

    const actionToggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };

    const actionEnterStudy = (roomId, rules) => {
        console.log(roomId, rules);
    };

    const actionModifyStudy = (roomId) => {
        setCurrentCamstudyData(dataListMine.find(({ room_id }) => room_id === roomId));
        actionToggleDrawer(true)(true);
    };

    const actionDeleteStudy = (roomId) => {
        const conf = window.confirm('세션을 종료하시겠습니까?');
        if (conf)
            Axios.delete(`${apiUrl}/cam-study/${roomId}`, { withCredentials: true })
                .then((res) => {
                    if (menuStatus === 0) {
                        fetchListMine(true);
                        fetchListInvited(true);
                    } else {
                        setMenuStatus(() => 0);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
    };

    const renderContentsByMenu = (menuId) => {
        switch (menuId) {
            // 나의 캠스터디 항목 보여주기(초대됨, 내 항목)
            case 0:
                return (
                    <>
                        {dataListInvited.length ? (
                            <Groupbox title="초대됨">
                                {dataListInvited.length
                                    ? dataListInvited.map((d) => (
                                          <CamstudyListItem
                                              key={d.idx}
                                              roomId={d.room_id}
                                              creator={d.name}
                                              title={d.title}
                                              description={d.description}
                                              rules={d.rules}
                                              liveCounts={d.liveCounts}
                                              maxJoinCounts={d.max_joins}
                                              publicState={d.public_state}
                                              sessionEndDate={d.session_enddate}
                                              onEnter={actionEnterStudy}
                                          />
                                      ))
                                    : null}
                            </Groupbox>
                        ) : null}
                        <Groupbox title="내가 생성함">
                            {dataListMine.length
                                ? dataListMine.map((d) => (
                                      <CamstudyListItem
                                          key={d.idx}
                                          isMine
                                          roomId={d.room_id}
                                          creator={d.name}
                                          title={d.title}
                                          description={d.description}
                                          rules={d.rules}
                                          liveCounts={d.liveCounts}
                                          maxJoinCounts={d.max_joins}
                                          publicState={d.public_state}
                                          sessionEndDate={d.session_enddate}
                                          onEnter={actionEnterStudy}
                                          onModify={actionModifyStudy}
                                          onDelete={actionDeleteStudy}
                                      />
                                  ))
                                : null}
                        </Groupbox>
                    </>
                );
            case 1:
                return (
                    <>
                        <Groupbox title="전체 목록">
                            {dataListTotal.length
                                ? dataListTotal.map((d) => (
                                      <CamstudyListItem
                                          key={d.idx}
                                          roomId={d.room_id}
                                          creator={d.name}
                                          title={d.title}
                                          description={d.description}
                                          rules={d.rules}
                                          liveCounts={d.liveCounts}
                                          maxJoinCounts={d.max_joins}
                                          publicState={d.public_state}
                                          sessionEndDate={d.session_enddate}
                                          onEnter={actionEnterStudy}
                                      />
                                  ))
                                : null}
                        </Groupbox>
                    </>
                );
            default:
                return null;
        }
    };

    const fetchListMine = (actived) => {
        Axios.get(`${apiUrl}/cam-study/mine`, { withCredentials: true })
            .then((res) => {
                if (!actived || !res.data || !res.data.length) return;
                setDataListMine(res.data);
                fetchLiveCountsMine(actived);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const fetchListInvited = (actived) => {
        Axios.get(`${apiUrl}/cam-study/invited`, { withCredentials: true })
            .then((res) => {
                if (!actived || !res.data || !res.data.length) return;
                setDataListInvited(res.data);
                fetchLiveCountsInvited(actived);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const fetchListTotal = (actived, limit = 10, page = 0, addition = false) => {
        Axios.get(`${apiUrl}/cam-study/total`, {
            params: {
                limit: limit,
                page: page,
            },
            withCredentials: true,
        })
            .then((res) => {
                if (!actived || !res.data || !res.data.length) return;
                if (!addition) setDataListTotal(res.data);
                else setDataListTotal([...dataListTotal, ...res.data]);
                fetchLiveCountsTotal(actived);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const fetchLiveCountsMine = async (actived) => {
        const tasks = dataListMineRef.current.map(async (d) => {
            let counts = 0;
            try {
                counts = await (await Axios.get(`${apiUrl}/cam-study/live-counts/${d.room_id}`, { withCredentials: true })).data;
            } catch (fetchError) {
                console.error(fetchError);
            }
            return {
                ...d,
                liveCounts: counts,
            };
        });

        if (!actived) return;
        setDataListMine(await Promise.all(tasks));
    };

    const fetchLiveCountsInvited = async (actived) => {
        const tasks = dataListInvitedRef.current.map(async (d) => {
            let counts = 0;
            try {
                counts = await (await Axios.get(`${apiUrl}/cam-study/live-counts/${d.room_id}`, { withCredentials: true })).data;
            } catch (fetchError) {
                console.error(fetchError);
            }
            return {
                ...d,
                liveCounts: counts,
            };
        });

        if (!actived) return;
        setDataListInvited(await Promise.all(tasks));
    };

    const fetchLiveCountsTotal = async (actived) => {
        const tasks = dataListTotalRef.current.map(async (d) => {
            let counts = 0;
            try {
                counts = await (await Axios.get(`${apiUrl}/cam-study/live-counts/${d.room_id}`, { withCredentials: true })).data;
            } catch (fetchError) {
                console.error(fetchError);
            }
            return {
                ...d,
                liveCounts: counts,
            };
        });

        if (!actived) return;
        setDataListTotal(await Promise.all(tasks));
    };

    const actionAfterCreateOrModify = () => {
        setTimeout(() => {
            if (menuStatus === 0) {
                fetchListMine(true);
                fetchListInvited(true);
            } else {
                setMenuStatus(() => 0);
            }
        }, 500);
    };

    const liveCounter = useRef();

    useEffect(() => {
        let actived = true;
        if (menuStatus === null || menuStatus === undefined) return;

        switch (menuStatus) {
            case 0:
                fetchListMine(actived);
                fetchListInvited(actived);
                break;
            case 1:
                fetchListTotal(actived);
                break;
            default:
                break;
        }

        return () => {
            actived = false;
        };
    }, [menuStatus]);

    useEffect(() => {
        let actived = true;
        if (menuStatus === null || menuStatus === undefined) return;

        if (!liveCounter.current)
            liveCounter.current = setInterval(() => {
                switch (menuStatus) {
                    case 0:
                        fetchLiveCountsMine(actived);
                        fetchLiveCountsInvited(actived);
                        break;
                    case 1:
                        fetchLiveCountsTotal(actived);
                        break;
                    default:
                        break;
                }
            }, 15000);

        return () => {
            actived = false;
            if (liveCounter.current) clearInterval(liveCounter.current);
            liveCounter.current = null;
        };
    }, [menuStatus, liveCounter]);

    const defaultData = {
        title: '제목 편집',
        description: '설명 편집',
        rules: {
            renderContents: `<p>규칙 편집<p>`,
            deltaContents: {
                ops: [
                    { insert: 'The Two Towers' },
                    { insert: '\n', attributes: { header: 1 } },
                    { insert: 'Aragorn sped on up the hill.\n' },
                ],
            },
        },
        publicState: 2,
        maxJoins: 3,
        invitations: ['1511108048', '106553573902793620545'],
        sessionEndDate: new Date(),
    };

    return (
        <CamstudyMainRoot>
            <CreateAndEditCamstudy
                open={openCreateNewDrawer}
                defaultData={currentCamstudyData}
                handleClose={actionToggleDrawer(false)}
                onAfterCreateOrModify={actionAfterCreateOrModify}
            />

            <ClassWrapper col="col">
                <HeaderContainer>
                    <HeaderMenu
                        title="캠 스터디"
                        menuDatas={headerMenus}
                        selectedMenuId={menuStatus}
                        onItemClick={actionClickHeaderMenuItem}
                    />
                    <StyledButton className="video-lecture sub" onClick={actionToggleDrawer(true)}>
                        <AddCircleOutlineIcon fontSize="small" />
                        캠스터디 만들기
                    </StyledButton>
                </HeaderContainer>

                <Contents>{renderContentsByMenu(menuStatus)}</Contents>
            </ClassWrapper>
        </CamstudyMainRoot>
    );
}

export default CamStudyMainLists;
