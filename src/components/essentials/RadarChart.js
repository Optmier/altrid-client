import React from 'react';
import Chart from 'react-apexcharts';

function RadarChart() {
    let state = {};

    state = {
        series: [
            {
                name: '학생 정답률',
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70],
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
                    '세부내용찾기',
                    '지시대상찾기',
                    '세부내용찾기',
                    '지시대상찾기',
                    '세부내용찾기',
                    '지시대상찾기',
                    '세부내용찾기',
                    '지시대상찾기',
                    '세부내용찾기',
                    '지시대상찾기',
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
