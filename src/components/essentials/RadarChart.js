import React from 'react';
import Chart from 'react-apexcharts';
import problemCategories from '../TOFELEditor/ProblemCategories';
import styled from 'styled-components';

const StyleChartWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

function RadarChart({ currentObjs, averageObjs }) {
    let state = {};

    state = {
        series: [
            {
                name: '학생 정답률',
                data: currentObjs.map((v) => Math.round(v.score * 100)),
            },
            {
                name: '평균 정답률',
                data: averageObjs.map((v) => Math.round(v.score * 100)),
            },
        ],
        options: {
            chart: {
                width: '100%',
                height: '100%',
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
        <StyleChartWrapper>
            <div id="chart">
                <Chart options={state.options} series={state.series} type="radar" height={'325px'} width={'325px'} />
            </div>
        </StyleChartWrapper>
    );
}

export default RadarChart;
