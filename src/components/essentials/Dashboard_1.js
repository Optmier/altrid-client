import React, { useEffect, useState } from 'react';
import icon_image from '../../images/dashboard_icon.png';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Dday from '../../pages/Dday';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Footer from './Footer';
import HeaderBar from './HeaderBar';
import Axios from 'axios';
import { apiUrl } from '../../configs/configs';
import { Link } from 'react-router-dom';

const Container = styled.div`
    margin: 0px auto;
    max-width: 1216px;
    margin-bottom: 160px;

    & .header {
        height: 80px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 27px;

        & .icon {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 65px;
            height: 36px;

            & p {
                font-weight: bold;
                color: #6c46a1;
                font-size: 16px;
                letter-spacing: -0.02em;
                margin: 0px 8px;
                padding: 8px 16px;
                border-radius: 104px;
                background: #f4f1fa;
            }
        }
        & .plan {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 128px;
            height: 36px;
            background: #6c46a1;
            border-radius: 104px;
            color: #ffffff;
            font-weight: bold;
            font-size: 16px;
            text-align: center;

            & p {
                margin: 0px 8px;
            }
        }
    }

    & .greeting {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 260px;
        margin-bottom: 16px;

        & h2 {
            font-weight: 700;
            font-size: 56px;
            line-height: 60px;
            margin-bottom: 8px;
            margin-top: 16px;
        }

        & .left {
        }
    }

    & .dashboard {
        margin: 0 auto;
        & .card {
            padding: 0px 32px;
            min-height: 248px;
            border-radius: 32px;
            background: #f6f8f9;
            font-weight: bold;
            & .input {
                margin-top: 68px;
                background: #3b1689;
                border-radius: 104px;
                color: #ffffff;
                text-align: center;
                width: 320px;
                height: 46px;
            }
        }
        & .lecture {
            background: #f4f1fa;
            & h3 {
                padding-top: 32px;
                font-size: 24px;
                line-height: 28px;
                color: #3b1689;
            }
            & p {
                font-weight: bold;
                height: 32px;
                font-size: 18px;
                line-height: 22px;
                margin-top: 16px;
                color: #957fce;
            }
        }
        & .camstudy {
            & h3 {
                padding-top: 32px;
                font-size: 24px;
                line-height: 28px;
                color: '#000000';
            }
            & p {
                font-weight: bold;
                width: 100%;
                height: 32px;
                font-size: 18px;
                line-height: 22px;
                margin-top: 16px;
                color: #000000;
            }
        }
        & .word {
            background: #fff3ef;
            & p {
                color: #ff6937;
                padding-top: 25px;
                font-weight: 400;
                font-size: 14px;
                text-align: center;
            }
            & h3 {
                color: #ff6937;
                padding-top: 32px;
            }
            & h1 {
                margin-top: 34px;
                color: #ff6937;
                font-weight: bold;
                font-size: 56px;
                line-height: 60px;
                text-align: center;
                cursor: pointer;
            }
            & h4 {
                color: #ff6937;
                margin-top: 40px;
                font-weight: bold;
                text-align: center;
            }
        }
        & .assignment {
            & h3 {
                padding-top: 32px;
                font-size: 24px;
                line-height: 28px;
                color: '#000000';
            }
            & .info {
                display: flex;
                flex-direction: row;
                align-items: center;
                align-content: center;
                & .dday {
                    background: #d4e2fc;
                    border-radius: 8px;
                    padding: 4px 8px;
                    color: #174291;
                }
                & p {
                    margin-right: 16px;
                    font-weight: bold;
                    font-size: 18px;
                }
                & span {
                    font-weight: normal;
                    font-size: 18px;
                }
            }
            & p {
                margin-top: 17px;
            }
        }
        & .comment {
            background: #ffffff;
            border: 1px solid #bfc6cd;
            background: #ffffff;
            height: 198px;
            padding-top: 32px;

            & p {
                margin-top: 16px;
                font-size: 24px;
                line-height: 36px;
                font-weight: 400;
            }
        }
        & .wordprogress {
            & h3 {
                padding-top: 32px;
                font-size: 24px;
                line-height: 28px;
                color: '#000000';
            }
            & p {
                margin-top: 34px;
                color: #000000;
                font-weight: bold;
                font-size: 56px;
                line-height: 60px;
                text-align: center;
            }
        }
    }
`;
const Item = styled.div``;

