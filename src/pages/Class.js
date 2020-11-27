import React, { useEffect } from 'react';
import LeftNav from '../components/essentials/LeftNav';
import '../styles/class.scss';
import Draft from '../components/ClassDraft/Draft';
import Manage from '../components/ClassManage/Manage';
import Share from '../components/ClassShare/Share';
import { Route } from 'react-router-dom';
import Reportes from '../components/ClassReport/Reportes';
import Error from './Error';
import { useSelector, useDispatch } from 'react-redux';
import BackdropComponent from '../components/essentials/BackdropComponent';
import { getDrafts } from '../redux_modules/assignmentDraft';

const ClassPageSwitcher = ({ match, data }) => {
    let { id } = match.params;

    switch (id) {
        case `draft`:
            return <Draft data={data} />;
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
                    <Error></Error>
                </>
            );
    }
};

function Class({ match }) {
    const { data, loading, error } = useSelector((state) => state.assignmentDraft.draftDatas) || {
        loading: false,
        data: null,
        error: null,
    };
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getDrafts());
    }, [match.url]);
    if (loading && !data) {
        return <BackdropComponent open={true} />; // 로딩중이고 데이터 없을때만
    }

    if (error) return <Error />;

    if (!data) return null;

    return (
        <>
            <LeftNav data={data} />
            <div className="class-page-root">
                <ClassPageSwitcher match={match} data={data} />
            </div>
        </>
    );
}

export default Class;
