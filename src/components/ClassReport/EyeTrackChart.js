/* eslint-disable no-control-regex */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../configs/configs';
import Axios from 'axios';
import Chart from 'react-apexcharts';
import styled from 'styled-components';

const ChartSetWrapper = styled.div`
    display: flex;
    width: 100%;
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
    setACMS,
}) {
    const [mEyetrackData, setEyetrackData] = useState(eyetrackData);
    window.mEyetrackData = mEyetrackData;

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

    // console.log(activedNum);
    useEffect(() => {
        Axios.get(`${apiUrl}/assignment-result/eyetrack-data/${parseInt(activedNum)}`, {
            params: {
                userId: userId,
            },
            withCredentials: true,
        })
            .then((res) => {
                // console.log(res);
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
        // setFixations(currentStudentDatas.num_of_fixs);
        // setAvgFixVels(currentStudentDatas.avg_of_fix_vels);
        // setRegressions(currentStudentDatas.num_of_regs);
        // setFixationsTotalAvg(totalEyeStatsAvg.num_of_fixs.toFixed(0));
        // setAvgFixDurTotalAvg(totalEyeStatsAvg.avg_of_fix_vels.toFixed(0));
        // setRegressionsTotalAvg(totalEyeStatsAvg.num_of_regs.toFixed(0));
        setACMS.totalFixsMine(currentStudentDatas.num_of_fixs);
        setACMS.totalFixsAvg(totalEyeStatsAvg.num_of_fixs.toFixed(0));
        setACMS.avgSpeedFixsMine(currentStudentDatas.avg_of_fix_vels);
        setACMS.avgSpeedFixsAvg(totalEyeStatsAvg.avg_of_fix_vels.toFixed(0));
        setACMS.regressionsMine(currentStudentDatas.num_of_regs);
        setACMS.regressionsAvg(totalEyeStatsAvg.num_of_regs.toFixed(0));
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
        // console.log(chart3);
    }, [totalStudentsDatas]);
    // console.log(chart1);
    return (
        <ChartSetWrapper>
            <Chart options={chart1.options} series={chart1.series} type="bar" height={'240px'} width={'150px'} />
            <Chart options={chart2.options} series={chart2.series} type="bar" height={'240px'} width={'150px'} />
            <Chart options={chart3.options} series={chart3.series} type="bar" height={'240px'} width={'150px'} />
        </ChartSetWrapper>
    );
}

EyeTrackChart.defaultProps = {
    totalDatas: [],
};

export default EyeTrackChart;
