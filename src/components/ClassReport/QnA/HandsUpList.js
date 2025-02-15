/* eslint-disable no-control-regex */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-computed-key */
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    Checkbox,
    FormControlLabel,
    withStyles,
} from '@material-ui/core';
import Axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as configs from '../../../configs/config.json';
import { changeParams } from '../../../redux_modules/params';
import CardProblemPreview from '../../TOFELRenderer/CardProblemPreview';
import { getHandsUpFromStudents, selectHansUpProblems, unselectHandsUpProblems } from './HandsUpInterface';
import Button from '../../../AltridUI/Button/Button';
import AltCheckedIcon from '../../../AltridUI/Icons/AltCheckedIcon';
import AltUncheckedIcon from '../../../AltridUI/Icons/AltUncheckedIcon';
import AccordionArrowIcon from '../../../AltridUI/Icons/AccordionArrowIcon';
import InnerPageBottomActions from '../../../AltridUI/OtherContainers/InnerPageBottomActions';
import HeaderMenu from '../../../AltridUI/HeaderMenu/HeaderMenu';
import { openAlertSnackbar } from '../../../redux_modules/alertMaker';
import { stringifiedJsonUnparser } from '../../../controllers/stringifiedJsonUnparser';

const HandsUpListRoot = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 32px;
    margin-bottom: ${(props) => (props['bottom-actions'] ? '72px' : null)};
    max-width: 960px;
    height: 100%;
    @media (max-width: 640px) {
        margin-top: 30px;
    }
`;

const HeaderTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 28px;
`;
const HandsUpListContainer = styled.div`
    margin-bottom: 16px;
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
    @media all and (max-width: 640px) {
        margin-top: -38px;
    }
`;
const SummaryTitle = styled.div`
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 1.1rem;
    font-weight: 700;
    @media all and (max-width: 640px) {
        margin-left: -16px;
    }
`;
const SummaryStudents = styled.div`
    display: flex;
    align-items: center;
    overflow: auto;
    margin: 0 32px;
    @media all and (max-width: 640px) {
        margin: 0;
        margin-top: 8px;
        margin-bottom: 8px;
    }
`;
const StudentNameTag = styled.div`
    background-color: #f4f1fa;
    border-radius: 32px;
    color: #6c46a1;
    display: flex;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.375rem;
    padding: 3px 12px;
    max-width: max-content;
    & + & {
        margin-left: 8px;
    }
`;
const SummaryShowProblemBtnContainer = styled.div`
    align-items: center;
    display: flex;
    margin-right: 24px;
    @media all and (max-width: 768px) {
        margin-right: 16px;
    }
    @media all and (max-width: 640px) {
        margin-right: 0;
        display: none;
    }
`;
const DetailsRoot = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    @media all and (max-width: 640px) {
        padding: 0 16px 8px 16px;
        width: initial;
    }
`;
const DetailListWrapper = styled.div`
    border: 1px solid #e9edef;
    border-radius: 8px;
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

const DetailsActions = styled.div`
    display: none;
    @media all and (max-width: 640px) {
        display: flex;
        margin-top: 8px;
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
        ['@media all and (max-width: 640px)']: {
            '& + &': {
                marginTop: 8,
            },
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
        ['@media all and (max-width: 640px)']: {
            backgroundColor: '#ffffff !important',
            paddingRight: 0,
            '&$expanded': {
                backgroundColor: '#ffffff !important',
            },
        },
    },
    content: {
        alignItems: 'center',
        margin: '-2px 0 0 -2px',
        overflow: 'hidden',
        '&$expanded': {
            margin: '-2px 0 0 -2px',
        },
        ['@media (min-width: 0) and (max-width: 768px)']: {
            margin: '-2px 0 0 -2px',
        },
        ['@media all and (max-width: 640px)']: {
            // flexDirection: 'column',
            margin: 0,
            padding: '16px 16px 8px 0',
            '&$expanded': {
                margin: 0,
            },
        },
    },
    expandIcon: {
        ['@media all and (max-width: 640px)']: {
            right: 16,
            top: 12,
            position: 'absolute',
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
        ['@media all and (max-width: 640px)']: {
            flexDirection: 'column',
            paddingTop: 0,
        },
    },
}))(MuiAccordionDetails);
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
    @media all and (max-width: 640px) {
        padding-left: 8px;
        padding-right: 8px;
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
    @media all and (max-width: 640px) {
        padding-left: 8px;
        padding-right: 8px;
    }
`;
const SummaryInfoWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    overflow-x: auto;
    width: 100%;
    @media all and (max-width: 640px) {
        flex-direction: column;
    }
