import React,{useEffect,useState} from 'react';
import Chart from 'react-apexcharts';
import problemCategories from '../TOFELEditor/ProblemCategories';
import styled from 'styled-components';
import Axios from 'axios';
import {apiUrl} from '../../configs/configs';

const StyleChartWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

function CommChart({ currentObjs, averageObjs,
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
    aftChangedFaileds, }) {

    const [trackTimeGoTo, setTrackTimeGoTo] = useState(0);
    const [fixations, setFixations] = useState('-');
    const [avgFixVels, setAvgFixVels] = useState('-');
    const [regressions, setRegressions] = useState('-');
    const [fixationsTotalAvg, setFixationsTotalAvg] = useState('-');
    const [avgFixDurTotalAvg, setAvgFixDurTotalAvg] = useState('-');
    const [regressionsTotalAvg, setRegressionsTotalAvg] = useState('-');
    const [mEyetrackData, setEyetrackData] = useState(eyetrackData);

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
    }, [totalStudentsDatas]);

    let state = {};

    state = {
        series: [
            {
                name:'재현 학생',
                data: [200,301,201]
            },
            {
                name:'반 평균',
                data:[250,310,250]
            },
        ],
        options: {
            chart: {
                width: '100%',
                height: '100%',
                type: 'bar',
            },
            dataLabels: {
                enabled: true,
            },

            plotOptions: {
                bar: {
                  horizontal: true,
                  columnWidth: '55%',
                  endingShape: 'rounded'
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
                categories: ['평균 응시속도','응시 횟수','응시점 갯수'],
                // '기타',
            },
            yaxis: {
                title: {
                  text: '번'
                }
              },
            legend: {
                show: true,
            },
        },
    };
    return (
        <>
        <StyleChartWrapper>
            <div id="chart">
                <Chart options={state.options} series={state.series} type="bar" height={'325px'} width={'325px'} />
            </div>
        </StyleChartWrapper>
        {mEyetrackData}
        </>
    );
}

export default CommChart;
