import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    Checkbox,
    FormControlLabel,
    Typography,
    withStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreOutlined';
import Axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { apiUrl } from '../../../configs/configs';
import { changeParams } from '../../../redux_modules/params';
import ClassWrapper from '../../essentials/ClassWrapper';
import CardProblemPreview from '../../TOFELRenderer/CardProblemPreview';
import { getHandsUpFromStudents, selectHansUpProblems, unselectHandsUpProblems } from './HandsUpInterface';
import Button from '../../../AltridUI/Button/Button';
import AltCheckedIcon from '../../../AltridUI/Icons/AltCheckedIcon';
import AltUncheckedIcon from '../../../AltridUI/Icons/AltUncheckedIcon';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AccordionArrowIcon from '../../../AltridUI/Icons/AccordionArrowIcon';

const HandsUpListRoot = styled.div`
    display: flex;
    flex-direction: column;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    margin: 0 auto;
    max-width: 960px;
    padding: 0 16px;
    width: 100%;
`;

const HeaderTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 28px;
`;
const HeaderTitle = styled.div`
    font-size: 1.68rem;
    font-weight: 700;
    margin-bottom: 11px;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;
const HandsUpListContainer = styled.div`
    height: calc(100vh - 300px);
    overflow-y: auto;
    width: 100%;
`;
const ColorLabel = styled.div`
    background-color: ${({ counts }) => {
        if (counts >= 3) return '#FF6937';
        else if (counts >= 2 && counts < 3) return '#FFC043';
        else return '#BFC6CD';
    }};
    border: none;
    border-radius: 16px;
    margin-left: 2px;
    margin-right: 8px;
    min-height: 44px;
    /* opacity: 0.2; */
    width: 8px;
`;
const SummaryTitle = styled.div`
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 1.1rem;
    font-weight: 700;
    flex-basis: 25%;
`;
const SummaryStudents = styled.div`
    align-items: center;
    color: rgba(0, 0, 0, 0.54);
    display: inline-flex;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-basis: 55%;
    overflow-x: auto;
    margin-right: 8px;
`;
const StudentNameTag = styled.span`
    background-color: #f4f1fa;
    border-radius: 32px;
    color: #6c46a1;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.375rem;
    padding: 3px 12px;
    & + span {
        margin-left: 8px;
    }
`;
const SummaryShowProblemBtnContainer = styled.div`
    margin-right: 36px;
`;
const DetailsRoot = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    & .details-left {
        flex-basis: 66.67%;
        & .details-correct-answer {
            color: #0000ff;
            font-size: 1rem;
            font-weight: 500;
        }
        & .details-student-answer {
            margin-top: 0.8rem;
            & p {
            }
        }
    }

    & .details-right {
        display: flex;
        align-items: center;
        & button.show-problem {
            background-color: #4f4f4f;
            border-radius: 28px;
            color: #ffffff;
            min-height: 28px;
            min-width: 64px;
            font-size: 0.8rem;
            &:hover {
                background-color: #7f7f7f;
            }
        }
    }
`;

const HandsUpActions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
`;

const ActionButton = styled.button`
    background-color: #ffffff;
    border-radius: 48px;
    box-shadow: 0px 1px 2px #0000004a;
    color: #333333;
    font-size: 1rem;
    min-height: 48px;
    min-width: 108px;
    padding: 0 1rem;
    transition: box-shadow 0.25s;
    &.primary {
        background-color: #6d2afa;
        color: #ffffff;
    }
    &.secondary {
        background-color: #13e2a1;
        color: #ffffff;
    }
    & + & {
        margin-left: 0.4rem;
    }
    &:hover {
        box-shadow: 0px 2px 5px #0000003d;
    }
`;

const Accordion = withStyles({
    root: {
        boxShadow: 'none',
        borderRadius: 8,
        '&:not(:first-child)': {
            borderRadius: 8,
        },
        '&:not(:last-child)': {
            borderRadius: 8,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: ({ mark }) => (mark % 2 === 1 ? '#F6F8F9' : '#ffffff'),
        borderTop: '2px solid transparent',
        borderLeft: '2px solid transparent',
        borderRight: '2px solid transparent',
        borderRadius: 8,
        margin: 0,
        minHeight: 50,
        paddingLeft: 0,
        '&$expanded': {
            borderColor: '#6C46A1',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            minHeight: 50,
        },
    },
    content: {
        alignItems: 'center',
        margin: '-2px 0 0 -2px',
        '&$expanded': {
            margin: '-2px 0 0 -2px',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        borderBottom: '2px solid #6C46A1',
        borderLeft: '2px solid #6C46A1',
        borderRight: '2px solid #6C46A1',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        padding: 0,
        '&$expanded': {
            minHeight: 44,
        },
    },
}))(MuiAccordionDetails);

const WrapperRoot = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 95px);
`;
const BottomActions = styled.div`
    align-items: center;
    background-color: #ffffff;
    box-shadow: inset 0px 1px 0px #e9edef;
    display: flex;
    justify-content: center;
    margin-top: auto;
    min-height: 48px;
    padding: 0 48px;

    /* & button + button {
        margin-left: 16px;
    } */
