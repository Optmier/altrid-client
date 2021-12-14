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
import ReactApexChart from 'react-apexcharts';
import Button from '../../AltridUI/Button/Button';
import { Helmet } from 'react-helmet';
import MakeAutoComments from '../../controllers/MakeAutoComment';
import BackgroundTheme from '../../AltridUI/ThemeColors/BackgroundTheme';

const Container = styled.div`
    margin: 0px auto;
    max-width: 1216px;
    margin-bottom: 160px;
    padding: 0 16px;
    & .gobutton {
        margin-top: 68px;
    }
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
        max-height: 260px;
        margin-bottom: 16px;

        & h2 {
            font-weight: 700;
            font-size: 56px;

            margin-bottom: 8px;
            margin-top: 16px;
            @media (min-width: 0px) and (max-width: 520px) {
                font-size: 28px;
                /* white-space: pre-wrap; */
            }
            @media (min-width: 520px) and (max-width: 715px) {
                font-size: 35px;
            }
        }

        & .right {
            & img {
                max-width: 339px;
                max-height: 260px;
                @media (min-width: 0px) and (max-width: 520px) {
                    max-width: 235px;
                    width: 100%;
                    max-height: 200px;
                }
            }
        }
    }

    & .dashboard {
        margin: 0 auto;
        & .card {
            padding: 32px 32px;
            min-height: 190px;
            border-radius: 32px;
            background-color: #f6f8f9;
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
            @media (min-width: 600px) and (max-width: 990px) {
                padding: 16px 16px;
            }
        }
        & .lecture {
            background: #f4f1fa;
            & h3 {
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
            background-color: #d4e2fc;

            & h3 {
                font-size: 24px;
                line-height: 28px;
                color: #1e54b7;
            }

            & p {
                font-weight: bold;
                width: 100%;
                height: 32px;
                font-size: 18px;
                line-height: 22px;
                margin-top: 16px;
                color: #5b91f5;
            }
        }
        & .word {
            background: #fff3ef;
            overflow: auto;
            & p {
                color: #ff6937;
                padding-top: 25px;
                font-weight: 400;
                font-size: 14px;
                text-align: center;
            }
            & h3 {
                color: #ff6937;
            }
            & h1 {
                margin-top: 34px;
                color: #ff6937;
                font-weight: bold;
                /* font-size: 56px; */
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
            overflow-x: auto;
            & h3 {
                font-size: 24px;
                line-height: 28px;
                color: '#000000';
            }
            & .info {
                display: flex;
                flex-direction: row;
                align-items: center;
                align-content: center;
                & .assign_title {
                    width: 200px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                & .dday {
                    background: #d4e2fc;
                    border-radius: 8px;
                    padding: 4px 8px;
                    color: #174291;
                    white-space: nowrap;
                }
                & .finish {
                    color: '#870F00';
                }
                & p {
                    margin-right: 16px;
                    font-weight: bold;
                    font-size: 18px;
                }
                & span {
                    font-weight: normal;
                    font-size: 18px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
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
            /* height: 198px; */

            & p {
                margin-top: 16px;
                font-size: 24px;
                /* line-height: 36px; */
                font-weight: 400;
            }
        }
        & .wordprogress {
            background-color: #fffaf0;
            & h3 {
                font-size: 24px;
                line-height: 28px;
                color: #bc8b2c;
                margin-bottom: 20px;
                @media (min-width: 600px) and (max-width: 990px) {
                    margin-bottom: 40px;
                }
            }

            & p {
                margin-top: 20px;
                color: #bc8b2c;
                font-weight: bold;
                font-size: 20px;
                text-align: center;
            }
            & h4 {
                padding-top: 60px;
                font-size: 20px;
                text-align: center;
                color: #bc8b2c;
            }
        }
        & .calendar {
            background-color: #aeffe0;
            & h3 {
                font-size: 24px;
                line-height: 28px;
                color: #008f58;
            }
            & .todolist {
                height: 120px;
                color: #008f58;
                overflow-y: hidden;
                & li {
                    padding-top: 10px;
                    font-size: 20px;
                }
                & p {
                    padding-top: 10px;
                }
            }
            & .gocalendar {
                /* margin-top: 0px; */
            }
        }
        & .optimer {
            overflow-x: auto;
            & h3 {
                font-size: 24px;
                line-height: 28px;
                color: '#000000';
            }
        }
    }
`;
const Item = styled.div``;

