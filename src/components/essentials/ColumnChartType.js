import React from 'react';
import Chart from 'react-apexcharts';

function ColumnChartProblem() {
    let state = {};

    state = {
        series: [
            {
                name: '정답률',
                data: [59, 60, 32, 36, 55, 30, 40, 50, 29, 74],
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
                },
            },
            colors: ['#008FF8'],
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
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
                    '세부내용찾기',
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

export default ColumnChartProblem;