function Dashboard_1({ match }) {
    const sessions = useSelector((state) => state.RdxSessions);
    const { num } = match.params;
    const classNum = match.params.num;
    const [meetingroom, Setmeetingroom] = useState([]);
    const [word, setword] = useState('');
    const [korean, setkorean] = useState('');
    const [flip, setflip] = useState(false);
    const [total, settotal] = useState('');
    const [assignment, setassignment] = useState([]);
    // 현재 날짜
    const [today, setdate] = useState(new Date());
    const [room, setroom] = useState([]);

    useEffect(() => {
        Axios.get(`${apiUrl}/meeting-room/livelecture`, { withCredentials: true })
            .then((result) => {
                Setmeetingroom(result.data);
            })
            .catch((err) => console.log(err));
    }, []);

    const ClickCard = () => {
        Axios({
            url: `https://dapi.kakao.com/v2/translation/translate?src_lang=en&target_lang=kr&query=${word}`,
            type: 'GET',
            headers: { Authorization: 'KakaoAK deff2bf52bcadf12b544be630be9846b' },
        })
            .then((result) => setkorean(result.data.translated_text[0]))
            .catch((error) => console.log(error));
        if (!flip) {
            setflip(true);
        } else {
            setflip(false);
        }
    };

    useEffect(() => {
        Axios.get(`${apiUrl}/meeting-room`, { params: { classNumber: classNum }, withCredentials: true })
            .then((result) => {
                console.log(result);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        Axios.get(`${apiUrl}/assignment-actived/${num}`, { withCredentials: true })
            .then((result) => {
                setassignment(result.data);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        Axios.get(`${apiUrl}/vocas/random`, { params: { classNum: classNum }, withCredentials: true })
            .then((result) => setword(result.data.word))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        Axios.get(`${apiUrl}/vocas/progress`, { params: { classNum: classNum }, withCredentials: true })
            .then((result) => settotal(result.data))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        Axios.get(`${apiUrl}/cam-study/all`, { withCredentials: true })
            .then((result) => {
                setroom(result.data);
            })
            .catch((err) => console.log(err));
    }, []);
    return (
        <>
            <HeaderBar />
            <Container>
                <div className="greeting">
                    <div className="left">
                        <svg width="71" height="47" viewBox="0 0 71 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M23.337 0.0335945C23.9963 -0.100785 24.3918 0.167979 24.5237 0.839887C24.6555 1.37741 24.3918 1.71337 23.7326 1.84775C18.8542 2.9228 14.8329 4.66976 11.6685 7.08863C8.63603 9.37312 7.11978 11.8592 7.11978 14.5468C7.11978 16.1594 7.64717 17.436 8.70195 18.3767C9.88858 19.3174 13.3825 20.4596 19.1838 21.8034C23.2711 22.8785 26.2377 24.4239 28.0836 26.4396C30.0613 28.4553 31.0501 31.0758 31.0501 34.3009C31.0501 37.9292 29.7976 40.9528 27.2925 43.3717C24.7874 45.7906 21.5571 47 17.6017 47C12.4596 47 8.24048 45.1858 4.94429 41.5575C1.6481 37.7948 0 33.0243 0 27.2459C0 20.258 2.04364 14.4124 6.13092 9.70907C10.35 5.00572 16.0854 1.78056 23.337 0.0335945ZM63.0891 0.0335945C63.7484 -0.100785 64.1439 0.167979 64.2758 0.839887C64.5395 1.37741 64.3417 1.71337 63.6824 1.84775C58.8041 2.9228 54.7827 4.66976 51.6184 7.08863C48.5859 9.37312 47.0696 11.8592 47.0696 14.5468C47.0696 16.1594 47.597 17.436 48.6518 18.3767C49.7066 19.3174 53.1346 20.4596 58.9359 21.8034C63.1551 22.8785 66.1875 24.4239 68.0334 26.4396C70.0111 28.4553 71 31.0758 71 34.3009C71 37.9292 69.7474 40.9528 67.2423 43.3717C64.7372 45.7906 61.507 47 57.5515 47C52.4095 47 48.1903 45.1187 44.8941 41.356C41.598 37.4589 39.9499 32.554 39.9499 26.6412C39.9499 19.7877 41.9935 14.0765 46.0808 9.5075C50.1681 4.93853 55.8375 1.78056 63.0891 0.0335945Z"
                                fill="#AEFFE0"
                            />
                        </svg>
                        <h2>반갑습니다 {sessions.userName} 님</h2>
                        <Dday classNum={num} />
                    </div>
                    <div className="right">
                        <img width="339px" height="260px" src={icon_image} alt="dashboard_icons"></img>
                    </div>
                </div>
                <div className="dashboard">
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={4}>
                                <Item>
                                    <div className="card lecture">
                                        <h3>강의실</h3>
                                        {meetingroom.length !== 0 ? (
                                            <>
                                                <p>현재 강의가 진행 중이니 입장해주세요 </p>
                                                <Link to={`/class/${num}/vid-lecture`}>
                                                    <button className="input">입장하기</button>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <p>현재 진행중인 강의가 없습니다.</p>
                                                <Link to={`/class/${num}/vid-lecture`}>
                                                    <button className="input">강의실로 이동하기</button>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>
                                    <div className="card camstudy">
                                        <h3>캠스터디</h3>
                                        {room.length === 0 ? (
                                            <p>현재 공부중인 방이 없습니다. </p>
                                        ) : (
                                            <p>
                                                총 {room.length} 개의 방이 있습니다. <br />
                                                함께 공부해보세요
                                            </p>
                                        )}

                                        <Link to={`/class/${num}/cam-study`}>
                                            <button className="input">입장하기</button>
                                        </Link>
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>
                                    <div className="card word">
                                        <h3>오늘의 단어</h3>
                                        {!word ? <h4>단어가 없습니다.</h4> : <h1 onClick={ClickCard}>{flip ? korean : word}</h1>}
                                        <Link to={`/class/${num}/learning-vocas`}>
                                            <p>더 많은 단어 학습하기</p>
                                        </Link>
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>
                                    <div className="card assignment">
                                        <h3>과제 현황</h3>
                                        {assignment.length !== 0 ? (
                                            assignment.map((data, index) => {
                                                return (
                                                    <div key={index} className="info">
                                                        {Math.ceil(
                                                            (new Date(data.due_date).getTime() - today.getTime()) / (1000 * 3600 * 24),
                                                        ) > 0 ? (
                                                            <>
                                                                <p className="dday">
                                                                    D{' '}
                                                                    {Math.ceil(
                                                                        (today.getTime() - new Date(data.due_date).getTime()) /
                                                                            (1000 * 3600 * 24),
                                                                    )}
                                                                </p>
                                                                <Link to={`/class/${num}/share`}>
                                                                    <p>{data.title}</p>
                                                                </Link>

                                                                <p>
                                                                    <span>{data.description}</span>
                                                                </p>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <>
                                                <p>현재진행 중인 과제가 없습니다. </p>
                                            </>
                                        )}
                                        <h3>마감된 과제 </h3>
                                        {assignment.length !== 0
                                            ? assignment.map((data, index) => {
                                                  return (
                                                      <div key={index} className="info">
                                                          {Math.ceil(
                                                              (new Date(data.due_date).getTime() - today.getTime()) / (1000 * 3600 * 24),
                                                          ) > 0 ? null : (
                                                              <>
                                                                  <p>{data.title}</p>
                                                                  <p>
                                                                      <span>{data.description}</span>
                                                                  </p>
                                                              </>
                                                          )}
                                                      </div>
                                                  );
                                              })
                                            : null}
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>
                                    <div className="card wordprogress">
                                        <h3>단어 진행률</h3>
                                        <p>
                                            {total.progress}/{total.total}
                                        </p>
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>
                                    <div className="card comment">
                                        <svg width="71" height="47" viewBox="0 0 71 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M23.337 0.0335945C23.9963 -0.100785 24.3918 0.167979 24.5237 0.839887C24.6555 1.37741 24.3918 1.71337 23.7326 1.84775C18.8542 2.9228 14.8329 4.66976 11.6685 7.08863C8.63603 9.37312 7.11978 11.8592 7.11978 14.5468C7.11978 16.1594 7.64717 17.436 8.70195 18.3767C9.88858 19.3174 13.3825 20.4596 19.1838 21.8034C23.2711 22.8785 26.2377 24.4239 28.0836 26.4396C30.0613 28.4553 31.0501 31.0758 31.0501 34.3009C31.0501 37.9292 29.7976 40.9528 27.2925 43.3717C24.7874 45.7906 21.5571 47 17.6017 47C12.4596 47 8.24048 45.1858 4.94429 41.5575C1.6481 37.7948 0 33.0243 0 27.2459C0 20.258 2.04364 14.4124 6.13092 9.70907C10.35 5.00572 16.0854 1.78056 23.337 0.0335945ZM63.0891 0.0335945C63.7484 -0.100785 64.1439 0.167979 64.2758 0.839887C64.5395 1.37741 64.3417 1.71337 63.6824 1.84775C58.8041 2.9228 54.7827 4.66976 51.6184 7.08863C48.5859 9.37312 47.0696 11.8592 47.0696 14.5468C47.0696 16.1594 47.597 17.436 48.6518 18.3767C49.7066 19.3174 53.1346 20.4596 58.9359 21.8034C63.1551 22.8785 66.1875 24.4239 68.0334 26.4396C70.0111 28.4553 71 31.0758 71 34.3009C71 37.9292 69.7474 40.9528 67.2423 43.3717C64.7372 45.7906 61.507 47 57.5515 47C52.4095 47 48.1903 45.1187 44.8941 41.356C41.598 37.4589 39.9499 32.554 39.9499 26.6412C39.9499 19.7877 41.9935 14.0765 46.0808 9.5075C50.1681 4.93853 55.8375 1.78056 63.0891 0.0335945Z"
                                                fill="#9AA5AF"
                                            />
                                        </svg>
                                        <p>Hazel님은 어휘력은 뛰어나지만, 활용력이 부족합니다. 그래서 어쩌구 저저구가 더 필요합니다.</p>
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="card comment">
                                    <Link to={`/${num}/calendar`}>캘린더 바로가기</Link>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </Container>
            <Footer />
        </>
    );
}

export default Dashboard_1;
