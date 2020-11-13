import React from 'react';
import LeftNav from '../components/essentials/LeftNav';
import '../styles/class.scss';
import Draft from '../components/ClassDraft/Draft';
import Manage from '../components/ClassManage/Manage';
import Share from '../components/ClassShare/Share';
import { Route } from 'react-router-dom';
import Reportes from '../components/ClassReport/Reportes';
import MakeContents from './MakeContents';

const ClassPageSwitcher = ({ match }) => {
    let { id } = match.params;

    // console.log(num, id);
    // console.log(match);

    switch (id) {
        case `draft`:
            return <Draft />;
        case 'manage':
            return <Manage />;
        case 'share':
            return (
                <>
                    <Route path={`${match.path}`} exact component={Share} />
                    <Route path={`${match.path}/:activedNum`} component={Reportes} />
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
    return (
        <>
            <LeftNav />
            <div className="class-page-root">
                <ClassPageSwitcher match={match} />
            </div>
        </>
    );
}

export default Class;
