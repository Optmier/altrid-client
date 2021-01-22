import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import problemCategories from '../TOFELEditor/ProblemCategories';

function RadarChart({ currentObjs, averageObjs }) {
    let state = {};

    state = {
        series: [
            {
                name: '학생 정답률',
                data: currentObjs.map((v) => (v.score * 100).toFixed(1)),
            },
            {
                name: '평균 정답률',
                data: averageObjs.map((v) => (v.score * 100).toFixed(1)),
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
                categories: averageObjs.map((v) => problemCategories.filter((i) => i.id === v.category)[0].name),
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
            legend: {
                show: false,
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
