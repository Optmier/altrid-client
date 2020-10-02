import React from 'react';
import LeftNav from '../components/essentials/LeftNav';
import '../styles/class.scss';
import Draft from '../components/ClassDraft/Draft';
import Manage from '../components/ClassManage/Manage';
import Share from '../components/ClassShare/Share';
import SearchInput from '../components/essentials/SearchInput';
import ClassWrapper from '../components/essentials/ClassWrapper';
import FilterButton from '../components/essentials/FilterButton';

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
                <div style={{ width: '100%', borderBottom: '1.5px solid #e5e5e5' }}>
                    <ClassWrapper>
                        <div className="class-header-wrapper">
                            <SearchInput />
                            <FilterButton />
                        </div>
                    </ClassWrapper>
                </div>
                <ClassPageSwitcher classPageName={classPageName} />
            </div>
        </>
    );
}

export default Class;
