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

const StyleDialog = styled.div`
    background-color: white;
    width: 700px;
    height: 500px;
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

function Price({ history }) {
    const sessions = useSelector((state) => state.RdxSessions);

    const [priceState, setPriceState] = useState('personal');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleChange = (event) => {
        setPriceState(event.target.value);
    };

    const goToPayments = (e) => {
        handleDialogOpen();
        //history.push(`/payment?type=${e.target.name}`);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = (value) => {
        setDialogOpen(false);
    };

    return (
        <>
            <Dialog onClose={handleDialogClose} aria-labelledby="simple-dialog-title" open={dialogOpen}>
                <StyleDialog>asdfasdfasdfasdfasdf</StyleDialog>
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
                                            <span className="text">{MenuData[i]['price']}</span> <span>원</span>
                                        </div>
                                        <div className="current-price" id={'color-' + i}>
                                            {MenuData[i]['discount_' + priceState]}
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
