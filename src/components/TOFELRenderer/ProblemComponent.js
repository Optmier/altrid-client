import React from 'react';
import HtmlParser from 'react-html-parser';
import styled from 'styled-components';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

const Root = styled.div``;
const TextsContainer = styled.div`
    & p {
        font-weight: 600;
    }
`;
const SelectionsContainer = styled.div`
    cursor: pointer;
    margin-top: 20px;
    margin-left: 4px;
`;
const Selection = styled.div`
    display: flex;
    margin-top: 16px;

    & p {
        margin-left: 16px;
    }
`;

function ProblemComponent({ category, type, textForRender, selections, answer }) {
    return (
        <Root>
            <TextsContainer>{HtmlParser(textForRender)}</TextsContainer>
            <SelectionsContainer>
                {selections[1] ? (
                    <Selection>
                        <RadioButtonUncheckedIcon />
                        <p>{selections[1]}</p>
                    </Selection>
                ) : null}
                {selections[2] ? (
                    <Selection>
                        <RadioButtonUncheckedIcon />
                        <p>{selections[2]}</p>
                    </Selection>
                ) : null}
                {selections[3] ? (
                    <Selection>
                        <RadioButtonUncheckedIcon />
                        <p>{selections[3]}</p>
                    </Selection>
                ) : null}
                {selections[4] ? (
                    <Selection>
                        <RadioButtonUncheckedIcon />
                        <p>{selections[4]}</p>
                    </Selection>
                ) : null}
                {selections[5] ? (
                    <Selection>
                        <RadioButtonUncheckedIcon />
                        <p>{selections[5]}</p>
                    </Selection>
                ) : null}
            </SelectionsContainer>
        </Root>
    );
}

ProblemComponent.defaultProps = {
    category: 1,
    type: 'multiple-choice',
    textForRender: '',
    selections: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
    },
    answer: '',
};

export default React.memo(ProblemComponent);