function Dashboard_1({ match, history }) {
    const [activedNum, setactiveNum] = useState('');
    // const [currentStudentData, setCurrentStudentData] = useState({});
    const urlSearchParams = new URLSearchParams(history.location.search);
    const queryUserId = urlSearchParams.get('user');
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
    const [todo, settodo] = useState([]);
    const [studentsData, setStudentsData] = useState([]);
    const [chart, setchart] = useState({
        series: [0],
        options: {
            chart: {
                type: 'radialBar',
                offsetY: -20,
                sparkline: {
                    enabled: true,
                },
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: '#e7e7e7',
                        strokeWidth: '97%',
                        margin: 5,
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2,
                        },
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            offsetY: -2,
                            fontSize: '22px',
                        },
                    },
                },
            },
            grid: {
                padding: {
                    top: -10,
                    width: '300px',
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    shadeIntensity: 0.4,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91],
                },
            },
            labels: ['WordProgress'],
        },
    });

    const [optimer, setoptimer] = useState({
        series: [
            {
                name: 'Optimer',
                data: [0, 0, 0, 0, 0, 0, 0],
            },
        ],
        options: {
            chart: {
                offsetY: -20,
                height: 350,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    borderRadius: 100,
                    dataLabels: {
                        position: 'top',
                    },
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + '분';
                },
                offsetY: -20,
                style: {
                    fontSize: '15px',
                    colors: ['black'],
                },
            },

            xaxis: {
                categories: ['월', '화', '수', '목', '금', '토', '일'],
                position: 'bottom',
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    fill: {
                        type: 'gradient',
                        gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        },
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
            yaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                },
            },
            title: {
                text: 'MY Study Time',
                floating: true,
                offsetY: 330,
                align: 'center',
                style: {
                    color: '#444',
                },
            },
        },
    });
    // 클래스 정보
    const [classInfo, setClassInfo] = useState({ class_code: '', class_day: '', name: '', description: '' });

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
            .then((result) => {})
            .catch((err) => console.log(err));

        // 클래스 정보 가져오기
        Axios.get(`${apiUrl}/classes/infos/${classNum}`, { withCredentials: true })
            .then((result) => {
                if (!result || !result.data) return;
                setClassInfo({ ...classInfo, ...result.data });
                // console.log(result.data);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        Axios.get(`${apiUrl}/assignment-actived/${num}`, { withCredentials: true })
            .then((result) => {
                // console.log(result.data);
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
            .then((result) => {
                // console.log(result.data);
                settotal(result.data);
                setchart({
                    ...chart,
                    series: [Math.ceil((result.data.progress / result.data.total) * 100)],
                });
            })

            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        Axios.get(`${apiUrl}/cam-study/all`, { withCredentials: true })
            .then((result) => {
                setroom(result.data);
            })
            .catch((err) => console.log(err));
    }, []);

    const [acmTotalFixsMine, setACMTotalFixsMine] = useState(0);
    const [acmTotalFixsAvg, setACMTotalFixsAvg] = useState(0);
    const [acmAvgSpeedFixsMine, setACMAvgSpeedFixsMine] = useState(0);
    const [acmAvgSpeedFixsAvg, setACMAvgSpeedFixsAvg] = useState(0);
    const [acmRegressionsMine, setACMRegressionsMine] = useState(0);
    const [acmRegressionsAvg, setACMRegressionsAvg] = useState(0);

    useEffect(() => {
        Axios.get(`${apiUrl}/calendar-events/my/${num}/current`, { withCredentials: true })
            .then((result) => {
                // console.log(result.data);
                settodo(result.data);
            })
            .catch((err) => console.log(err));

        Axios.get(`${apiUrl}/assignment-result/last-my-actived/${classNum}`, { withCredentials: true })
            .then((result) => {
                // console.log(result.data);
                Axios.get(`${apiUrl}/assignment-result/${result.data.actived_number}`, {
                    params: {
                        classNumber: classNum,
                    },
                    withCredentials: true,
                })
                    .then((result) => {
                        // console.log(result.data['curr'][0].);
                        setStudentsData(result.data['curr']);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                Axios.get(`${apiUrl}/optimer/${num}/${result.data.student_id}`, { withCredentials: true })
                    .then((result) => {
                        if (!result.data.time_mon) {
                            return;
                        }
                        setoptimer({
                            ...optimer,
                            series: [
                                {
                                    name: 'optimer',
                                    data: [
                                        Math.floor(result.data.time_mon / 60000),
                                        Math.floor(result.data.time_tue / 60000),
                                        Math.floor(result.data.time_wed / 60000),
                                        Math.floor(result.data.time_thu / 60000),
                                        Math.floor(result.data.time_fri / 60000),
                                        Math.floor(result.data.time_sat / 60000),
                                        Math.floor(result.data.time_sun / 60000),
                                    ],
                                },
                            ],
                        });
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (!studentsData || !studentsData.length) return;
        const currentStudentData = studentsData.filter((p) => p.student_id === sessions.authId)[0];
        setACMTotalFixsMine(currentStudentData.num_of_fixs);
        setACMAvgSpeedFixsMine(currentStudentData.avg_of_fix_vels);
        setACMRegressionsMine(currentStudentData.num_of_regs);

        // 학생들 데이터 합
        const totalEyeStatsSum = studentsData.reduce((a, b) => ({
            num_of_fixs: a.num_of_fixs + b.num_of_fixs,
            avg_of_fix_durs: a.avg_of_fix_durs + b.avg_of_fix_durs,
            avg_of_fix_vels: a.avg_of_fix_vels + b.avg_of_fix_vels,
            num_of_sacs: a.num_of_sacs + b.num_of_sacs,
            var_of_sac_vels: a.var_of_sac_vels + b.var_of_sac_vels,
            cluster_area: a.cluster_area + b.cluster_area,
            cluster_counts: a.cluster_counts + b.cluster_counts,
            num_of_regs: a.num_of_regs + b.num_of_regs,
        }));
        // 학생 평균 데이터
        const totalEyeStatsAvg = {};
        Object.keys(totalEyeStatsSum).forEach((name) => {
            totalEyeStatsAvg[name] = (totalEyeStatsSum[name] / studentsData.length) * 1.0;
        });

        setACMTotalFixsAvg(totalEyeStatsAvg.num_of_fixs.toFixed(0));
        setACMAvgSpeedFixsAvg(totalEyeStatsAvg.avg_of_fix_vels.toFixed(0));
        setACMRegressionsAvg(totalEyeStatsAvg.num_of_regs.toFixed(0));
    });
    // new Date(b.due_date).getTime - new Date(a.due_date).getTime;

    const newAssignment = assignment.sort(function (a, b) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
    // console.log(newAssignment);
    return (
        <>
            <BackgroundTheme color="#ffffff" />
            <Container>
                <div className="greeting">
                    <div className="left">
                        <svg width="71" height="47" viewBox="0 0 71 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M23.337 0.0335945C23.9963 -0.100785 24.3918 0.167979 24.5237 0.839887C24.6555 1.37741 24.3918 1.71337 23.7326 1.84775C18.8542 2.9228 14.8329 4.66976 11.6685 7.08863C8.63603 9.37312 7.11978 11.8592 7.11978 14.5468C7.11978 16.1594 7.64717 17.436 8.70195 18.3767C9.88858 19.3174 13.3825 20.4596 19.1838 21.8034C23.2711 22.8785 26.2377 24.4239 28.0836 26.4396C30.0613 28.4553 31.0501 31.0758 31.0501 34.3009C31.0501 37.9292 29.7976 40.9528 27.2925 43.3717C24.7874 45.7906 21.5571 47 17.6017 47C12.4596 47 8.24048 45.1858 4.94429 41.5575C1.6481 37.7948 0 33.0243 0 27.2459C0 20.258 2.04364 14.4124 6.13092 9.70907C10.35 5.00572 16.0854 1.78056 23.337 0.0335945ZM63.0891 0.0335945C63.7484 -0.100785 64.1439 0.167979 64.2758 0.839887C64.5395 1.37741 64.3417 1.71337 63.6824 1.84775C58.8041 2.9228 54.7827 4.66976 51.6184 7.08863C48.5859 9.37312 47.0696 11.8592 47.0696 14.5468C47.0696 16.1594 47.597 17.436 48.6518 18.3767C49.7066 19.3174 53.1346 20.4596 58.9359 21.8034C63.1551 22.8785 66.1875 24.4239 68.0334 26.4396C70.0111 28.4553 71 31.0758 71 34.3009C71 37.9292 69.7474 40.9528 67.2423 43.3717C64.7372 45.7906 61.507 47 57.5515 47C52.4095 47 48.1903 45.1187 44.8941 41.356C41.598 37.4589 39.9499 32.554 39.9499 26.6412C39.9499 19.7877 41.9935 14.0765 46.0808 9.5075C50.1681 4.93853 55.8375 1.78056 63.0891 0.0335945Z"
                                fill="#AEFFE0"
                            />
                        </svg>
                        <h2>{classInfo.name} 클래스 입니다.</h2>
                        <Dday classNum={num} />
                    </div>
                    <div className="right">
                        <img src={icon_image} alt="dashboard_icons"></img>
                    </div>
                </div>
                <div className="dashboard">
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} xl={4} sm={4}>
                                <Item>
                                    <div className="card lecture">
                                        <h3>강의실</h3>
                                        {meetingroom.length !== 0 ? (
                                            <>
                                                <p>현재 강의가 진행 중이니 입장해주세요 </p>
                                                <div className="gobutton">
                                                    <Link to={`/class/${num}/vid-lecture`}>
                                                        <Button fullWidth colors="purple" variant="filled">
                                                            강의실로 이동
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p>현재 진행중인 강의가 없습니다.</p>
                                                <div className="gobutton">
                                                    <Link to={`/class/${num}/vid-lecture`}>
                                                        <Button fullWidth colors="purple" variant="filled">
                                                            강의실로 이동
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xs={12} xl={4} sm={4}>
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
                                        <div className="gobutton">
                                            <Link to={`/class/${num}/cam-study`}>
                                                <Button colors="blue" fullWidth variant="filled">
                                                    캠 스터디 목록
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xs={12} xl={4} sm={4}>
                                <Item>
                                    <div className="card word">
                                        <h3>오늘의 단어</h3>
                                        {!word ? <h4>단어가 없습니다.</h4> : <h1 onClick={ClickCard}>{flip ? korean : word}</h1>}

                                        {word ? (
                                            <Link to={`/class/${num}/learning-vocas`}>
                                                <p>더 많은 단어 학습하기</p>
                                            </Link>
                                        ) : null}
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xs={12} xl={8} sm={8}>
                                <Item>
                                    <div className="card assignment">
                                        <h3>과제 현황</h3>
                                        {assignment.length !== 0 ? (
                                            newAssignment.slice(0, 3).map((data, index) => {
                                                return (
                                                    <div key={index} className="info">
                                                        {Math.ceil(
                                                            (new Date(data.due_date).getTime() - today.getTime()) / (1000 * 3600 * 24),
                                                        ) > 0 ? (
                                                            <>
                                                                {Math.ceil(
                                                                    (today.getTime() - new Date(data.due_date).getTime()) /
                                                                        (1000 * 3600 * 24),
                                                                ) == 0 ? (
                                                                    <>
                                                                        <p
                                                                            style={{ color: '#870F00', backgroundColor: '#FED7D2' }}
                                                                            className="dday"
                                                                        >
                                                                            D - day
                                                                        </p>
                                                                        <Link to={`/class/${num}/share`}>
                                                                            <p className="assign_title">{data.title}</p>
                                                                        </Link>

                                                                        <p>
                                                                            <span>{data.description}</span>
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <p className="dday">
                                                                            D
                                                                            {Math.ceil(
                                                                                (today.getTime() - new Date(data.due_date).getTime()) /
                                                                                    (1000 * 3600 * 24),
                                                                            )}
                                                                        </p>
                                                                        <Link to={`/class/${num}/share`}>
                                                                            <p className="assign_title">{data.title}</p>
                                                                        </Link>

                                                                        <p>
                                                                            <span>{data.description}</span>
                                                                        </p>
                                                                    </>
                                                                )}
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
                                        {/* <h3>마감된 과제 </h3> */}
                                        {/* {assignment.length !== 0
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
                                            : null} */}
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xl={4} xs={12} sm={4}>
                                <Item>
                                    <div className="card wordprogress">
                                        <h3>단어 진행률</h3>
                                        {!total.total ? (
                                            <h4>저장된 단어가 없습니다.</h4>
                                        ) : (
                                            <>
                                                <ReactApexChart
                                                    options={chart.options}
                                                    series={chart.series}
                                                    type="radialBar"
                                                    height={200}
                                                />
                                                <p>
                                                    {total.progress}/{total.total}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xl={8} xs={12} sm={8}>
                                <Item>
                                    <div className="card comment">
                                        <svg width="71" height="47" viewBox="0 0 71 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M23.337 0.0335945C23.9963 -0.100785 24.3918 0.167979 24.5237 0.839887C24.6555 1.37741 24.3918 1.71337 23.7326 1.84775C18.8542 2.9228 14.8329 4.66976 11.6685 7.08863C8.63603 9.37312 7.11978 11.8592 7.11978 14.5468C7.11978 16.1594 7.64717 17.436 8.70195 18.3767C9.88858 19.3174 13.3825 20.4596 19.1838 21.8034C23.2711 22.8785 26.2377 24.4239 28.0836 26.4396C30.0613 28.4553 31.0501 31.0758 31.0501 34.3009C31.0501 37.9292 29.7976 40.9528 27.2925 43.3717C24.7874 45.7906 21.5571 47 17.6017 47C12.4596 47 8.24048 45.1858 4.94429 41.5575C1.6481 37.7948 0 33.0243 0 27.2459C0 20.258 2.04364 14.4124 6.13092 9.70907C10.35 5.00572 16.0854 1.78056 23.337 0.0335945ZM63.0891 0.0335945C63.7484 -0.100785 64.1439 0.167979 64.2758 0.839887C64.5395 1.37741 64.3417 1.71337 63.6824 1.84775C58.8041 2.9228 54.7827 4.66976 51.6184 7.08863C48.5859 9.37312 47.0696 11.8592 47.0696 14.5468C47.0696 16.1594 47.597 17.436 48.6518 18.3767C49.7066 19.3174 53.1346 20.4596 58.9359 21.8034C63.1551 22.8785 66.1875 24.4239 68.0334 26.4396C70.0111 28.4553 71 31.0758 71 34.3009C71 37.9292 69.7474 40.9528 67.2423 43.3717C64.7372 45.7906 61.507 47 57.5515 47C52.4095 47 48.1903 45.1187 44.8941 41.356C41.598 37.4589 39.9499 32.554 39.9499 26.6412C39.9499 19.7877 41.9935 14.0765 46.0808 9.5075C50.1681 4.93853 55.8375 1.78056 63.0891 0.0335945Z"
                                                fill="#9AA5AF"
                                            />
                                        </svg>
                                        <div style={{ marginTop: '35px' }} className="AutoComment">
                                            {/* {MakeAutoComments(
                                                sessions.userName,
                                                acmTotalFixsMine,
                                                acmTotalFixsAvg,
                                                acmAvgSpeedFixsMine,
                                                acmAvgSpeedFixsAvg,
                                                acmRegressionsMine,
                                                acmRegressionsAvg,
                                            )} */}
                                            {acmTotalFixsMine === 0 ? (
                                                <p>최근 풀이한 과제가 존재하지 않거나 제대로 된 측정이 이루어지지 않았습니다.</p>
                                            ) : (
                                                MakeAutoComments(
                                                    sessions.userName,
                                                    acmTotalFixsMine,
                                                    acmTotalFixsAvg,
                                                    acmAvgSpeedFixsMine,
                                                    acmAvgSpeedFixsAvg,
                                                    acmRegressionsMine,
                                                    acmRegressionsAvg,
                                                )
                                            )}
                                            {/* {console.log(acmTotalFixsMine)} */}
                                        </div>
                                    </div>
                                </Item>
                            </Grid>
                            <Grid item xs={12} xl={4} sm={4}>
                                <div className="card calendar">
                                    <h3>오늘의 일정</h3>

                                    {todo.length == 0 ? (
                                        <div className="todolist">
                                            <p>오늘의 일정이 없습니다.</p>
                                        </div>
                                    ) : (
                                        <div className="todolist">
                                            {todo.slice(0, 3).map((result, index) => {
                                                return (
                                                    <ul key={index}>
                                                        <li>{result.title}</li>
                                                    </ul>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <div className="gocalendar">
                                        <Link to={`/class/${num}/calendar`}>
                                            <Button fullWidth variant="filled" colors="green">
                                                나의 일정 보러가기
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div className="card optimer">
                                    <h3>나의 학습 시간</h3>
                                    {!sessions ? null : (
                                        <ReactApexChart
                                            style={{ overflow: 'hidden' }}
                                            options={optimer.options}
                                            series={optimer.series}
                                            type="bar"
                                            height={300}
                                        />
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </Container>
        </>
    );
}

export default Dashboard_1;
