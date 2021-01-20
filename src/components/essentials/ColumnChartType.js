import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import ProblemCategories from '../TOFELEditor/ProblemCategories';

function ColumnChartProblem({ datas }) {
    let state = {};
    let [categorySorted, setCategorySorted] = useState(datas ? datas.sort((a, b) => a.category - b.category) : null);
    let dummyDatas = ['문장요약', '세부정보찾기', '어휘', '지시대상', '추론', '문장삽입', '정보분류'];
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
                categories: datas ? categorySorted.map((v) => ProblemCategories.filter((i) => i.id === v.category)[0].name) : dummyDatas,
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

export default ColumnChartProblem;
