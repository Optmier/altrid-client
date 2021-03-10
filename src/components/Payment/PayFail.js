import React from 'react';
import '../../styles/pay_state.scss';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import Error from '../../pages/Error';

function PaySuccess({ location }) {
    //오류 코드가 없으면 404 페이지 렌더링
    if (!queryString.parse(location.search).message) return <Error />;
    return (
        <>
            <div className="header-text">
                죄송합니다 ! <br />
                카드 등록이 실패하였습니다:(
            </div>
            <div className="fail-text">오류코드 : {queryString.parse(location.search).message}</div>
            <div className="fail-info">
                <div className="info-header">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M14.4 0H1.6C0.72 0 0.00799999 0.72 0.00799999 1.6L0 16L3.2 12.8H14.4C15.28 12.8 16 12.08 16 11.2V1.6C16 0.72 15.28 0 14.4 0ZM8.8 7.2H7.2V2.4H8.8V7.2ZM8.8 10.4H7.2V8.8H8.8V10.4Z"
                            fill="#575555"
                            fillOpacity="0.62"
                        />
                    </svg>
                    문의가 필요하신가요?
                </div>
                우하단 물음표 버튼 또는 rikjeon94@optmier.com 으로 문의주세요.
            </div>
        </>
    );
}

export default withRouter(PaySuccess);
