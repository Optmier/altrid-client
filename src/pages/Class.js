import React from 'react';
import LeftNav from '../components/essentials/LeftNav';
import '../styles/class.scss';
import Draft from '../components/ClassDraft/Draft';
import Manage from '../components/ClassManage/Manage';
import Share from '../components/ClassShare/Share';

const ClassPageSwitcher = ({ classPageName }) => {
    switch (classPageName) {
        case '/class/draft':
            return <Draft />;
        case '/class/manage':
            return <Manage />;
        case '/class/share':
            return <Share />;

        default:
            return (
                <>
                    존재하지 않는 페이지입니다. <br /> 404 :(
                </>
            );
    }
};

function Class({ history }) {
    const classPageName = history.location['pathname'];

    return (
        <>
            <LeftNav />
            <div className="class-page-root">
                <div className="class-page-wrapper">
                    <p>클래스페이지입니다.</p>
                    <ClassPageSwitcher classPageName={classPageName} />
                </div>
            </div>
        </>
    );
}

export default Class;
