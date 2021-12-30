/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import CardShare from './CardShare';
import { Grid, withStyles } from '@material-ui/core';
// import ClassHeaderBox from '../essentials/ClassHeaderBox';
import { useSelector, useDispatch } from 'react-redux';
import { getActived } from '../../redux_modules/assignmentActived';
import { changeParams } from '../../redux_modules/params';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import Error from '../../pages/Errors/Error';
import styled from 'styled-components';
import moment from 'moment-timezone';
import HeaderMenu from '../../AltridUI/HeaderMenu/HeaderMenu';

const GoDraftDiv = styled.div`
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-self: flex-start;

    & h1 {
        color: #706d6d;
        font-size: 2.4rem;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.06;
        letter-spacing: -2.75px;
        text-align: left;

        margin-bottom: 1.5rem;
    }
    & button {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 1.2rem 1.5rem;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
        margin: 30px 0;
        border-radius: 11px;
        cursor: pointer;
        background-color: #13e2a1;

        & p {
            font-size: 1.125rem;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: -1.2px;
            text-align: left;
            color: #ffffff;

            margin-right: 1rem;
        }
    }
`;
// const ButtonAble = styled.button`
//     color: ${(props) => (props.able ? '#3B168A' : '#b2b2b2')};
//     border-bottom: ${(props) => (props.able ? '2px solid #3B168A' : 'none')};
// `;
const HeaderContainer = styled.div`
    display: flex;
    width: 100%;
`;
const WarningsContainer = styled.div`
    margin-top: 16px;
`;
const AssigmentWarning = styled.div`
    font-size: 1.125rem;
    font-weight: 400;
    color: #707070;
    margin-bottom: 20px;

    & b {
        font-weight: 600;
    }
    & span {
        font-weight: 600;
        color: #13e2a1;
    }

    @media (min-width: 0) and (max-width: 662px) {
        display: none;
    }
`;
const SharedAssignmentRoot = styled.div`
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
const AssignmentItemCardContainer = styled.div``;

const GridResponsive = withStyles((theme) => ({
    'spacing-xs-2': {
        '@media (max-width: 640px)': {
            width: 'calc(100% + 8px)',
            margin: -4,
            '& .MuiGrid-item': {
                padding: 4,
            },
        },
    },
}))(Grid);

function Share({ match, history }) {
    const { num } = match.params;
    const dispatch = useDispatch();

    let shareDatas = [];
    let cnt = 0;

    /** redux state */
    const sessions = useSelector((state) => state.RdxSessions);
    const { datetime } = useSelector((state) => state.RdxServerDate);
    const { data, error } = useSelector((state) => state.assignmentActived.activedDatas) || {
        loading: false,
        data: null,
        error: null,
    }; // 아예 데이터가 존재하지 않을 때가 있으므로, 비구조화 할당이 오류나지 않도록
    const { leftNavGlobal } = useSelector((state) => state.RdxGlobalLeftNavState);

    /** component state */
    const [tries, setTries] = useState(undefined);
    const currentClass = useSelector((state) => state.RdxCurrentClass);
    // const [ableState, setAbleSate] = useState({
    //     total: true,
    //     ing: false,
    //     done: false,
    // });
    const [menuStatus, setMenuStatus] = useState(1);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [gridMdBreakpoint, setGridMdBreakpoint] = useState(false);
    const [gridSmBreakpoint, setGridSmBreakpoint] = useState(false);
    const actionClickHeaderMenuItem = (menuId) => {
        setMenuStatus(menuId);
    };

    // const handleShareCardList = useCallback(
    //     (e) => {
    //         const { name, value } = e.target;

    //         setAbleSate({
    //             total: false,
    //             ing: false,
    //             done: false,
    //         });
    //         setAbleSate((prevState) => ({
    //             ...prevState,
    //             [name]: !(value === 'true'),
    //         }));
    //     },
    //     [ableState],
    // );

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName) return;
        dispatch(getActived(num));
        dispatch(changeParams(1, num));

        if (sessions.userType === 'students') {
            Axios.get(`${apiUrl}/others/assignment-tries/${num}`, { withCredentials: true })
                .then((res) => {
                    setTries(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [sessions.authId]);

    useEffect(() => {
        const updateWindowDimensions = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', updateWindowDimensions);
        return () => window.removeEventListener('resize', updateWindowDimensions);
    }, []);

    useEffect(() => {
        if (screenWidth < 1100 && leftNavGlobal) {
            setGridMdBreakpoint(true);
        } else {
            setGridMdBreakpoint(false);
        }
        if (screenWidth > 902 && leftNavGlobal) setGridSmBreakpoint(true);
        else setGridSmBreakpoint(false);
    }, [screenWidth, leftNavGlobal]);

    if (data) {
        shareDatas = data;
        shareDatas.map((i) => (moment(i['due_date']).format('YYMMDDHHmmss') > moment().format('YYMMDDHHmmss') ? cnt++ : ''));
    }

    if (error) return <Error />;
    if (!data) return null;

    return (
        <>
            {/* <BackdropComponent open={loading && !data && !error} /> */}
            <SharedAssignmentRoot>
                {shareDatas.length === 0 ? (
                    <GoDraftDiv>
                        <h1>현재 진행중인 과제가 없습니다 :( </h1>
                        {sessions.userType !== 'students' ? (
                            <button
                                onClick={() => {
                                    history.replace(`/main-draft`);
                                }}
                            >
                                <p>과제 생성하러 가기</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30.414" height="9.978" viewBox="0 0 30.414 9.978">
                                    <path
                                        id="icon"
                                        d="M0 0h28l-8.27 8.27"
                                        fill="none"
                                        stroke="#fff"
                                        strokeWidth="2px"
                                        transform="translate(0 1)"
                                    />
                                </svg>
                            </button>
                        ) : null}
                    </GoDraftDiv>
                ) : (
                    <>
                        <HeaderContainer>
                            <HeaderMenu
                                title="과제 게시판"
                                menuDatas={[
                                    {
                                        mId: 1,
                                        mName: '진행 중',
                                        mCounts: cnt,
                                    },
                                    {
                                        mId: 2,
                                        mName: '완료됨',
                                        mCounts: shareDatas.length - cnt,
                                    },
                                ]}
                                selectedMenuId={menuStatus}
                                fixed
                                backgroundColor="#f6f8f9"
                                onItemClick={actionClickHeaderMenuItem}
                            />
                        </HeaderContainer>
                        <AssignmentItemCardContainer>
                            <WarningsContainer>
                                {sessions.userType === 'students' ? (
                                    <AssigmentWarning>
                                        제한시간이 있는 과제의 풀이 기회는 <span>단 한번</span>이며, 제한시간이 없는 과제는 풀이 중
                                        <span> 임시저장 후</span> 이어풀기가 가능합니다.
                                    </AssigmentWarning>
                                ) : (
                                    <AssigmentWarning>
                                        제한시간이 있는 과제의 경우 풀이 기회는 <span>단 한번</span>가능합니다.
                                        <br />
                                        학생이
                                        <b> 재풀이 요청</b>을 한다면, 과제 리포트 페이지에서 <b>결과 초기화</b>가 가능합니다.
                                    </AssigmentWarning>
                                )}
                            </WarningsContainer>
                            <GridResponsive container spacing={2}>
                                {(sessions.userType === 'students' && tries) || sessions.userType !== 'students'
                                    ? Object.keys(shareDatas)
                                          .filter((i) =>
                                              menuStatus === 0
                                                  ? i
                                                  : menuStatus === 1
                                                  ? new Date(shareDatas[i]['due_date']).getTime() > datetime
                                                  : new Date(shareDatas[i]['due_date']).getTime() <= datetime,
                                          )
                                          .map((key) => (
                                              <GridResponsive
                                                  key={key}
                                                  item
                                                  md={gridMdBreakpoint ? 12 : 6}
                                                  sm={gridSmBreakpoint ? 12 : 6}
                                                  xs={12}
                                                  zeroMinWidth
                                              >
                                                  <CardShare
                                                      testNum={shareDatas[key]['idx']}
                                                      cardData={shareDatas[key]}
                                                      tries={
                                                          sessions.userType === 'students'
                                                              ? tries.find((o) => o.idx === shareDatas[key]['idx']).tries
                                                              : 0
                                                      }
                                                      totalStudents={currentClass.currentStudentsNumber}
                                                  />
                                              </GridResponsive>
                                          ))
                                    : null}
                            </GridResponsive>
                        </AssignmentItemCardContainer>
                    </>
                )}
                <div style={{ marginTop: 'auto' }}></div>
            </SharedAssignmentRoot>
        </>
    );
}

export default React.memo(Share);
