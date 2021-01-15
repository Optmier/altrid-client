import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import ProblemCategories from '../TOFELEditor/ProblemCategories';

function ColumnChartProblem({ datas }) {
    const [categorySorted] = useState(datas.sort((a, b) => a.category - b.category));
    let state = {};

    state = {
        series: [
            {
                name: '정답률',
                data: categorySorted.map((v) => (v.score * 100).toFixed(1)),
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
                categories: categorySorted.map((v) => ProblemCategories.filter((i) => i.id === v.category)[0].name),
            },
            yaxis: {
                min: 0,
                max: 100,
            },
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
