import React from 'react';
import Chart from 'react-apexcharts';

function ColumnChartProblem({ datas }) {
    let state = {};

    state = {
        series: [
            {
                name: '정답률',
                data: datas,
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
                categories: datas && datas.length ? datas.map((d, i) => i + 1 + '번') : [],
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

ColumnChartProblem.defaultProps = {
    datas: [],
};

export default ColumnChartProblem;
