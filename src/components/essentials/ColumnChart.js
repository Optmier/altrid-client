import React from 'react';
import Chart from 'react-apexcharts';
import problemCategories from '../TOFELEditor/ProblemCategories';

function ColumnChart({ currentObjs, averageObjs }) {
    let state = {};

    state = {
        series: [
            {
                name: '학생 정답률',
                data: [
                    currentObjs[1] * 100,
                    currentObjs[2] * 100,
                    currentObjs[3] * 100,
                    currentObjs[4] * 100,
                    currentObjs[5] * 100,
                    currentObjs[6] * 100,
                    currentObjs[7] * 100,
                    currentObjs[8] * 100,
                    currentObjs[9] * 100,
                    currentObjs[10] * 100,
                    currentObjs[0] ? currentObjs[0] : null,
                ],
            },
            {
                name: '평균 정답률',
                data: [
                    averageObjs[1] * 100,
                    averageObjs[2] * 100,
                    averageObjs[3] * 100,
                    averageObjs[4] * 100,
                    averageObjs[5] * 100,
                    averageObjs[6] * 100,
                    averageObjs[7] * 100,
                    averageObjs[8] * 100,
                    averageObjs[9] * 100,
                    averageObjs[10] * 100,
                    averageObjs[0] ? averageObjs[0] : null,
                ],
            },
        ],
        options: {
            chart: {
                type: 'bar',
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            colors: ['#13e2a1', '#706d6d'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: [
                    problemCategories[0].name,
                    problemCategories[1].name,
                    problemCategories[2].name,
                    problemCategories[3].name,
                    problemCategories[4].name,
                    problemCategories[5].name,
                    problemCategories[6].name,
                    problemCategories[7].name,
                    problemCategories[8].name,
                    problemCategories[9].name,
                    '기타',
                ],
            },
            yaxis: {},
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + '%';
                    },
                },
            },
        },
    };
    return (
        <div id="chart">
            <Chart options={state.options} series={state.series} type="bar" height={350} />
        </div>
    );
}

export default ColumnChart;
