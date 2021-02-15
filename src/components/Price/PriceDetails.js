import React, { useState } from 'react';
import '../../styles/price_details_page.scss';
import Radio from '@material-ui/core/Radio';
import PriceData from '../../datas/PriceData.json';
import MenuData from '../../datas/MenuData.json';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import HeaderBar from '../essentials/HeaderBar';

function PriceDetails({ location, history }) {
    const [priceState, setPriceState] = useState('personal');

    const handleChange = (event) => {
        setPriceState(event.target.value);
    };
    const goToPayments = () => {
        history.push('/payment');
    };
    return (
        <>
            <HeaderBar defalutColor="#6d2bf5" />

            <div className="price-detail-root">
                <div className="price-nav">
                    <div className="nav-left" id={'color-' + queryString.parse(location.search).plan}>
                        {queryString.parse(location.search).plan}
                    </div>
                    <div className="nav-right">
                        <button onClick={goToPayments} id={'backcolor-' + queryString.parse(location.search).plan}>
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
