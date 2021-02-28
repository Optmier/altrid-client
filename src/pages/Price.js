import React, { useState, useEffect } from 'react';
import '../styles/price_page.scss';
import styled from 'styled-components';
import PriceData from '../datas/PriceData.json';
import MenuData from '../datas/MenuData.json';
import Radio from '@material-ui/core/Radio';
import { Link, withRouter } from 'react-router-dom';
import ClassWrapper from '../components/essentials/ClassWrapper';
import HeaderBar from '../components/essentials/HeaderBar';
import { useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import classNames from 'classnames';
import ChannelService from '../components/ChannelIO/ChannelService';

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
const BadgeButton = styled.a`
    background-color: ${(props) => (props.type === 'group' ? '#3b168a' : 'white')};
    color: ${(props) => (props.type === 'group' ? 'white' : '#1d3853')};
    cursor: pointer;
    width: 510px;
    padding: 0.8rem 1.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 11px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.11);
    transition: all 0.3s;
    & .badge-left {
        display: flex;
        align-items: center;

        & p {
            padding-left: 1rem;
            font-size: 0.875rem;
            font-weight: 600;
        }
    }
    & .badge-right {
        display: flex;
        align-items: center;

        & p {
            padding-right: 1rem;
            font-size: 0.7rem;
            font-weight: 400;
            color: $fistColor;
        }
    }

    &:hover {
        & .badge-right {
            transition: all 0.5s;
            margin-right: -5px;
        }
    }

    @media (min-width: 0px) and (max-width: 768px) {
        & {
            width: 100%;
            box-sizing: border-box;
            & .badge-left {
                width: 85%;
            }
            & .badge-right {
                & > p {
                    display: none;
                }
            }
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

function Price({ history }) {
    const sessions = useSelector((state) => state.RdxSessions);

    const [priceState, setPriceState] = useState('personal');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogPlan, setDialogPlan] = useState();
    const [academyApproved, setAcademyApproved] = useState(false);

    const handleChange = (event) => {
        setPriceState(event.target.value);
    };

    const goToPayments = (e) => {
        if (academyApproved) {
            history.push(`/payment?type=${e.target.name}`);
        } else {
            handleDialogOpen(e.target.name);
        }
    };

    const handleDialogOpen = (plan) => {
        setDialogOpen(true);
        setDialogPlan(plan);
    };

    const handleDialogClose = (value) => {
        setDialogOpen(false);
    };

    const convertPriceString = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
            <HeaderBar />
            <div className="price-root">
                <div className="price_section_header">
                    <ClassWrapper col="none" type="main_page">
                        <div className="wrapper">
                            <div className="header-text">
                                무료버전으로 시작하고,
                                <br />
                                학원 성장을 경험해보세요.
                            </div>
                            <div className="desc-text">
                                베타 기간 한정, 모든 기능에 대하여 <br />
                                할인된 가격으로 제공해드립니다.
                            </div>
                            {/* <div className="header-btn">
                                <button name="Free" onClick={goToPayments}>
                                    무료 체험하기
                                </button>
                            </div> */}
                        </div>
                    </ClassWrapper>
                </div>

                <div className="price_section_contents">
                    <ClassWrapper col="none" type="main_page">
                        <div className="price-title">
                            <div className="title-left">
                                <BadgeButton
                                    type={priceState}
                                    href="https://www.notion.so/1b2bb0974ccb4148bc78e945a7c51413"
                                    target="_blank"
                                    alt="badge"
                                >
                                    <div className="badge-left">
                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25Z"
                                                fill="#E6F6F6"
                                            />
                                            <path
                                                d="M16.9176 8.02507L10.285 14.2859L8.50025 12.3272C7.71329 11.7001 6.47633 12.4305 7.03829 13.3707L9.16003 16.7903C9.49699 17.2077 10.285 17.6251 11.0709 16.7903C11.4079 16.3729 17.8166 8.9642 17.8166 8.9642C18.6046 8.12942 17.5926 7.39898 16.9176 8.02507V8.02507Z"
                                                fill="#13E2A1"
                                            />
                                        </svg>
                                        <p>학원 소비자의 경우, 할인된 가격으로 만나보세요!</p>
                                    </div>
                                    <div className="badge-right">
                                        <p>조건 확인하기 </p>
                                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M0.589844 10.59L5.16984 6L0.589844 1.41L1.99984 0L7.99984 6L1.99984 12L0.589844 10.59Z"
                                                fill="#13E2A1"
                                            />
                                        </svg>
                                    </div>
                                </BadgeButton>
                            </div>
                            <div className="title-right">
                                <div>
                                    <Radio
                                        checked={priceState === 'personal'}
                                        onChange={handleChange}
                                        value="personal"
                                        color="default"
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': 'personal' }}
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
                                    />
                                    학원
                                </div>
                            </div>
                        </div>

                        <div className="price-menu">
                            <div className="col">
                                <div>
                                    <div className="menu-header">이용 플랜</div>
                                    <div className="menu-desc">
                                        요금은 부가가치세 10%가 포함되지 않은 금액으로, 학생 1인당 월 청구되는 금액입니다.
                                    </div>
                                </div>
                                <button
                                    className="price-button"
                                    onClick={() => {
                                        // alert('준비 중입니다!!\n문의는 jun094@optmier.com으로 해주세요.');
                                        // ChannelService.openChat(undefined, '서비스를 도입하고 싶습니다.');
                                        //ChannelService.showMessenger();
                                    }}
                                >
                                    이용 문의하기
                                </button>
                            </div>
                            {Object.keys(MenuData).map((i, idx) => (
                                <div key={idx} className="col-box">
                                    <div className="menu-box-title">
                                        <div className="header" id={'color-' + i}>
                                            {i}
                                        </div>

                                        {i !== 'Free' ? (
                                            <button name={i} onClick={goToPayments}>
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M8.59009 16.59L13.1701 12L8.59009 7.41L10.0001 6L16.0001 12L10.0001 18L8.59009 16.59Z"
                                                        fill="#707070"
                                                    />
                                                </svg>
                                            </button>
                                        ) : null}
                                    </div>

                                    <div className="menu-box-title-mobile">
                                        <div className="header" id={'color-' + i}>
                                            {i}
                                        </div>
                                        <Link to={`/pricing/details?plan=${i}`}>
                                            <div className="mobile-header-more">
                                                결제 및 자세히 보기
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M8.59009 16.59L13.1701 12L8.59009 7.41L10.0001 6L16.0001 12L10.0001 18L8.59009 16.59Z"
                                                        fill="#707070"
                                                    />
                                                </svg>
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="menu-box-price">
                                        <div className="pre-price">
                                            <span className="text">{convertPriceString(MenuData[i]['price'])}</span> <span>원</span>
                                        </div>
                                        <div className="current-price" id={'color-' + i}>
                                            {convertPriceString(MenuData[i]['discount_' + priceState])}
                                            <span>원</span>
                                            <span style={{ color: '#828282', paddingLeft: '10px' }}>(학생당/월)</span>
                                        </div>
                                    </div>
                                    <div className="menu-box-desc">{MenuData[i]['desc']}</div>
                                </div>
                            ))}
                        </div>

                        <div className="price-table">
                            <div className="col-desc">
                                {Object.keys(PriceData['Free']).map((i) =>
                                    i[0] === 'h' ? (
                                        <div key={i}>
                                            <div className="row-hr"></div>
                                            <div className="row-left-title">{PriceData['Free'][i]}</div>
                                        </div>
                                    ) : (
                                        <div key={i} className="row-left">
                                            {i}
                                        </div>
                                    ),
                                )}
                            </div>
                            {Object.keys(PriceData).map((i) => (
                                <div key={i} className="col">
                                    {Object.keys(PriceData[i]).map((j, idx) =>
                                        PriceData[i][j] === '클래스 초대' ||
                                        PriceData[i][j] === '클래스/과제 생성' ||
                                        PriceData[i][j] === '리포트 분석' ||
                                        PriceData[i][j] === '통계/AI 분석' ||
                                        PriceData[i][j] === '화상 강의' ? (
                                            i === 'Free' ? (
                                                <div key={idx}>
                                                    <div className="row-hr"></div>
                                                    <div className="row-title" id="color-Free">
                                                        {i}
                                                    </div>
                                                </div>
                                            ) : i === 'Standard' ? (
                                                <div key={idx}>
                                                    <div className="row-hr"></div>
                                                    <div className="row-title" id="color-Standard">
                                                        {i}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div key={idx}>
                                                    <div className="row-hr"></div>
                                                    <div className="row-title" id="color-Premium">
                                                        {i}
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <div key={idx} className="row">
                                                {PriceData[i][j] === 1 ? (
                                                    <svg
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.99991 16.1698L4.82991 11.9998L3.40991 13.4098L8.99991 18.9998L20.9999 6.99984L19.5899 5.58984L8.99991 16.1698Z"
                                                            fill="#3B168A"
                                                        />
                                                    </svg>
                                                ) : PriceData[i][j] === '-' ? (
                                                    <svg
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M15 12.5H5V11H15V12.5Z" fill="#949494" />
                                                    </svg>
                                                ) : (
                                                    PriceData[i][j]
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="price-footer"></div>
                    </ClassWrapper>
                </div>
            </div>
        </>
    );
}

export default withRouter(Price);
