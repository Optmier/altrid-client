import React, { useState, useEffect, useRef } from 'react';
import HeaderBar from '../components/essentials/HeaderBar';
import { Element } from 'react-scroll';
import { Drawer, Divider, Button } from '@material-ui/core';
import '../styles/main_page.scss';
import CardRoot from '../components/essentials/CardRoot';
import CardLists from '../components/essentials/CardLists';
import CardAddNew from '../components/essentials/CardAddNew';
import CardEntry from '../components/MainPage/CardEntry';
import CreateNewEntry from '../components/MainPage/CreateNewEntry';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import Footer from '../components/essentials/Footer';
import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import { useSelector, useDispatch } from 'react-redux';
import AddClass from '../components/MainPage/AddClass';
import classNames from 'classnames';
import { $_classDefault } from '../configs/front_urls';
import moment from 'moment';
import ClassWrapper from '../components/essentials/ClassWrapper';
import { IoIosArrowForward } from 'react-icons/io';
import isMobile from '../controllers/isMobile';
import { makeStyles } from '@material-ui/core/styles';
import BackdropComponent2 from '../components/essentials/BackdropComponent2';
import icon_image from '../images/mainclass_icon.png';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AccountPopOver from '../components/essentials/AccountPopOver';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Item = styled.div``;

const HeaderSection = styled.header``;
const MainSection = styled.main``;
const FooterSection = styled.footer``;

const MainHeader = styled.div`
    margin-top: 24px;
    margin-bottom: 24px;
    max-width: 1216px;
    margin: auto;

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
            cursor: pointer;

            & a {
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
    }
`;

const CardSection = styled.div`
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';

    max-width: 1216px;
    margin: 0 auto;
    margin-top: 24px;
    margin-bottom: 24px;

    & .card {
        & .Add-Class {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            & p {
                color: #3b1689;
                font-size: 24px;
                font-weight: 700;
                margin-top: 14px;
            }
        }
        & .cards:hover {
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
            transition: 0.2s;
        }
        & .cards {
            cursor: pointer;
            min-height: 248px;
            border-radius: 32px;
            background: #f4f1fa;
            color: #200656;
            padding: 0 32px;
            padding-top: 32px;

            & .day {
                font-size: 12px;

                font-weight: 700;
                height: 24px;
            }
            & .name {
                font-size: 24px;
                line-height: 28px;
                margin-top: 20px;
                font-weight: 700;
            }
            & .description {
                height: 45px;
                margin-top: 8px;
                font-size: 18px;
                line-height: 22px;
                font-weight: 700;
            }
            & .card-info {
                width: 170px;
                align-items: center;
                height: 24px;
                margin-top: 50px;
                font-size: 18px;
                line-height: 22px;
                font-weight: 700;
                display: flex;
                & .teacher {
                    margin: 0 8px;
                }
                & .member {
                    margin: 0 8px;
                }
                & .assignment_num {
                    margin: 0 8px;
                }
            }
        }
    }
`;

