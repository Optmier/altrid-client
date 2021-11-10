import React from 'react';
import icon_image from '../../images/dashboard_icon.png';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Dday from '../../pages/Dday';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Footer from './Footer';
import HeaderBar from './HeaderBar';

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
            min-height: 248px;
            border-radius: 32px;
            background: #f6f8f9;
        }
        & .lecture {
            background: #f4f1fa;
        }
        & .word {
            background: #fff3ef;
        }
        & .comment {
            background: #ffffff;
            border: 1px solid #bfc6cd;
            background: #ffffff;
            height: 198px;
        }
    }
`;
const Item = styled.div``;

function Dashboard_1() {
    const sessions = useSelector((state) => state.RdxSessions);

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
                        <Dday />
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
                                    <div className="card lecture"></div>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>
                                    <div className="card"></div>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>
                                    <div className="card word"></div>
                                </Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>
                                    <div className="card"></div>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>
                                    <div className="card"></div>
                                </Item>
                            </Grid>
                            <Grid item xs={12}>
                                <Item>
                                    <div className="card comment"></div>
                                </Item>
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
