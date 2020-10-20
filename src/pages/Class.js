import React from 'react';
import LeftNav from '../components/essentials/LeftNav';
import '../styles/class.scss';
import Draft from '../components/ClassDraft/Draft';
import Manage from '../components/ClassManage/Manage';
import Share from '../components/ClassShare/Share';
import SearchInput from '../components/essentials/SearchInput';
import ClassWrapper from '../components/essentials/ClassWrapper';
import FilterButton from '../components/essentials/FilterButton';
import { Route } from 'react-router-dom';
import TestReport from '../components/ClassShare/TestReport';

const ClassPageSwitcher = ({ match }) => {
    let { id } = match.params;

    switch (id) {
        case 'draft':
            return <Draft />;
        case 'manage':
            return <Manage />;
        case 'share':
            return (
                <>
                    <Route path={`${match.path}`} exact component={Share} />
                    <Route path={`${match.path}/:classNum`} component={TestReport} />
                </>
            );

        default:
            return (
                <>
                    존재하지 않는 페이지입니다. <br /> 404 :(
                </>
            );
    }
};

function Class({ match }) {
    let { id } = match.params;

    return (
        <>
            <LeftNav />
            <div className="class-page-root">
                {
                    id === 'manage' ? '' : ''
                    // <div style={{ width: '100%', borderBottom: '1.5px solid #e5e5e5' }}>
                    //     <ClassWrapper>
                    //         <div className="class-input-header">
                    //             <SearchInput />
                    //             <FilterButton />
                    //         </div>
                    //     </ClassWrapper>
                    // </div>
                }

                <ClassPageSwitcher match={match} />
            </div>
        </>
    );
}

export default Class;
