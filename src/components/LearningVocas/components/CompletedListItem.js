import React from 'react';
import styled from 'styled-components';
import VerifiedIcon from '@material-ui/icons/CheckCircle';

const ItemRoot = styled.div`
    background-color: ${({ idx }) => (idx % 2 === 1 ? '#ffffff' : '#F6F8F9')};
    border-radius: 8px;
    color: #11171c;
    display: flex;
    font-size: 18px;
    letter-spacing: -0.02em;
    line-height: 22px;
    min-height: 46px;
    width: 100%;
    & + & {
        /* margin-top: 4px; */
    }
`;
const LabelColor = styled.div`
    border-radius: 8px;
    background-color: ${(props) =>
        props['label-color'] === 1
            ? '#cbcbcb'
            : props['label-color'] === 2
            ? '#ffcf70'
            : props['label-color'] >= 3
            ? '#e85c4a'
            : '#ffffff'};
    margin-top: auto;
    margin-bottom: auto;
    height: 36px;
    width: 5px;
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
    font-weight: 700;
    margin-left: 16px;
`;
const Means = styled.div`
    flex-basis: 48%;
    font-weight: 400;
    margin: 0 4px;
`;
const Notes = styled.div`
    flex-basis: 16%;
    font-weight: 400;
`;
const Verified = styled.div`
    align-items: center;
    color: #05944f;
    display: flex;
    margin-left: 4px;
    min-width: 26px;
`;

function CompletedListItem({ idx, word, means, notes, label, verified, children }) {
    return (
        <ItemRoot idx={idx}>
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
    verified: true,
};

export default CompletedListItem;
