/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import GroupBox from '../../AltridUI/GroupBox/GroupBox';
import HeaderMenu from '../../AltridUI/HeaderMenu/HeaderMenu';
import Button from '../../AltridUI/Button/Button';
import CamstudyListItem from './components/CamstudyListItem';
import CreateAndEditCamstudy from './components/CreateAndEditCamstudy';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@material-ui/core';
import HtmlParser from 'react-html-parser';
import AddCamstudyIcon from '../../AltridUI/Icons/AddCamstudyIcon';

const CamstudyMainRoot = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 32px;
    max-width: 960px;
    height: 100%;
    @media (max-width: 640px) {
        margin-top: 30px;
    }
`;
const HeaderContainer = styled.div`
    display: flex;
    width: 100%;
`;
const Contents = styled.div`
    margin-top: 32px;
    width: 100%;
`;

function CamStudyMainLists({ history, match }) {
    const headerMenus = [
        {
            mId: 0,
            mName: '나의 캠 스터디',
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
    const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
    const [entranceData, setEntranceData] = useState({
        roomId: null,
        rules: null,
    });

    const actionClickHeaderMenuItem = (menuId) => {
        setMenuStatus(menuId);
    };

    const actionToggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        if (!open) setCurrentCamstudyData(null);
        setOpenCreateNewDrawer(open);
    };

    const actionEnterStudy = (roomId, rules) => {
        setEntranceData({ roomId: roomId, rules: rules.renderContents });
        setRulesDialogOpen(true);
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

    const actionClickEnterConfirm = () => {
        const classNumber = match.params.num;
        window.open(
            `/cam-study-eyetracker/${classNumber}?roomId=${entranceData.roomId}`,
            'Gooroomee Biz_withEyetracker',
            `toolbar=no, scrollbars=no, resizable=no, status=no`,
            true,
        );
    };

    const renderContentsByMenu = (menuId) => {
        switch (menuId) {
            // 나의 캠스터디 항목 보여주기(초대됨, 내 항목)
            case 0:
                return (
                    <>
                        {dataListInvited.length ? (
                            <GroupBox title="초대됨">
                                {dataListInvited.length ? (
                                    <Grid container spacing={2}>
                                        {dataListInvited.map((d) => (
                                            <Grid item key={d.idx} lg={6} md={12} sm={12} xs={12}>
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
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : null}
                            </GroupBox>
                        ) : null}
                        <GroupBox title="내가 생성함">
                            {dataListMine.length ? (
                                <Grid container spacing={2}>
                                    {dataListMine.map((d) => (
                                        <Grid item key={d.idx} lg={6} md={12} sm={12} xs={12}>
                                            <CamstudyListItem
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
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : null}
                        </GroupBox>
                    </>
                );
            case 1:
                return (
                    <>
                        <GroupBox title="전체 목록">
                            {dataListTotal.length ? (
                                <Grid container spacing={2}>
                                    {dataListTotal.map((d) => (
                                        <Grid item key={d.idx} md={12} sm={12} xs={12}>
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
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : null}
                        </GroupBox>
                    </>
                );
            default:
                return null;
        }
    };

    const rulesDialog = (
        <Dialog open={rulesDialogOpen}>
            <DialogTitle>규칙을 읽어주세요!</DialogTitle>
            <DialogContent dividers style={{ minWidth: 320 }}>
                {HtmlParser(entranceData.rules)}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="default"
                    sizes="small"
                    colors="black"
                    onClick={() => {
                        setRulesDialogOpen(false);
                    }}
                >
                    취소
                </Button>
                <Button variant="light" sizes="small" colors="red" onClick={actionClickEnterConfirm}>
                    확인했으며, 입장합니다.
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <CamstudyMainRoot>
            {rulesDialog}
            <CreateAndEditCamstudy
                open={openCreateNewDrawer}
                defaultData={currentCamstudyData}
                handleClose={actionToggleDrawer(false)}
                onAfterCreateOrModify={actionAfterCreateOrModify}
            />
            <HeaderContainer>
                <HeaderMenu
                    title="캠 스터디"
                    menuDatas={headerMenus}
                    selectedMenuId={menuStatus}
                    onItemClick={actionClickHeaderMenuItem}
                    rightComponent={
                        <Button
                            variant="filled"
                            sizes="medium"
                            colors="green"
                            leftIcon={<AddCamstudyIcon />}
                            onClick={actionToggleDrawer(true)}
                        >
                            캠 스터디 만들기
                        </Button>
                    }
                />
            </HeaderContainer>
            <Contents>{renderContentsByMenu(menuStatus)}</Contents>
        </CamstudyMainRoot>
    );
}

export default CamStudyMainLists;
