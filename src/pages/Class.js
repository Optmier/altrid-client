import React from 'react';
import LeftNav from '../components/essentials/LeftNav';
import '../styles/class.scss';

function Class() {
    return (
        <>
            <LeftNav />
            <div className="class-page-root">
                <div className="class-page-wrapper">클래스페이지입니다.</div>
            </div>
        </>
    );
}

export default Class;
