import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import CategorySelector from '../../controllers/CategorySelector';

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

function ColumnChartProblem({ datas, subject }) {
    let state = {};
    let [categorySorted, setCategorySorted] = useState(datas ? datas.sort((a, b) => a.category - b.category) : null);
    const categories = CategorySelector(subject);
    let dummyDatas = randomArrSet(
        categories.filter((d) => d.eng !== 'Others').map((d) => d.name),
        6,
    );
    state = {
        series: [
            {
                name: '정답률',
                data: datas ? categorySorted.map((v) => (v.score * 100).toFixed(1)) : [0],
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
            colors: ['#13E2A1'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: datas
                    ? categorySorted.map((v) => {
                          const filtered = categories.filter((i) => i.id === v.category);
                          return filtered.length ? filtered[0].name : '{과목 유형 불일치}';
                      })
                    : dummyDatas,
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
        <div id="chart-wrapper">
            <div id="chart">
                <Chart options={state.options} series={state.series} type="bar" height={350} />
            </div>
        </div>
    );
}

ColumnChartProblem.defaultProps = {
    datas: [0],
    subject: 1,
};

export default ColumnChartProblem;
