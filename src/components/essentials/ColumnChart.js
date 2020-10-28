import React from 'react';
import Chart from 'react-apexcharts';

function ColumnChart() {
    let state = {};

    state = {
        series: [
            {
                name: '학생 정답률',
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70],
            },
            {
                name: '평균 정답률',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 90],
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
