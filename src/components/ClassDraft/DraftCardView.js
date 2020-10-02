import React from 'react';

const datas = {};

const InfoItems = ({ title, contents }) => {
    return (
        <>
            <span>{title}</span>
            <span>{contents}</span>
        </>
    );
};

function DraftCardView() {
    return (
        <div className="draft-cardview-root">
            <div className="draft-cardview-header">
                토익 기출 모음 문제
                <span className="cardview-option">
                    <svg width="19" height="5" viewBox="0 0 19 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="2.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                        <circle cx="16.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                        <circle cx="9.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                    </svg>
                </span>
            </div>
            <div className="draft-cardview-contents">
                <div className="cardview-header">
                    <div className="header-title">토익 500점 기출 문제</div>
                    <div className="header-age">에듀이티 고2</div>
                </div>

                <div className="cardview-bottom">
                    <div className="bottom-info">
                        <InfoItems title={'문항수'} contents={'3set / 15문제'} />
                        <InfoItems title={'문항수'} contents={'3set / 15문제'} />
                        <InfoItems title={'문항수'} contents={'3set / 15문제'} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DraftCardView;
