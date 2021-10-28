import React from 'react';
import styled from 'styled-components';
import VerifiedIcon from '@material-ui/icons/CheckCircle';

const ItemRoot = styled.div`
    background-color: #ffffff;
    border-radius: 11px;
    display: flex;
    min-height: 16px;
    width: 100%;
    & + & {
        margin-top: 4px;
    }
`;
const LabelColor = styled.div`
    border-top-left-radius: 11px;
    border-bottom-left-radius: 11px;
    background-color: ${(props) =>
        props['label-color'] === 1
            ? '#cbcbcb'
            : props['label-color'] === 2
            ? '#ffcf70'
            : props['label-color'] >= 3
            ? '#e85c4a'
            : '#ffffff'};
    height: 48px;
    width: 12px;
`;
const ContentsContainer = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 8px;
    width: 100%;
`;
const Word = styled.div`
    flex-basis: 27%;
    margin-left: 16px;
`;
const Means = styled.div`
    flex-basis: 48%;
    margin: 0 4px;
`;
const Notes = styled.div`
    flex-basis: 16%;
`;
const Verified = styled.div`
    align-items: center;
    color: #05944f;
    display: flex;
    margin-left: 4px;
    min-width: 26px;
`;

function CompletedListItem({ word, means, notes, label, verified, children }) {
    return (
        <ItemRoot>
            <LabelColor label-color={label} />
            <ContentsContainer>
                <Word>{word}</Word>
                <Means>{means}</Means>
                <Notes>{notes}</Notes>
                <Verified>{verified ? <VerifiedIcon /> : null}</Verified>
            </ContentsContainer>
        </ItemRoot>
    );
}

CompletedListItem.defaultProps = {
    word: 'word',
    means: '뜻',
    notes: '메모',
    label: 1,
    verified: false,
};

export default CompletedListItem;