`;
const BottomActionsInner = styled.div`
    display: inherit;
    justify-content: space-between;
    max-width: 960px;
    width: 100%;
`;
const DetailListCorret = styled.div`
    background-color: #f0fff9;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 22px;
    padding: 9px 32px;
    & div.name {
    }
    & div.value {
        color: #008f58;
    }
`;
const DetailListStudent = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 20px;
    padding: 8px 32px;
    & div.name {
    }
    & div.value {
        color: ${({ isCorrect }) => (isCorrect ? '#008F58' : '#E11900')};
    }
`;

function HandsUpList({ match }) {
    const { activedNum, num } = match.params;
    const dispatch = useDispatch();
    const [handsUpList, setHandsUpList] = useState([]);
    const [assignmentData, setAssignmentData] = useState(null);
    const [previewOpenState, setPreviewOpenState] = useState(false);
    const [selectedIds, setSelectedIds] = useState(null);
    const [teacherSelectionChanged, setTeacherSelectionChanged] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const actionExpand = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        if (isExpanded) {
        } else {
        }
    };

    const actionShowProblem = (problemGoto) => {
        setPreviewOpenState(true);
        setTimeout(() => {
            window.problemGoto(problemGoto);
        }, 10);
    };

    const actionProblemSelectChanged =
        (id) =>
        ({ target }) => {
            setSelectedIds({ ...selectedIds, [id]: target.checked });
        };

    const checkSelectionChanged = () => {
        for (const key in selectedIds) {
            const orig = handsUpList.find((d) => d[0].questionId === key)[0].teacherSelected;
            if (orig !== selectedIds[key]) return true;
        }
        return false;
    };

    const actionSelectAll = () => {
        const newObj = {};
        for (const key in selectedIds) {
            newObj[key] = true;
        }
        setSelectedIds(newObj);
    };

    const actionUnselectAll = () => {
        const newObj = {};
        for (const key in selectedIds) {
            newObj[key] = false;
        }
        setSelectedIds(newObj);
    };

    const actionUpdateSelection = () => {
        const selected = [];
        const unselected = [];
        const updateTasks = [];
        for (const key in selectedIds) {
            const orig = handsUpList.find((d) => d[0].questionId === key)[0].teacherSelected;
            if (orig !== selectedIds[key]) {
                if (selectedIds[key]) selected.push(key);
                else unselected.push(key);
            }
        }
        console.log(selected, unselected);

        if (selected.length) updateTasks.push(selectHansUpProblems(selected));
        if (unselected.length) updateTasks.push(unselectHandsUpProblems(unselected));

        Promise.all(updateTasks)
            .then((res) => {
                alert('응답이 업데이트 되었습니다.');
            })
            .catch((err) => {
                alert('업데이트에 실패했습니다.');
                console.error(err);
            });
    };

    useEffect(() => {
        if (!handsUpList || !selectedIds) return;
        setTeacherSelectionChanged(checkSelectionChanged());
    }, [selectedIds, handsUpList]);

    window.selectedIds = selectedIds;

    useEffect(() => {
        dispatch(changeParams(3, activedNum));
        getHandsUpFromStudents(activedNum, {
            onSuccess(res) {
                if (res && res.data) {
                    res.data.sort((a, b) => {
                        if (a.length === b.length) {
                            return a[0].problemAbsIdx - b[0].problemAbsIdx;
                        } else if (a.length < b.length) {
                            return 0;
                        } else {
                            return -1;
                        }
                    });
                    console.log(res.data);
                    setHandsUpList(res.data);
                    const obj = {};
                    for (const data of res.data) {
                        obj[data[0].questionId] = data[0].teacherSelected;
                    }
                    setSelectedIds(obj);
                } else {
                    alert('데이터 불러오기에 실패했습니다.');
                }
            },
            onFailure() {
                alert('데이터 불러오기에 실패했습니다.');
            },
        });
        Axios.get(`${apiUrl}/assignment-actived/${parseInt(num)}/${parseInt(activedNum)}`, {
            withCredentials: true,
        })
            .then((res) => {
                let parsedContents = null;
                try {
                    parsedContents = JSON.parse(
                        res.data.contents_data
                            .replace(/\\n/g, '\\n')
                            .replace(/\\'/g, "\\'")
                            .replace(/\\"/g, '\\"')
                            .replace(/\\&/g, '\\&')
                            .replace(/\\r/g, '\\r')
                            .replace(/\\t/g, '\\t')
                            .replace(/\\b/g, '\\b')
                            .replace(/\\f/g, '\\f')
                            .replace(/[\u0000-\u0019]+/g, ''),
                    );
                } catch (parseError) {
                    alert('과제 컨텐츠 파싱 에러');
                }
                setAssignmentData({ ...res.data, contents_data: parsedContents });
            })
            .catch((err) => {
                alert('과제 데이터를 불러오지 못했습니다.');
            });
    }, []);
    return (
        <WrapperRoot>
            <ClassWrapper col={true}>
                {assignmentData && assignmentData.contents_data ? (
                    <CardProblemPreview
                        openPreview={previewOpenState}
                        metadata={assignmentData.contents_data}
                        timeLimit={assignmentData.time_limit}
                        handlePreviewClose={() => {
                            setPreviewOpenState(false);
                        }}
                    />
                ) : null}
                <HandsUpListRoot>
                    <HeaderTitleContainer>
                        <HeaderTitle>손들기 목록</HeaderTitle>
                    </HeaderTitleContainer>
                    <HandsUpListContainer>
                        {assignmentData && assignmentData.contents_data && selectedIds
                            ? handsUpList.map((data, idx) => (
                                  <Accordion
                                      key={data[0].questionId}
                                      expanded={expanded === data[0].questionId}
                                      onChange={actionExpand(data[0].questionId)}
                                  >
                                      <AccordionSummary
                                          expandIcon={<AccordionArrowIcon />}
                                          mark={idx}
                                          aria-controls={`${data[0].questionId}bh-content`}
                                          id={`${data[0].questionId}bh-header`}
                                      >
                                          <ColorLabel counts={data.length} />
                                          <FormControlLabel
                                              aria-label={'select_' + data[0].questionId}
                                              onClick={(event) => event.stopPropagation()}
                                              onFocus={(event) => event.stopPropagation()}
                                              onChange={actionProblemSelectChanged(data[0].questionId)}
                                              checked={selectedIds[data[0].questionId]}
                                              control={
                                                  <Checkbox
                                                      disableRipple
                                                      disableTouchRipple
                                                      disableFocusRipple
                                                      icon={<AltUncheckedIcon />}
                                                      checkedIcon={<AltCheckedIcon />}
                                                  />
                                              }
                                          />
                                          <SummaryTitle>#{data[0].problemAbsIdx + 1}</SummaryTitle>
                                          <SummaryStudents>
                                              {data.map(({ studentName }, idx) => (
                                                  <StudentNameTag key={data[0].questionId + '-summary-' + idx}>
                                                      {studentName}
                                                  </StudentNameTag>
                                              ))}
                                          </SummaryStudents>
                                          <SummaryShowProblemBtnContainer>
                                              <Button
                                                  variant="mono"
                                                  sizes="small"
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      actionShowProblem(data[0].problemAbsIdx);
                                                  }}
                                              >
                                                  문제보기
                                              </Button>
                                          </SummaryShowProblemBtnContainer>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                          <DetailsRoot>
                                              <DetailListCorret>
                                                  <div className="name">문제 정답</div>
                                                  <div className="value">{data[0].correctAnswer}</div>
                                              </DetailListCorret>
                                              {data.map(({ studentName, studentAnswer }, idx) => (
                                                  <DetailListStudent
                                                      key={data[0].questionId + '-details-' + idx}
                                                      isCorrect={data[0].correctAnswer === studentAnswer}
                                                  >
                                                      <div className="name">{studentName}</div>
                                                      <div className="value">{studentAnswer === null ? '미응답' : studentAnswer}</div>
                                                  </DetailListStudent>
                                              ))}
                                          </DetailsRoot>
                                      </AccordionDetails>
                                  </Accordion>
                              ))
                            : null}
                    </HandsUpListContainer>
                    <HandsUpActions></HandsUpActions>
                </HandsUpListRoot>
            </ClassWrapper>
            <BottomActions>
                <BottomActionsInner>
                    {selectedIds && Object.keys(selectedIds).filter((k) => selectedIds[k]).length === handsUpList.length ? (
                        <Button sizes="small" variant="filled" colors="purple" onClick={actionUnselectAll}>
                            모두 해제
                        </Button>
                    ) : (
                        <Button sizes="small" variant="light" colors="purple" onClick={actionSelectAll}>
                            모두 선택
                        </Button>
                    )}
                    {teacherSelectionChanged ? (
                        <Button sizes="small" variant="light" colors="green" onClick={actionUpdateSelection}>
                            선택 사항 업데이트
                        </Button>
                    ) : null}
                </BottomActionsInner>
            </BottomActions>
        </WrapperRoot>
    );
}

export default React.memo(HandsUpList);
