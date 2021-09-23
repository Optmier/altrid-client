import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StyleBranch = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 25px;

    @media (min-width: 0) and (max-width: 662px) {
        display: none;
    }
`;

const StyleBranchItem = styled.div`
    color: #706d6d;
    font-size: 0.75rem;
    font-weight: 400;
    display: flex;
    align-items: center;

    & > a {
        padding: 5px;
        transition: all 0.2s;
    }

    & + & {
        margin-left: 1rem;
        &::before {
            content: '>';
            margin-right: 1rem;
        }
    }
    & :hover {
        background-color: #8879a726;
    }
`;

function BranchNav({ match, history }) {
    const { num } = match.params;
    const { params, data } = useSelector((state) => state.params);
    const sessions = useSelector((state) => state.RdxSessions);

    const [deps, setDeps] = useState(1);
    const [currentParams, setCurrentParams] = useState([]);

    const shareArr = ['과제 게시판', '과제별 리포트', '학생별 리포트', '손을 든 문제'];
    const urlArr = [
        { idx: 0, url: `/class/${num}/share` },
        { idx: 1, url: `/class/${num}/share/${data}` },
        { idx: 2, url: `/class/${num}/share/${data}/details?user=${sessions.authId}` },
        { idx: 3, url: `/class/${num}/share/${data}/hands-up` },
    ];

    useEffect(() => {
        setDeps(params);
        setCurrentParams(history.location.pathname.split('/').filter((e) => e !== ''));
    }, [params]);
    return (
        <StyleBranch>
            {urlArr
                .filter(({ url }) => {
                    const p = url.split('/').filter((e) => e !== '');
                    const eLen = p.length;
                    for (let i = 0; i < eLen; i++) {
                        if (!p[i].includes(currentParams[i])) return false;
                    }
                    return true;
                })
                .map(({ idx, url }) => (
                    <StyleBranchItem key={idx}>
                        <Link to={url}>{shareArr[idx]} </Link>
                    </StyleBranchItem>
                ))}
        </StyleBranch>
    );
}

export default withRouter(BranchNav);
