import React from 'react';
import '../../styles/card_draft.scss';
import { classNames } from 'classnames';
import CardContentBottom from '../essentials/CardContentBottom';

const dummyDatas = {};

const InfoItems = ({ title, contents }) => {
    return (
        <div className="card-item">
            <div className="card-content-title-p">{title}</div>
            <div className="card-content-p">{contents}</div>
        </div>
    );
};

function CardDraft() {
    return (
        <div className="draft-card-root">
            <div className="draft-card-header draft-card-wrapper">
                <div className="card-title-p">과제 TITLE</div>
                <span className="card-option">
                    <svg width="19" height="5" viewBox="0 0 19 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="2.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                        <circle cx="16.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                        <circle cx="9.5" cy="2.5" r="2.5" fill="#C4C4C4" />
                    </svg>
                </span>
            </div>
            <div></div>
            <div className="draft-card-contents draft-card-wrapper">
                <div className="contents-block">
                    <div className="card-item card-subTitle-p">과제 한줄 설명 과제 한줄 설명 과제 한줄 설명 과제 한줄 설명</div>
                    <div className="card-item card-content-p">에듀이티 고2</div>
                </div>

                <div className="contents-block">
                    <InfoItems title={'문항수'} contents={'3set / 15문제'} />
                    <InfoItems title={'제한시간'} contents={'14분'} />
                    <InfoItems title={'최종수정'} contents={'09/10/2020'} />
                </div>
            </div>
            <div className="draft-card-bottom">
                <CardContentBottom type={'eye'} able={true} />
                <CardContentBottom type={'share'} able={true} />
            </div>
        </div>
    );
}

export default CardDraft;