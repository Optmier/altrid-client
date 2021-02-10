import React, { useState, useEffect, useCallback } from 'react';
import CardShare from './CardShare';
import CardLists from '../essentials/CardLists';
import CardRoot from '../essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import ClassDrawer from '../essentials/ClassDrawer';
// import ClassHeaderBox from '../essentials/ClassHeaderBox';
import { useSelector, useDispatch } from 'react-redux';
import { getActived } from '../../redux_modules/assignmentActived';
import { changePramas } from '../../redux_modules/params';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import Error from '../../pages/Error';
import BackdropComponent from '../essentials/BackdropComponent';
import styled from 'styled-components';
import ClassWrapper from '../essentials/ClassWrapper';
import TypeBanner from '../essentials/TypeBanner';
import moment from 'moment-timezone';

const GoDraftDiv = styled.div`
    margin-top: 100px;
    min-height: calc(100vh - 80px);
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
const ButtonAble = styled.button`
    color: ${(props) => (props.able ? '#3B168A' : '#b2b2b2')};
    border-bottom: ${(props) => (props.able ? '2px solid #3B168A' : 'none')};
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

function Share({ match, history }) {
    const { num } = match.params;
    const dispatch = useDispatch();

    let shareDatas = [];
    let cnt = 0;

    /** redux state */
    const sessions = useSelector((state) => state.RdxSessions);
    const { datetime } = useSelector((state) => state.RdxServerDate);
    const { data, loading, error } = useSelector((state) => state.assignmentActived.activedDatas) || {
        loading: false,
        data: null,
        error: null,
    }; // 아예 데이터가 존재하지 않을 때가 있으므로, 비구조화 할당이 오류나지 않도록

    /** component state */
    const [tries, setTries] = useState(undefined);
    const currentClass = useSelector((state) => state.RdxCurrentClass);
    const [ableState, setAbleSate] = useState({
        total: true,
        ing: false,
        done: false,
    });

    const handleShareCardList = useCallback(
        (e) => {
            const { name, value } = e.target;

            setAbleSate({
                total: false,
                ing: false,
                done: false,
            });
            setAbleSate((prevState) => ({
                ...prevState,
                [name]: !(value === 'true'),
            }));
        },
        [ableState],
    );

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName) return;
        dispatch(getActived(num));
        dispatch(changePramas(1, num));

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

    if (data) {
        shareDatas = data;
        shareDatas.map((i) => (moment(i['due_date']).format('YYMMDDHHmmss') > moment().format('YYMMDDHHmmss') ? cnt++ : ''));
    }

    if (error) return <Error />;
    if (!data) return null;

    return (
        <>
            <BackdropComponent open={loading && !data && !error} />
            {shareDatas.length === 0 ? (
                <ClassWrapper>
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
                </ClassWrapper>
            ) : (
                <div className="class-section-root">
                    <ClassWrapper>
                        <div className="class-share-header">
                            <div className="header-title">과제 게시판</div>
                            <div className="header-menu">
                                <ButtonAble name="total" able={ableState['total']} value={ableState['total']} onClick={handleShareCardList}>
                                    전체({shareDatas.length})
                                </ButtonAble>
                                <ButtonAble name="ing" able={ableState['ing']} value={ableState['ing']} onClick={handleShareCardList}>
                                    진행중({cnt})
                                </ButtonAble>
                                <ButtonAble name="done" able={ableState['done']} value={ableState['done']} onClick={handleShareCardList}>
                                    진행 완료({shareDatas.length - cnt})
                                </ButtonAble>
                            </div>
                        </div>
                    </ClassWrapper>

                    <div className="class-draft-card">
                        <CardLists
                            upperDeck={
                                sessions.userType === 'students' ? (
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
                                )
                            }
                        >
                            {(sessions.userType === 'students' && tries) || sessions.userType !== 'students'
                                ? Object.keys(shareDatas)
                                      .filter((i) =>
                                          ableState['total']
                                              ? i
                                              : ableState['ing']
                                              ? new Date(shareDatas[i]['due_date']).getTime() > datetime
                                              : new Date(shareDatas[i]['due_date']).getTime() <= datetime,
                                      )
                                      .map((key) => (
                                          <CardRoot key={key} wider>
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
                                          </CardRoot>
                                      ))
                                : null}
                        </CardLists>
                    </div>
                </div>
            )}
        </>
    );
}

export default React.memo(Share);
