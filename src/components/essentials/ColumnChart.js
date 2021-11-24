import React from 'react';
import Chart from 'react-apexcharts';
import problemCategories from '../TOFELEditor/ProblemCategories';
import styled from 'styled-components';
import CategorySelector from '../../controllers/CategorySelector';

const StyleChartWrapper = styled.div`
    min-width: 600px;
`;

const ChartRoot = styled.div`
    width: 100%;
`;

const randomArrSet = (array, length = array.length) => {
    if (length > array.length) return array;
    const newArray = [];
    for (let i = 0; i < length; i++) {
        const max = Math.floor(array.length);
        const randomIdx = Math.floor(Math.random() * max);
        newArray.push(array.splice(randomIdx, 1));
    }
    return newArray;
};

function ColumnChart({ isDummy, subject, currentObjs, averageObjs }) {
    let state = {};
    const categories = CategorySelector(subject);
    const dummyDatas = randomArrSet(
        categories.filter((d) => d.eng !== 'Others').map((d) => d.name),
        6,
    );

    state = {
        series: [
            {
                name: '학생 정답률',
                data: currentObjs ? currentObjs.map((v) => (v.score * 100).toFixed(1)) : [0, 0, 0, 0, 0, 0],
            },
            {
                name: '평균 정답률',
                data: currentObjs ? averageObjs.map((v) => (v.score * 100).toFixed(1)) : [5, 5, 5, 5, 5, 5],
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
                categories: isDummy
                    ? dummyDatas
                    : averageObjs.map((v) => {
                          const filtered = categories.filter((i) => i.id === v.category);
                          return filtered.length ? filtered[0].name : '{과목 유형 불일치}';
                      }),
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
            <ChartRoot id="chart">
                <Chart options={state.options} series={state.series} type="bar" height={350} />
            </ChartRoot>
        </StyleChartWrapper>
    );
}

ColumnChart.defaultProps = {
    isDummy: false,
    subject: 1,
};

export default ColumnChart;
