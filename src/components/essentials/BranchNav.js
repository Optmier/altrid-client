import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyleBranch = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 25px;
`;

const StyleBranchItem = styled.div`
    color: #706d6d;
    font-size: 14px;
    font-weight: 500;
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

const shareArr = ['과제 게시판', '과제별 리포트', '학생별 리포트'];

function BranchNav({ deps, match }) {
    const { num } = match.params;
    return (
        <StyleBranch>
            {shareArr
                .filter((item, idx) => {
                    return idx < deps;
                })
                .map((depsName, key) => (
                    <StyleBranchItem key={key}>
                        <Link to={`/class/${num}/share`}>{depsName} </Link>
                    </StyleBranchItem>
                ))}
        </StyleBranch>
    );
}

export default withRouter(BranchNav);
