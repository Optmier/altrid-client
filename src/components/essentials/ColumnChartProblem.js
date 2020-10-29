import React from 'react';
import Chart from 'react-apexcharts';

function ColumnChartProblem() {
    let state = {};

    state = {
        series: [
            {
                name: '정답률',
                data: [
                    59,
                    32,
                    68,
                    36,
                    82,
                    18,
                    70,
                    50,
                    33,
                    74,
                    59,
                    32,
                    68,
                    36,
                    82,
                    18,
                    70,
                    50,
                    33,
                    74,
                    59,
                    32,
                    68,
                    36,
                    82,
                    18,
                    70,
                    50,
                    33,
                    74,
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
                },
            },
            colors: ['#13e2a1'],
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
                    '1번',
                    '2번',
                    '3번',
                    '4번',
                    '5번',
                    '6번',
                    '7번',
                    '8번',
                    '9번',
                    '10번',
                    '1번',
                    '2번',
                    '3번',
                    '4번',
                    '5번',
                    '6번',
                    '7번',
                    '8번',
                    '9번',
                    '10번',
                    '1번',
                    '2번',
                    '3번',
                    '4번',
                    '5번',
                    '6번',
                    '7번',
                    '8번',
                    '9번',
                    '10번',
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
