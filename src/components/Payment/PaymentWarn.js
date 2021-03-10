import React from 'react';
import styled from 'styled-components';

const StyleWarn = styled.div`
    background-color: #f0f0f0;

    & .wrapper {
        max-width: 584px;
        min-width: 320px;
        padding: 80px 0;
        margin: 0 auto;

        & .title {
            margin-bottom: 10px;
            font-weight: 600;
            font-size: 1rem;
        }
        & .desc {
            color: rgba(87, 85, 85, 0.62);
            font-weight: 400;
            font-size: 1rem;
        }
        & .desc + .desc {
            margin-top: 4px;
        }
    }
`;

function PaymentWarn() {
    return (
        <StyleWarn>
            <div className="wrapper">
                <div className="title">결제 및 환불 안내</div>
                <div className="desc">- 결제일로부터 7일 이후에는 환불이 불가합니다.</div>
                <div className="desc">- 환불 규정에 따라, 환불 접수일로부터 최대 7일 이내에 환불 처리됩니다.</div>
            </div>
        </StyleWarn>
    );
}

export default PaymentWarn;
