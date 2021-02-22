import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import styled from 'styled-components';

//카드 내역 있으면 '카드 추가'
//카드 내역 없으면 '카드 변경'

const StyleDialg = styled.div`
    padding: 32px;
    width: 600px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    & .header {
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #13e2a1;
    }
    & .warn {
        font-size: 0.95rem;
        font-weight: 400;
        margin-bottom: 2rem;
        color: gray;
    }

    & .contents {
        display: flex;
        flex-direction: column;

        & .row + .row {
            margin-top: 10px;
        }
        & .row {
            display: flex;
            align-items: flex-start;

            & .row-title {
                font-size: 1.05rem;
                font-weight: 500;
                width: 145px;
            }
            & .row-desc {
                display: flex;
                flex-direction: column;

                & .row-desc-warn {
                    font-size: 0.95rem;
                    font-weight: 400;
                    color: gray;
                    margin-top: 8px;
                }
            }
            & #small {
                width: 90px;
            }
            & input {
                box-sizing: border-box;
                font-size: 1.05rem;
                padding: 10px;
                border-radius: 6px;
                border: 1.5px solid #8080805e;
            }
            & input::placeholder {
                font-size: 1.05rem;
                color: gray;
            }
            & input:focus {
                border: 2px solid #3b168aad;
            }
            & input + input {
                margin-left: 6px;
            }
        }
    }
`;

function PaymentInfo() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <StyleDialg>
                    <div className="header">카드 추가</div>
                    <div className="warn">
                        당사는 어떠한 결제정보도 직접 저장하거나 접근하지 않습니다. 현재, 토스 페이먼츠의 결제시스템을 이용하고 있으며 모든
                        카드정보는 암호화되어 해당 결제 회사에서 관리되니 안심하셔 좋습니다.
                    </div>
                    <div className="contents">
                        <div className="row">
                            <div className="row-title">카드 번호</div>
                            <input type="number" placeholder="**** **** **** ****" />
                        </div>
                        <div className="row">
                            <div className="row-title">유효 기간</div>
                            <input id="small" type="number" placeholder="MM" />
                            <input id="small" type="number" placeholder="YYYY" />
                        </div>
                        <div className="row">
                            <div className="row-title">비밀번호 앞 2자리</div>
                            <input id="small" type="password" placeholder="**" />
                            **
                        </div>
                        <div className="row">
                            <div className="row-title">생년월일 6자리</div>
                            <div className="row-desc">
                                <input type="number" placeholder="******" />
                                <div className="row-desc-warn">법인카드의 경우 사업등록번호 10자리를 입력해주세요</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="row-title">결제용 이메일</div>
                            <div className="row-desc">
                                <input placeholder="altrid@optmier.com" />
                                <div className="row-desc-warn">
                                    결제정보를 받을 이메일을 지정할 수 있습니다. 입력하지 않으면 결제 관련 메일을 받아볼 수 없습니다
                                </div>
                            </div>
                        </div>
                    </div>
                </StyleDialg>
            </Dialog>
            <div className="payment-info-root">
                <div className="mypage-contents white-box">
                    <div className="card-info">
                        <div className="card-info-top">
                            <div className="card-info-left">
                                <div className="row">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14 0H2C1.1675 0 0.5075 0.89 0.5075 2L0.5 14C0.5 15.11 1.1675 16 2 16H14C14.8325 16 15.5 15.11 15.5 14V2C15.5 0.89 14.8325 0 14 0ZM14 14H2V8H14V14ZM14 4H2V2H14V4Z"
                                            fill="#575555"
                                        />
                                    </svg>
                                    <h5> 카드</h5>
                                </div>
                                <div className="row">
                                    <p>유료 플랜 및 부가서비스를 이용하기 위해서 1개 이상의 카드가 필요합니다.</p>
                                </div>
                            </div>
                            <div className="card-info-right">
                                <button className="btn-purple" onClick={handleClickOpen}>
                                    카드 추가
                                </button>
                            </div>
                        </div>
                        <div className="card-info-bottom">
                            <div className="card-col">
                                <div className="card-col-header">등록일</div>
                                <div className="card-col-desc">-</div>
                            </div>
                            <div className="card-col">
                                <div className="card-col-header">카드</div>
                                <div className="card-col-desc">-</div>
                            </div>
                            <div className="card-col">
                                <div className="card-col-header">유효기간</div>
                                <div className="card-col-desc">-</div>
                            </div>
                            <div className="card-col">
                                <div className="card-col-header">결제사</div>
                                <div className="card-col-desc">-</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mypage-contents white-box">
                    <div className="pay-info">
                        <div className="pay-info-header">
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 2H11.82C11.4 0.84 10.3 0 9 0C7.7 0 6.6 0.84 6.18 2H2C0.9 2 0 2.9 0 4V18C0 19.1 0.9 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM9 2C9.55 2 10 2.45 10 3C10 3.55 9.55 4 9 4C8.45 4 8 3.55 8 3C8 2.45 8.45 2 9 2ZM11 16H4V14H11V16ZM14 12H4V10H14V12ZM14 8H4V6H14V8Z"
                                    fill="#575555"
                                />
                            </svg>
                            <h5>결제 내역</h5>
                        </div>
                        <div className="pay-info-table">
                            <div className="table-title">날짜</div>
                            <div className="table-title">설명</div>
                            <div className="table-title">서비스 기간</div>
                            <div className="table-title">결제 수단</div>
                            <div className="table-title">소계</div>
                            <div className="table-title">총 합계</div>
                        </div>
                        <div className="pay-info-table">
                            <div className="table-desc date">2021년 2월 15일</div>
                            <div className="table-desc">Premium</div>
                            <div className="table-desc">2021년 2월 15일—2021년 3월 14일</div>
                            <div className="table-desc">신용카드 •••• •••• •••• 3041</div>
                            <div className="table-desc">
                                7900원 <span>(+790원 부가세)</span>
                            </div>
                            <div className="table-desc">8690원</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PaymentInfo;
