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

function BranchNav({ match }) {
    const { num } = match.params;
    const { params, data } = useSelector((state) => state.params);
    const sessions = useSelector((state) => state.RdxSessions);

    const [deps, setDeps] = useState(1);

    const shareArr = ['과제 게시판', '과제별 리포트', '학생별 리포트'];
    const urlArr = [`/class/${num}/share`, `/class/${num}/share/${data}`, `/class/${num}/share/${data}/details?user=${sessions.authId}`];

    useEffect(() => {
        setDeps(params);
    }, [params]);
    return (
        <StyleBranch>
            {shareArr
                .filter((item, idx) => {
                    return idx < deps;
                })
                .map((depsName, idx) => (
                    <StyleBranchItem key={idx}>
                        <Link to={urlArr[idx]}>{depsName} </Link>
                    </StyleBranchItem>
                ))}
        </StyleBranch>
    );
}

export default withRouter(BranchNav);
