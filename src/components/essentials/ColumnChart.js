import React from 'react';
import Chart from 'react-apexcharts';
import problemCategories from '../TOFELEditor/ProblemCategories';

function ColumnChart({ currentObjs, averageObjs }) {
    let state = {};

    state = {
        series: [
            {
                name: '학생 정답률',
                data: currentObjs.map((v) => v.score * 100),
            },
            {
                name: '평균 정답률',
                data: averageObjs.map((v) => v.score * 100),
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
                categories: currentObjs.map((v) => problemCategories.filter((i) => i.id === v.category)[0].name),
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

export default ColumnChart;
