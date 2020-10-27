import React from 'react';
import { withRouter } from 'react-router-dom';

function ReportStudent({ match }) {
    let { studentNum } = match.params;

    return (
        <>
            <div>{studentNum}학생별 리포트 페이지</div>
        </>
    );
}

export default withRouter(ReportStudent);
