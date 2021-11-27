import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EyeTrackPattern from './EyeTrackPattern';
import EyetrackingPlayer from '../TOFELRenderer/EyetrackingPlayer';
import { AccordionDetails, AccordionSummary, Tooltip, Typography } from '@material-ui/core';
import TooltipCard from '../essentials/TooltipCard';
import { apiUrl } from '../../configs/configs';
import Axios from 'axios';
import RestrictWrapper from '../essentials/RestrictWrapper';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAccordion from '@material-ui/core/Accordion';

import { data } from 'jquery';
import Chart from 'react-apexcharts';

const StyleChartWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Dataset = styled.div`
    text-align: center;
    margin-right: 15px;

    & span {
        margin-right: 20px;
    }
    & .row-desc {
        color: #3b1689;
        font-weight: bold;
    }
`;
const AIcomment = styled.div`
    margin-top: 100px;
`;

const Sentece = styled.div``;

const Playerset = styled.div`
    /* width: 950px; */
    box-sizing: border-box;
    width: 100%;
    /* padding: 0px 100px 0px 0px; */
`;

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
    border: `none`,
}));

const StyleEyeTrackBox = styled.div`
    display: flex;
    flex-direction: column;

    & .eyetrack-box {
        margin-bottom: 18px;
        font-weight: bold;

        & .eyetrack-left {
            width: 100%;
            height: 490px;
            box-sizing: border-box;
            background-color: white;
            border-radius: 11px;
            padding: 0 130px;
            display: flex;
            align-items: center;

            & .no-eyetrack {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                font-weight: 500;
                color: rgb(96, 95, 96);
                & svg {
                    margin-right: 10px;
                }
            }
        }
        & .eyetrack-right {
            width: 26%;
            box-sizing: border-box;
            background-color: white;
            border-radius: 11px;
            padding: 30px 32px;
            overflow-y: auto;
            height: 470px;
        }
    }
`;

