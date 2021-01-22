import React from 'react';
import Chart from 'react-apexcharts';
import problemCategories from '../TOFELEditor/ProblemCategories';
import styled from 'styled-components';

const StyleChartWrapper = styled.div`
    min-width: 600px;
`;

function ColumnChart({ currentObjs, averageObjs }) {
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
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            colors: ['#351e85', '#68dea6'],
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
                labels: {
                    formatter: (value) => {
                        return Math.round(value);
                    },
                },
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
            legend: {
                show: false,
            },
        },
    };
    return (
        <StyleChartWrapper>
            <div id="chart">
                <Chart options={state.options} series={state.series} type="bar" height={350} />
            </div>
        </StyleChartWrapper>
    );
}

export default ColumnChart;
