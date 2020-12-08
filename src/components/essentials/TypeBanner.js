import React from 'react';
import styled from 'styled-components';

const StyleTypeBanner = styled.div`
    cursor: pointer;
    width: 580px;
    padding: 1.1rem 1.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 11px;
    box-shadow: rgb(20 20 20 / 13%) 2px 7px 16px 0px, rgb(20 20 20 / 5%) 0px 1px 5px 0px;
    transition: all 0.3s;
    background-color: #828282;
    color: white;
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
            color: whitesmoke;
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
`;

function TypeBanner() {
    return (
        <StyleTypeBanner>
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
                <p>과제 최소 조건을 맞추어 유형별 분석을 시도해보세요!</p>
            </div>
            <div className="badge-right">
                <p>조건 확인하기 </p>
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.589844 10.59L5.16984 6L0.589844 1.41L1.99984 0L7.99984 6L1.99984 12L0.589844 10.59Z" fill="white" />
                </svg>
            </div>
        </StyleTypeBanner>
    );
}

export default TypeBanner;