`;
const SummaryInfoContainer = styled.div`
    align-items: center;
    display: flex;
    margin-left: 4px;
    &:first-child {
    }
    &:last-child {
        justify-content: space-between;
        width: 100%;
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
                dispatch(openAlertSnackbar('응답이 업데이트 되었습니다.', 'success'));
            })
            .catch((err) => {
                dispatch(openAlertSnackbar('업데이트에 실패했습니다', 'error'));
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
                    setHandsUpList(res.data);
                    const obj = {};
                    for (const data of res.data) {
                        obj[data[0].questionId] = data[0].teacherSelected;
                    }
                    setSelectedIds(obj);
                } else {
                    dispatch(openAlertSnackbar('데이터 불러오기에 실패했습니다.', 'error'));
                }
            },
            onFailure() {
                dispatch(openAlertSnackbar('데이터 불러오기에 실패했습니다.', 'error'));
            },
        });
        Axios.get(`${configs.SERVER_HOST}/assignment-actived/${parseInt(num)}/${parseInt(activedNum)}`, {
            withCredentials: true,
        })
            .then((res) => {
                if (!res.data || !res.data.contents_data) return;
                setAssignmentData({ ...res.data, contents_data: stringifiedJsonUnparser(res.data.contents_data, null) });
            })
            .catch((err) => {
                dispatch(openAlertSnackbar('과제 데이터를 불러오지 못했습니다.', 'error'));
            });
    }, []);
    const [rootHasBottomActions, setRootHasBottomActions] = useState(false);
    const hasActions = (bool) => {
        setRootHasBottomActions(bool);
    };
    return (
        <HandsUpListRoot bottom-actions={rootHasBottomActions}>
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
            <HeaderTitleContainer>
                <HeaderMenu fullWidth title="손들기 목록" menuDatas={null} selectedMenuId={0} fixed backgroundColor="#f6f8f9" />
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
                                  <SummaryInfoWrapper>
                                      <SummaryInfoContainer>
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
                                      </SummaryInfoContainer>

                                      <SummaryStudents>
                                          {data.map(({ studentName }, idx) => (
                                              <StudentNameTag key={data[0].questionId + '-summary-' + idx}>{studentName}</StudentNameTag>
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
                                  </SummaryInfoWrapper>
                              </AccordionSummary>
                              <AccordionDetails>
                                  <DetailsRoot>
                                      <DetailListWrapper>
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
                                      </DetailListWrapper>
                                      <DetailsActions>
                                          <Button
                                              fullWidth
                                              variant="mono"
                                              sizes="small"
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  actionShowProblem(data[0].problemAbsIdx);
                                              }}
                                          >
                                              문제보기
                                          </Button>
                                      </DetailsActions>
                                  </DetailsRoot>
                              </AccordionDetails>
                          </Accordion>
                      ))
                    : null}
            </HandsUpListContainer>
            <InnerPageBottomActions hasActions={hasActions}>
                <>
                    {selectedIds && Object.keys(selectedIds).filter((k) => selectedIds[k]).length === handsUpList.length ? (
                        <Button sizes="medium" variant="filled" colors="purple" onClick={actionUnselectAll}>
                            모두 해제
                        </Button>
                    ) : (
                        <Button sizes="medium" variant="light" colors="purple" onClick={actionSelectAll}>
                            모두 선택
                        </Button>
                    )}
                    {teacherSelectionChanged ? (
                        <Button sizes="medium" variant="light" colors="green" onClick={actionUpdateSelection}>
                            선택 사항 업데이트
                        </Button>
                    ) : null}
                </>
            </InnerPageBottomActions>
        </HandsUpListRoot>
    );
}

export default React.memo(HandsUpList);
