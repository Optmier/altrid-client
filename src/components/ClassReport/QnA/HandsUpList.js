import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, Typography, withStyles } from '@material-ui/core';
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

const HandsUpListRoot = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: 960px;
    padding: 0 16px;
    width: 100%;
    & .hands-up-title {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 28px;
        & .name {
            font-size: 1.68rem;
            font-weight: 600;
            margin-bottom: 11px;
            width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
    & .hands-up-contents {
        width: 100%;
        & .problem-title {
            font-size: 1.1rem;
            font-weight: 600;
            flex-basis: 33.33%;
        }
        & .summary-stdnames {
            align-items: center;
            color: rgba(0, 0, 0, 0.54);
            display: inline-block;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            & span {
                font-size: 0.8rem;
                & + span {
                    margin-left: 6px;
                }
            }
        }
    }
`;

const DetailsRoot = styled.div`
    display: flex;
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
                <div className="hands-up-title">
                    <div className="name">손들기 목록</div>
                </div>
                <div className="hands-up-contents">
                    {assignmentData && assignmentData.contents_data && selectedIds
                        ? handsUpList.map((data) => (
                              <Accordion
                                  key={data[0].questionId}
                                  expanded={expanded === data[0].questionId}
                                  onChange={actionExpand(data[0].questionId)}
                              >
                                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                                      <FormControlLabel
                                          aria-label={'select_' + data[0].questionId}
                                          onClick={(event) => event.stopPropagation()}
                                          onFocus={(event) => event.stopPropagation()}
                                          onChange={actionProblemSelectChanged(data[0].questionId)}
                                          checked={selectedIds[data[0].questionId]}
                                          control={<Checkbox />}
                                      />
                                      <div className="problem-title">문제 {data[0].problemAbsIdx + 1}</div>
                                      <div className="summary-stdnames">
                                          {data.map(({ studentName }, idx) => (
                                              <span key={data[0].questionId + '-summary-' + idx}>{studentName}</span>
                                          ))}
                                      </div>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                      <DetailsRoot>
                                          <div className="details-left">
                                              <div className="details-correct-answer">문제 정답: {data[0].correctAnswer}</div>
                                              <div className="details-student-answer">
                                                  {data.map(({ studentName, studentAnswer }, idx) => (
                                                      <p key={data[0].questionId + '-details-' + idx}>
                                                          {studentName} 학생이 선택한 답:{' '}
                                                          {studentAnswer === null ? '미선택' : studentAnswer}
                                                      </p>
                                                  ))}
                                              </div>
                                          </div>
                                          <div className="details-right">
                                              <button
                                                  className="show-problem"
                                                  onClick={() => {
                                                      actionShowProblem(data[0].problemAbsIdx);
                                                  }}
                                              >
                                                  문제 보기
                                              </button>
                                          </div>
                                      </DetailsRoot>
                                  </AccordionDetails>
                              </Accordion>
                          ))
                        : null}
                </div>
                <HandsUpActions>
                    {selectedIds && Object.keys(selectedIds).filter((k) => selectedIds[k]).length === handsUpList.length ? (
                        <ActionButton className="secondary" onClick={actionUnselectAll}>
                            모두 해제
                        </ActionButton>
                    ) : (
                        <ActionButton onClick={actionSelectAll}>모두 선택</ActionButton>
                    )}
                    {teacherSelectionChanged ? (
                        <ActionButton className="primary" onClick={actionUpdateSelection}>
                            선택 사항 업데이트
                        </ActionButton>
                    ) : null}
                </HandsUpActions>
            </HandsUpListRoot>
        </ClassWrapper>
    );
}

export default React.memo(HandsUpList);
