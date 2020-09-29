import React from 'react';
import '../../styles/nav_left.scss';
import { Link, NavLink, withRouter } from 'react-router-dom';

function LeftNav({ history }) {
    return (
        <div className="left-nav-root">
            <div className="left-nav-wrapper">
                <div>asdfasdfadfs</div>
            </div>
        </div>
    );
}

export default React.memo(withRouter(LeftNav));
