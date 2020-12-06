import React from 'react';
import Chart from 'react-apexcharts';
import ProblemCategories from '../TOFELEditor/ProblemCategories';

function ColumnChartProblem({ datas }) {
    // console.log(datas);
    let state = {};

    state = {
        series: [
            {
                name: '정답률',
                data: Object.keys(datas)
                    .filter((k) => k != 0)
                    .map((k) => datas[k] * 100),
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
                categories: ProblemCategories.filter((c) => c.id != 0).map((c) => c.name),
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
