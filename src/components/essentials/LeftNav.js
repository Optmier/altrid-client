import React from 'react';
import '../../styles/nav_left.scss';
import { Link, NavLink, withRouter } from 'react-router-dom';
import NavLogoWhite from '../../images/nav_logo_white.png';

function LeftNav({ history }) {
    return (
        <div className="left-nav-root">
            <div className="left-nav-wrapper">
                <div className="left-nav-box logo-wrapper">
                    <img src={NavLogoWhite} alt="logo_white"></img>
                </div>
                <div className="left-nav-box info">
                    <div className="info-header">
                        <h3>Class 02반</h3>
                        <h4>에듀이티학원 도플 700점 목표반입니다.</h4>
                        <h4>학생 수 30명</h4>
                    </div>
                </div>

                <div className="left-nav-box info">
                    <div className="info-header">
                        <h3>Class 02반</h3>
                        <h4>에듀이티학원 도플 700점 목표반입니다.</h4>
                        <h4>학생 수 30명</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(withRouter(LeftNav));
