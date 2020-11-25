import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import problemCategories from '../TOFELEditor/ProblemCategories';

function RadarChart({ objDatas }) {
    let state = {};

    state = {
        series: [
            {
                name: '학생 정답률',
                data: [
                    objDatas[1] * 100,
                    objDatas[2] * 100,
                    objDatas[3] * 100,
                    objDatas[4] * 100,
                    objDatas[5] * 100,
                    objDatas[6] * 100,
                    objDatas[7] * 100,
                    objDatas[8] * 100,
                    objDatas[9] * 100,
                    objDatas[10] * 100,
                    // objDatas[0] ? objDatas[0] : null,
                ],
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'radar',
            },
            dataLabels: {
                enabled: true,
            },
            plotOptions: {
                radar: {
                    size: 110,
                    polygons: {
                        strokeColors: '#e9e9e9',
                        fill: {
                            colors: ['#f8f8f8', '#fff'],
                        },
                    },
                },
            },
            title: {},
            colors: ['#008FF8'],
            markers: {
                size: 4,
                colors: ['#fff'],
                strokeColor: '#008FF8',
                strokeWidth: 2,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
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
                    // '기타',
                ],
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: function (val, i) {
                        if (i % 2 === 0) {
                            return val;
                        } else {
                            return '';
                        }
                    },
                },
            },
        },
    };
    return (
        <div id="chart">
            <Chart options={state.options} series={state.series} type="radar" height={350} />
        </div>
    );
}

export default RadarChart;