function EyeTrackChart({
    hasEyetrack,
    eyetrackData,
    contentsData,
    patternData,
    currentStudentDatas,
    totalStudentsDatas,
    activedNum,
    userId,
    stdName,
    answerChangedProblems,
    aftChangedFaileds,
}) {
    const [trackTimeGoTo, setTrackTimeGoTo] = useState(0);
    const [fixations, setFixations] = useState('-');
    const [avgFixVels, setAvgFixVels] = useState('-');
    const [regressions, setRegressions] = useState('-');
    const [fixationsTotalAvg, setFixationsTotalAvg] = useState('-');
    const [avgFixDurTotalAvg, setAvgFixDurTotalAvg] = useState('-');
    const [regressionsTotalAvg, setRegressionsTotalAvg] = useState('-');
    const [mEyetrackData, setEyetrackData] = useState(eyetrackData);

    const { eyetrack } = useSelector((state) => state.planInfo.restricted);
    const { userType } = useSelector((state) => state.RdxSessions);

    window.mEyetrackData = mEyetrackData;
    // window.setTrackTimeGoTo = setTrackTimeGoTo;
    const handleGoTo = (time) => {
        // console.log(time);
        setTrackTimeGoTo(() => 0);
        for (let i = 0; i < mEyetrackData.sequences.length; i++) {
            if (mEyetrackData.sequences[i].elapsedTime === time) {
                setTrackTimeGoTo(() => i);
                break;
            }
        }
    };

    const [chart1, setchart1] = useState({
        series: [
            {
                name: '재현 학생',
                data: [310],
            },
            {
                name: '반 평균',
                data: [510],
            },
        ],
        options: {
            chart: {
                width: '100%',
                height: '100%',
                type: 'bar',
            },
            dataLabels: {
                enabled: false,
            },

            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            title: {},
            colors: ['#351e85', '#68dea6'],
            markers: {
                size: 0,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
            },
            xaxis: {
                categories: ['총 응시점 개수'],
            },
            yaxis: {
                show: true,
                //     title: {
                //         text: '번',
                //     },
                // },
                // legend: {
                //     show: true,
                // },
            },
            toolbar: {
                show: false,
            },
        },
    });
    const [chart2, setchart2] = useState({
        series: [
            {
                name: '재현 학생',
                data: [310],
            },
            {
                name: '반 평균',
                data: [510],
            },
        ],
        options: {
            chart: {
                width: '100%',
                height: '100%',
                type: 'bar',
            },
            dataLabels: {
                enabled: false,
            },

            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            title: {},
            colors: ['#351e85', '#68dea6'],
            markers: {
                size: 0,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
            },
            xaxis: {
                categories: ['평균 응시속도'],
            },
            yaxis: {
                show: true,
                //     title: {
                //         text: '번',
                //     },
                // },
                // legend: {
                //     show: true,
                // },
            },
            toolbar: {
                show: false,
            },
        },
    });

    const [chart3, setchart3] = useState({
        series: [
            {
                name: '재현 학생',
                data: [310],
            },
            {
                name: '반 평균',
                data: [510],
            },
        ],
        options: {
            chart: {
                width: '100%',
                height: '100%',
                type: 'bar',
            },
            dataLabels: {
                enabled: false,
            },

            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            title: {},
            colors: ['#351e85', '#68dea6'],
            markers: {
                size: 0,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
            },
            xaxis: {
                categories: ['재응시 횟수'],
            },
            yaxis: {
                show: true,
                //     title: {
                //         text: '번',
                //     },
                // },
                // legend: {
                //     show: true,
                // },
            },
            toolbar: {
                show: false,
            },
        },
    });

    console.log(activedNum);
    useEffect(() => {
        Axios.get(`${apiUrl}/assignment-result/eyetrack-data/${parseInt(activedNum)}`, {
            params: {
                userId: userId,
            },
            withCredentials: true,
        })
            .then((res) => {
                console.log(res);
                if (res.data) {
                    let unparsedEyetrackData = res.data.eyetrack_data;
                    let parsedData = null;
                    try {
                        unparsedEyetrackData
                            .replace(/\\n/g, '\\n')
                            .replace(/\\'/g, "\\'")
                            .replace(/\\"/g, '\\"')
                            .replace(/\\&/g, '\\&')
                            .replace(/\\r/g, '\\r')
                            .replace(/\\t/g, '\\t')
                            .replace(/\\b/g, '\\b')
                            .replace(/\\f/g, '\\f')
                            .replace(/[\u0000-\u0019]+/g, '');
                        parsedData = JSON.parse(unparsedEyetrackData);
                        setEyetrackData(parsedData);
                    } catch (error) {
                        unparsedEyetrackData = null;
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (!totalStudentsDatas || !totalStudentsDatas.length) return;
        if (!currentStudentDatas) return;
        const totalEyeStatsSum = totalStudentsDatas.reduce((a, b) => ({
            num_of_fixs: a.num_of_fixs + b.num_of_fixs,
            avg_of_fix_durs: a.avg_of_fix_durs + b.avg_of_fix_durs,
            avg_of_fix_vels: a.avg_of_fix_vels + b.avg_of_fix_vels,
            num_of_sacs: a.num_of_sacs + b.num_of_sacs,
            var_of_sac_vels: a.var_of_sac_vels + b.var_of_sac_vels,
            cluster_area: a.cluster_area + b.cluster_area,
            cluster_counts: a.cluster_counts + b.cluster_counts,
            num_of_regs: a.num_of_regs + b.num_of_regs,
        }));
        const totalEyeStatsAvg = {};
        Object.keys(totalEyeStatsSum).forEach((name) => {
            totalEyeStatsAvg[name] = (totalEyeStatsSum[name] / totalStudentsDatas.length) * 1.0;
        });
        setFixations(currentStudentDatas.num_of_fixs);
        setAvgFixVels(currentStudentDatas.avg_of_fix_vels);
        setRegressions(currentStudentDatas.num_of_regs);
        setFixationsTotalAvg(totalEyeStatsAvg.num_of_fixs.toFixed(0));
        setAvgFixDurTotalAvg(totalEyeStatsAvg.avg_of_fix_vels.toFixed(0));
        setRegressionsTotalAvg(totalEyeStatsAvg.num_of_regs.toFixed(0));
        setchart1({
            ...chart1,
            series: [
                {
                    name: '학생',
                    data: [currentStudentDatas.num_of_fixs],
                },
                {
                    name: '평균',
                    data: [totalEyeStatsAvg.num_of_fixs.toFixed(0)],
                },
            ],
        });
        setchart2({
            ...chart2,
            series: [
                {
                    name: '학생',
                    data: [currentStudentDatas.avg_of_fix_vels],
                },
                {
                    name: '평균',
                    data: [totalEyeStatsAvg.avg_of_fix_vels.toFixed(0)],
                },
            ],
        });
        setchart3({
            ...chart3,
            series: [
                {
                    name: '학생',
                    data: [currentStudentDatas.num_of_regs],
                },
                {
                    name: '평균',
                    data: [totalEyeStatsAvg.num_of_regs.toFixed(0)],
                },
            ],
        });
        console.log(chart3);
    }, [totalStudentsDatas]);
    console.log(chart1);
    return (
        <div style={{ display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
            <Chart options={chart1.options} series={chart1.series} type="bar" height={'300px'} width={'150px'} />
            <Chart options={chart2.options} series={chart2.series} type="bar" height={'300px'} width={'150px'} />
            <Chart options={chart3.options} series={chart3.series} type="bar" height={'300px'} width={'150px'} />
        </div>
    );
}

EyeTrackChart.defaultProps = {
    totalDatas: [],
};

export default EyeTrackChart;
