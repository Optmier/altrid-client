import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import problemCategories from '../TOFELEditor/ProblemCategories';

function RadarChart({ objDatas }) {
    let state = {};

    state = {
        series: [
            {
                name: '학생 정답률',
                data: objDatas.map((v) => (v.score * 100).toFixed(1)),
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'radar',
                toolbar: {
                    show: false,
                },
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
                categories: objDatas.map((v) => problemCategories.filter((i) => i.id === v.category)[0].name),
                // '기타',
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
