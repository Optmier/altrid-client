import React, { useState, useEffect } from 'react';
import CardShare from './CardShare';
import CardLists from '../essentials/CardLists';
import CardRoot from '../essentials/CardRoot';
import { Drawer } from '@material-ui/core';
import ClassDrawer from '../essentials/ClassDrawer';
// import ClassHeaderBox from '../essentials/ClassHeaderBox';
import { useSelector, useDispatch } from 'react-redux';
import { getActived } from '../../redux_modules/assignmentActived';
import moment from 'moment';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import Error from '../../pages/Error';
import BackdropComponent from '../essentials/BackdropComponent';
import styled from 'styled-components';
import ClassWrapper from '../essentials/ClassWrapper';
import TypeBanner from '../essentials/TypeBanner';

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
        margin-top: 30px;
        border-radius: 10px;
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

const AssignmentWarnings = styled.p`
    color: #b72a2a;
    font-size: 0.875rem;
    line-height: 1.2rem;
    margin-top: 0.5rem;
`;

function Share({ match, history }) {
    const { num } = match.params;
    let shareDatas = [];
    let cnt = 0;

    /** redux state */
    const { data, loading, error } = useSelector((state) => state.assignmentActived.activedDatas) || {
        loading: false,
        data: null,
        error: null,
    }; // 아예 데이터가 존재하지 않을 때가 있으므로, 비구조화 할당이 오류나지 않도록
    const sessions = useSelector((state) => state.RdxSessions);
    const dispatch = useDispatch();
    const [tries, setTries] = useState(undefined);
    const currentClass = useSelector((state) => state.RdxCurrentClass);

    useEffect(() => {
        if (!sessions || !sessions.userType || !sessions.academyName) return;
        dispatch(getActived(num));
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

    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };
    if (error) return <Error />;
    if (!data) return null;

    return (
        <>
            <BackdropComponent open={loading && !data && !error} />
            <Drawer anchor="right" open={openCreateNewDrawer} onClose={toggleDrawer(false)}>
                <ClassDrawer />
            </Drawer>

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
                    <div className="class-draft-card">
                        <CardLists
                            upperDeck={
                                <div className="class-title">
                                    <b>총 {shareDatas.length}개</b>의 과제중 <b>{cnt}개</b>의 과제가 <span>진행중</span>입니다.
                                    {sessions.userType === 'students' ? (
                                        <AssignmentWarnings>
                                            주의: 과제 시작과 동시에 시도횟수가 증가하며, 끝낼 때는 반드시 종료 버튼을 눌러주세요!
                                            <br></br>
                                            제한시간이 있는 과제는 중간에 종료하시면 재시도가 불가하오니 유의하시기 바랍니다.
                                        </AssignmentWarnings>
                                    ) : null}
                                </div>
                            }
                        >
                            {(sessions.userType === 'students' && tries) || sessions.userType !== 'students'
                                ? Object.keys(shareDatas).map((key) => (
                                      <CardRoot key={key} wider cardHeight="320px">
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

export default Share;