const Info = styled.div`
    max-width: 1216px;
    margin: 0 auto;
    margin-top: 32px;

    & .Info-total {
        margin-bottom: 80px;
        padding: 36px 40px;
        display: flex;
        align-items: center;

        height: 124px;
        background: #f6f8f9;
        border: 1px solid #bfc6cd;
        box-sizing: border-box;
        border-radius: 32px;
        & span {
            margin-right: 6px;
        }
        & .Info-Word {
            margin-left: 23px;
            & .Info-Top {
                font-weight: bold;
                font-size: 24px;
                line-height: 28px;
                letter-spacing: -0.02em;
            }
            & .Info-Bottom {
                font-size: 18px;
                line-height: 22px;
                letter-spacing: -0.02em;
                margin-top: 8px;
            }
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        '@media (min-width: 0) and (max-width: 662px)': {
            width: '100%',
        },
    },
}));

function Main({ history }) {
    const classes = useStyles();
    const testRef = useRef();
    const sessions = useSelector((state) => state.RdxSessions);

    const [backdropOpen, setBackdropOpen] = useState(false);
    const [openCreateNewDrawer, setOpenCreateNewDrawer] = useState(false);
    const [openAddTeacher, setOpenAddTeacher] = useState(false);
    const [cardDatas, setCardDatas] = useState([]);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenCreateNewDrawer(open);
    };
    const toggleAddTeacherDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenAddTeacher(open);
    };

    const handleLogout = () => {
        window.logout();
    };

    const fetchCardData = () => {
        Axios.get(`${apiUrl}/classes/current`, { withCredentials: true })
            .then((res) => {
                setCardDatas(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setBackdropOpen(false);
            });
    };

    useEffect(() => {
        setBackdropOpen(true);
        fetchCardData();
    }, []);

    return (
        <>
            <Helmet>
                <style>{`
                    main#main {
                        background-color: #ffffff;
                    }
            `}</style>
            </Helmet>
            <Drawer
                anchor="right"
                open={openCreateNewDrawer}
                onClose={toggleDrawer(false)}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <CreateNewEntry history={history} handleClose={toggleDrawer(false)} />
            </Drawer>

            <Drawer
                anchor="right"
                open={openAddTeacher}
                onClose={toggleAddTeacherDrawer(false)}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <AddClass handleClose={toggleAddTeacherDrawer(false)} />
            </Drawer>
            <HeaderSection>
                <HeaderBar />
            </HeaderSection>
            <MainSection>
                <MainHeader>
                    <div className="greeting">
                        <div className="left">
                            <svg width="71" height="47" viewBox="0 0 71 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M23.337 0.0335945C23.9963 -0.100785 24.3918 0.167979 24.5237 0.839887C24.6555 1.37741 24.3918 1.71337 23.7326 1.84775C18.8542 2.9228 14.8329 4.66976 11.6685 7.08863C8.63603 9.37312 7.11978 11.8592 7.11978 14.5468C7.11978 16.1594 7.64717 17.436 8.70195 18.3767C9.88858 19.3174 13.3825 20.4596 19.1838 21.8034C23.2711 22.8785 26.2377 24.4239 28.0836 26.4396C30.0613 28.4553 31.0501 31.0758 31.0501 34.3009C31.0501 37.9292 29.7976 40.9528 27.2925 43.3717C24.7874 45.7906 21.5571 47 17.6017 47C12.4596 47 8.24048 45.1858 4.94429 41.5575C1.6481 37.7948 0 33.0243 0 27.2459C0 20.258 2.04364 14.4124 6.13092 9.70907C10.35 5.00572 16.0854 1.78056 23.337 0.0335945ZM63.0891 0.0335945C63.7484 -0.100785 64.1439 0.167979 64.2758 0.839887C64.5395 1.37741 64.3417 1.71337 63.6824 1.84775C58.8041 2.9228 54.7827 4.66976 51.6184 7.08863C48.5859 9.37312 47.0696 11.8592 47.0696 14.5468C47.0696 16.1594 47.597 17.436 48.6518 18.3767C49.7066 19.3174 53.1346 20.4596 58.9359 21.8034C63.1551 22.8785 66.1875 24.4239 68.0334 26.4396C70.0111 28.4553 71 31.0758 71 34.3009C71 37.9292 69.7474 40.9528 67.2423 43.3717C64.7372 45.7906 61.507 47 57.5515 47C52.4095 47 48.1903 45.1187 44.8941 41.356C41.598 37.4589 39.9499 32.554 39.9499 26.6412C39.9499 19.7877 41.9935 14.0765 46.0808 9.5075C50.1681 4.93853 55.8375 1.78056 63.0891 0.0335945Z"
                                    fill="#AEFFE0"
                                />
                            </svg>
                            {sessions.userType === 'teachers' ? (
                                <h2>반갑습니다 {sessions.userName} 선생님</h2>
                            ) : (
                                <h2>반갑습니다 {sessions.userName} 학생</h2>
                            )}
                        </div>
                        <div className="right">
                            <img width="339px" height="260px" src={icon_image} alt="dashboard_icons"></img>
                        </div>
                    </div>

                    <h3>{sessions.userName}님의 클래스 </h3>
                </MainHeader>

                <CardSection>
                    <div className="card">
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={4}>
                                    <Item>
                                        {sessions.userType === 'teachers' ? (
                                            <div onClick={toggleDrawer(true)} className="cards Add-Class">
                                                <svg
                                                    width="36"
                                                    height="36"
                                                    viewBox="0 0 36 36"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M2 0H34C34.5304 0 35.0391 0.210714 35.4142 0.585786C35.7893 0.960859 36 1.46957 36 2V34C36 34.5304 35.7893 35.0391 35.4142 35.4142C35.0391 35.7893 34.5304 36 34 36H2C1.46957 36 0.960859 35.7893 0.585786 35.4142C0.210714 35.0391 0 34.5304 0 34V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0ZM16 16H8V20H16V28H20V20H28V16H20V8H16V16Z"
                                                        fill="#957FCE"
                                                    />
                                                </svg>

                                                <p> 클래스 생성 </p>
                                            </div>
                                        ) : (
                                            <div onClick={toggleAddTeacherDrawer(true)} className="cards Add-Class">
                                                <svg
                                                    width="36"
                                                    height="36"
                                                    viewBox="0 0 36 36"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M2 0H34C34.5304 0 35.0391 0.210714 35.4142 0.585786C35.7893 0.960859 36 1.46957 36 2V34C36 34.5304 35.7893 35.0391 35.4142 35.4142C35.0391 35.7893 34.5304 36 34 36H2C1.46957 36 0.960859 35.7893 0.585786 35.4142C0.210714 35.0391 0 34.5304 0 34V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0ZM16 16H8V20H16V28H20V20H28V16H20V8H16V16Z"
                                                        fill="#957FCE"
                                                    />
                                                </svg>

                                                <p> 클래스 입장 </p>
                                            </div>
                                        )}
                                    </Item>
                                </Grid>

                                {cardDatas.map(
                                    ({ idx, name, class_count, max_due_date, description, class_day, teacher_name, num_of_students }) => (
                                        <Grid key={idx} item xs={4}>
                                            <Item
                                                onClick={() => {
                                                    sessions.userType === 'students'
                                                        ? history.push(`/${idx}/dashboard`)
                                                        : history.push(`${$_classDefault}/${idx}/share`);
                                                }}
                                            >
                                                <div key={idx} className="cards">
                                                    <div className="day">{class_day.replace(/,/g, ' ')}</div>
                                                    <div className="name">{name}</div>
                                                    <div className="description">{description}</div>
                                                    <div className="card-info">
                                                        <div className="teacher">{teacher_name}</div>

                                                        <svg
                                                            width="1"
                                                            height="8"
                                                            viewBox="0 0 1 8"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <line x1="0.5" y1="2.18557e-08" x2="0.5" y2="8" stroke="#E3DDF2" />
                                                        </svg>
                                                        <div className="member">
                                                            <svg
                                                                width="15"
                                                                height="15"
                                                                viewBox="0 0 15 15"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M0.333008 14.6665C0.333008 13.252 0.894911 11.8955 1.89511 10.8953C2.8953 9.89507 4.25185 9.33317 5.66634 9.33317C7.08083 9.33317 8.43738 9.89507 9.43758 10.8953C10.4378 11.8955 10.9997 13.252 10.9997 14.6665H0.333008ZM5.66634 8.6665C3.45634 8.6665 1.66634 6.8765 1.66634 4.6665C1.66634 2.4565 3.45634 0.666504 5.66634 0.666504C7.87634 0.666504 9.66634 2.4565 9.66634 4.6665C9.66634 6.8765 7.87634 8.6665 5.66634 8.6665ZM10.575 10.1552C11.5948 10.4173 12.5059 10.9944 13.1786 11.8044C13.8513 12.6144 14.2513 13.616 14.3217 14.6665H12.333C12.333 12.9265 11.6663 11.3425 10.575 10.1552ZM9.22634 8.63784C9.78501 8.13815 10.2318 7.52606 10.5374 6.84167C10.843 6.15727 11.0005 5.41603 10.9997 4.6665C11.0011 3.75548 10.7681 2.85942 10.323 2.0645C11.0781 2.21623 11.7573 2.62475 12.2453 3.22063C12.7333 3.81652 12.9998 4.56299 12.9997 5.33317C12.9999 5.80815 12.8985 6.27768 12.7024 6.71029C12.5063 7.1429 12.22 7.5286 11.8627 7.84153C11.5054 8.15447 11.0853 8.38741 10.6306 8.52475C10.1759 8.66208 9.69715 8.70064 9.22634 8.63784Z"
                                                                    fill="#200656"
                                                                />
                                                            </svg>
                                                            &nbsp;{num_of_students}
                                                        </div>

                                                        <svg
                                                            width="1"
                                                            height="8"
                                                            viewBox="0 0 1 8"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <line x1="0.5" y1="2.18557e-08" x2="0.5" y2="8" stroke="#E3DDF2" />
                                                        </svg>
                                                        <div className="assignment_num">
                                                            <svg
                                                                width="14"
                                                                height="14"
                                                                viewBox="0 0 14 14"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M2.00033 9.00016V1.00016C2.00033 0.823352 2.07056 0.653782 2.19559 0.528758C2.32061 0.403734 2.49018 0.333496 2.66699 0.333496H13.3337C13.5105 0.333496 13.68 0.403734 13.8051 0.528758C13.9301 0.653782 14.0003 0.823352 14.0003 1.00016V11.6668C14.0003 12.1973 13.7896 12.706 13.4145 13.081C13.0395 13.4561 12.5308 13.6668 12.0003 13.6668H2.66699C2.13656 13.6668 1.62785 13.4561 1.25278 13.081C0.877706 12.706 0.666992 12.1973 0.666992 11.6668V10.3335H11.3337V11.6668C11.3337 11.8436 11.4039 12.0132 11.5289 12.1382C11.6539 12.2633 11.8235 12.3335 12.0003 12.3335C12.1771 12.3335 12.3467 12.2633 12.4717 12.1382C12.5968 12.0132 12.667 11.8436 12.667 11.6668V9.00016H2.00033Z"
                                                                    fill="#200656"
                                                                />
                                                            </svg>
                                                            &nbsp;{class_count}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Item>
                                        </Grid>
                                    ),
                                )}
                            </Grid>
                        </Box>
                    </div>
                </CardSection>
                <Info>
                    {sessions.userType === 'students' ? (
                        <>
                            <div className="Info-total">
                                <div className="Info-icon">
                                    <svg width="33" height="42" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.35941 31.9999C7.75949 29.4539 5.05278 27.3719 3.94181 25.9999C2.03942 23.6465 0.84717 20.8089 0.5024 17.8139C0.157631 14.8189 0.674369 11.7884 1.99309 9.07144C3.31181 6.35451 5.37886 4.0617 7.95614 2.45712C10.5334 0.852537 13.5161 0.00147064 16.5605 0.00195333C19.6049 0.00243602 22.5873 0.854449 25.1641 2.45984C27.7408 4.06524 29.8071 6.35871 31.125 9.07606C32.4428 11.7934 32.9586 14.8241 32.6128 17.819C32.2671 20.8139 31.0739 23.6511 29.1708 26.0039C28.0598 27.3739 25.3572 29.4559 24.7572 31.9999H8.35739H8.35941ZM24.6381 35.9999V37.9999C24.6381 39.0608 24.2124 40.0782 23.4548 40.8284C22.6972 41.5785 21.6696 41.9999 20.5982 41.9999H12.5185C11.447 41.9999 10.4195 41.5785 9.66183 40.8284C8.90421 40.0782 8.47858 39.0608 8.47858 37.9999V35.9999H24.6381ZM18.5783 16.0099V7.99995L9.48855 20.0099H14.5384V28.0099L23.6281 16.0099H18.5783Z"
                                            fill="#2D3843"
                                        />
                                    </svg>
                                </div>
                                <div className="Info-Word">
                                    <div className="Info-Top">서비스 관련 궁금하신 점이 있으신가요?</div>
                                    <div className="Info-Bottom">1대 1 바로 상담을 원하는 경우에는 우하단 물음표 버튼을 클릭해주세요.</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="Info-total">
                                <div className="Info-icon">
                                    <svg width="33" height="42" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.35941 31.9999C7.75949 29.4539 5.05278 27.3719 3.94181 25.9999C2.03942 23.6465 0.84717 20.8089 0.5024 17.8139C0.157631 14.8189 0.674369 11.7884 1.99309 9.07144C3.31181 6.35451 5.37886 4.0617 7.95614 2.45712C10.5334 0.852537 13.5161 0.00147064 16.5605 0.00195333C19.6049 0.00243602 22.5873 0.854449 25.1641 2.45984C27.7408 4.06524 29.8071 6.35871 31.125 9.07606C32.4428 11.7934 32.9586 14.8241 32.6128 17.819C32.2671 20.8139 31.0739 23.6511 29.1708 26.0039C28.0598 27.3739 25.3572 29.4559 24.7572 31.9999H8.35739H8.35941ZM24.6381 35.9999V37.9999C24.6381 39.0608 24.2124 40.0782 23.4548 40.8284C22.6972 41.5785 21.6696 41.9999 20.5982 41.9999H12.5185C11.447 41.9999 10.4195 41.5785 9.66183 40.8284C8.90421 40.0782 8.47858 39.0608 8.47858 37.9999V35.9999H24.6381ZM18.5783 16.0099V7.99995L9.48855 20.0099H14.5384V28.0099L23.6281 16.0099H18.5783Z"
                                            fill="#2D3843"
                                        />
                                    </svg>
                                </div>
                                <div className="Info-Word">
                                    <div className="Info-Top">알트리드는 문제 풀이 중 모든 것을 관찰하고 기록합니다.</div>
                                    <div className="Info-Bottom">
                                        시선흐름 추적 기술과 문제 패턴 데이터 수집을 통해 맞춤형 리포트를 제공합니다.
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </Info>
            </MainSection>

            {isMobile ? null : (
                <FooterSection>
                    <Footer />
                </FooterSection>
            )}
        </>
    );
}

export default Main;
