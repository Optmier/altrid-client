import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

const StyleBranch = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 40px 0 20px 0;
`;

const StyleBranchItem = styled.div`
    color: #706d6d;
    font-size: 14px;
    font-weight: 500;
    & + & {
        margin-left: 1rem;
        &::before {
            content: '>';
            margin-right: 1rem;
        }
    }
`;

const shareArr = ['과제 게시판', '과제별 리포트', '학생별 리포트'];

function BranchNav({ deps }) {
    return (
        <StyleBranch>
            {shareArr
                .filter((item, idx) => {
                    return idx < deps;
                })
                .map((depsName, key) => (
                    <StyleBranchItem key={key}>{depsName}</StyleBranchItem>
                ))}
        </StyleBranch>
    );
}

export default withRouter(BranchNav);
