import React, { useState, useEffect } from 'react';
import '../../styles/price_details_page.scss';
import Radio from '@material-ui/core/Radio';
import PriceData from '../../datas/PriceData.json';
import MenuData from '../../datas/MenuData.json';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import HeaderBar from '../essentials/HeaderBar';
import { useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import styled from 'styled-components';
import classNames from 'classnames';
import ChannelService from '../ChannelIO/ChannelService';

const StyleDialog = styled.div`
    background-color: #6d2afa;
    padding: 40px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;

    & .header {
        margin-bottom: 16px;
        display: flex;
        justify-content: center;
        align-items: center;

        & .header-text {
            font-size: 29px;
            font-weight: 600;
            color: #00ffaf;
            & svg {
                margin-right: 16px;
            }
        }
        & .header2 {
            font-size: 26px;
            font-weight: 500;
            color: white;
            margin-left: 16px;

            & span {
                color: #00ffaf;
            }
        }
    }

    & .desc {
        font-size: 17px;
        font-weight: 400;
        color: white;
        display: flex;
        justify-content: center;
        margin-bottom: 45px;
    }
    & .cards {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 50px;

        & .card {
            border-radius: 11px;
            display: flex;
            flex-direction: column;
            padding: 24px;
            width: 32.5%;
            box-sizing: border-box;
            min-height: 255px;
            background-color: white;
            box-shadow: #cdcdcd55 0px 12px 46px 0px;
            & .card-header.Step1 {
                background-color: #20e3a4;
            }
            & .card-header.Step2 {
                background-color: #3c1888;
            }
            & .card-header.Step3 {
                background-color: #32715d;
            }
            & .card-header {
                font-size: 18px;
                font-weight: 600;
                color: white;
                border-radius: 18px;
                margin-bottom: 28px;
                padding: 8px 23px;
                width: fit-content;
            }
            & .card-title {
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 20px;
                color: #908c8c;
            }
            & .card-desc {
                font-size: 16px;
                font-weight: 500;
                color: black;
                margin-bottom: 20px;
            }
            & .card-footer {
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                color: #20e3a4;
                text-align: right;
                & svg {
                    margin-left: 8px;
                }
            }
        }
    }
    & .personal-button {
        width: 280px;
        justify-content: center;
        background-color: #3c1888;
        color: white;
        font-size: 1rem;
        padding: 1rem 1.2rem;
        border-radius: 11px;
        box-shadow: #cdcdcd21 0px 12px 46px 0px;
        display: flex;
        align-items: center;
        & svg {
            margin-left: 8px;
        }
    }
`;
const groupStepDatas = {
    'Step 1': {
        title: '학원 소비자 신청',
        desc: '카카오톡 1대1 상담을 통해 교습소, 학원, 기관 사업자 등록증 전달',
    },
    'Step 2': {
        title: '학원 소비자 확인',
        desc: '사업자 등록증에 명시된 학원업, 온라인 학원업 등 교육관련 업종 확인',
    },
    'Step 3': {
        title: '할인 진행',
        desc: '견적서 발행 및 계약 진행  후, 서비스 플랜 별 할인 진행',
    },
};

function PriceDetails({ location, history }) {
    const sessions = useSelector((state) => state.RdxSessions);

    const [priceState, setPriceState] = useState('personal');
    const [academyApproved, setAcademyApproved] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogPlan, setDialogPlan] = useState();

    const handleChange = (event) => {
        setPriceState(event.target.value);
    };
    const handleDialogOpen = (plan) => {
        setDialogOpen(true);
        setDialogPlan(plan);
    };
    const handleDialogClose = (value) => {
        setDialogOpen(false);
    };

    const goToPayments = (e) => {
        if (academyApproved) {
            history.push(`/payment?type=${e.target.name}`);
        } else {
            handleDialogOpen(e.target.name);
        }
    };

    useEffect(() => {
        sessions.academyApproved ? setAcademyApproved(true) : setAcademyApproved(false);
    }, [sessions]);

    return (
        <>
            <Dialog onClose={handleDialogClose} aria-labelledby="simple-dialog-title" fullWidth={true} maxWidth="md" open={dialogOpen}>
                <StyleDialog>
                    <div className="header">
                        <div className="header-text">
                            <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M7.63636 14.4545L1.90909 8.72727L0 10.6364L7.63636 18.2727L24 1.90909L22.0909 0L7.63636 14.4545Z"
                                    fill="#00E09C"
                                />
                            </svg>
                            잠깐 !
                        </div>
                        <div className="header2">
                            혹시, <span>학원 소비자</span>이신가요?
                        </div>
                    </div>

                    <div className="desc">학원 소비자의 경우, 할인된 가격으로 서비스 구독이 가능합니다.</div>
                    <div className="cards">
                        {Object.keys(groupStepDatas).map((i) => (
                            <div key={i} className="card">
                                <div className={classNames('card-header', i.replace(/(\s*)/g, ''))}>{i}</div>
                                <div className="card-title">{groupStepDatas[i]['title']}</div>
                                <div className="card-desc">{groupStepDatas[i]['desc']}</div>
                                {i === 'Step 1' ? (
                                    <div
                                        className="card-footer"
                                        onClick={() => {
                                            ChannelService.showMessenger();
                                        }}
                                    >
                                        학원 소비자 신청
                                        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M0 8.5749L3.7085 4.8583L0 1.1417L1.1417 0L6 4.8583L1.1417 9.7166L0 8.5749Z"
                                                fill="#20e3a4"
                                            />
                                        </svg>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                    <button className="personal-button" onClick={() => history.push(`/payment?type=${dialogPlan}`)}>
                        아니요, 개인소비자 이용하기
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.59009 16.59L13.1701 12L8.59009 7.41L10.0001 6L16.0001 12L10.0001 18L8.59009 16.59Z"
                                fill="white"
                            ></path>
                        </svg>
                    </button>
                </StyleDialog>
            </Dialog>

            <HeaderBar defaultColor="white" />

            <div className="price-detail-root">
                <div className="price-nav">
                    <div className="nav-left" id={'color-' + queryString.parse(location.search).plan}>
                        {queryString.parse(location.search).plan}
                    </div>
                    <div className="nav-right">
                        <button
                            onClick={goToPayments}
                            name={queryString.parse(location.search).plan}
                            id={'backcolor-' + queryString.parse(location.search).plan}
                        >
                            결제하기
                            <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.526855 12.6637L7.20602 7.5L0.526855 2.33625L2.5831 0.75L11.3331 7.5L2.5831 14.25L0.526855 12.6637Z"
                                    fill="white"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="price-wrapper">
                    <div className="price-header">
                        <div className="header-top">
                            <div className="top-left">
                                {MenuData[queryString.parse(location.search).plan]['price']}
                                <span id="small">원</span>
                            </div>
                            <div className="top-right">
                                <div>
                                    <Radio
                                        checked={priceState === 'personal'}
                                        onChange={handleChange}
                                        value="personal"
                                        color="default"
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': 'personal' }}
                                        size="small"
                                    />
                                    개인
                                </div>

                                <div>
                                    <Radio
                                        checked={priceState === 'group'}
                                        onChange={handleChange}
                                        value="group"
                                        color="default"
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': 'group' }}
                                        size="small"
                                    />
                                    학원
                                </div>
                            </div>
                        </div>
                        <div className="header-bottom" id={'color-' + queryString.parse(location.search).plan}>
                            {MenuData[queryString.parse(location.search).plan]['discount_' + priceState]}
                            <span id="small">원</span>
                            <span className="price-info" id="small">
                                (학생당/월)
                            </span>
                        </div>
                    </div>
                    <div className="price-table">
                        {Object.keys(PriceData[queryString.parse(location.search).plan]).map((i, idx) =>
                            i[0] === 'h' ? (
                                <div key={idx} className="price-row-header">
                                    <div className="header-hr"></div>
                                    <div className="header">{PriceData[queryString.parse(location.search).plan][i]}</div>
                                </div>
                            ) : (
                                <div key={idx} className="price-row">
                                    <div className="row-title">{i}</div>
                                    <div className="row-content">
                                        {PriceData[queryString.parse(location.search).plan][i] === 1 ? (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M8.99991 16.1698L4.82991 11.9998L3.40991 13.4098L8.99991 18.9998L20.9999 6.99984L19.5899 5.58984L8.99991 16.1698Z"
                                                    fill="#3B168A"
                                                />
                                            </svg>
                                        ) : PriceData[queryString.parse(location.search).plan][i] === '-' ? (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15 12.5H5V11H15V12.5Z" fill="#949494" />
                                            </svg>
                                        ) : (
                                            PriceData[queryString.parse(location.search).plan][i]
                                        )}
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default withRouter(PriceDetails);
