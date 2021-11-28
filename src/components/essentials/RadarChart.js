import React from 'react';
import Chart from 'react-apexcharts';
import problemCategories from '../TOFELEditor/ProblemCategories';
import styled from 'styled-components';
import CategorySelector from '../../controllers/CategorySelector';
import { makeStyles } from '@material-ui/styles';

const StyleChartWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ChartRoot = styled.div`
    width: 100%;
`;

const useStyles = makeStyles({
    root: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
});

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

function RadarChart({ isDummy, subject, currentObjs, averageObjs }) {
    let state = {};
    const classes = useStyles();
    const categories = CategorySelector(subject);
    const dummyDatas = randomArrSet(
        categories.filter((d) => d.eng !== 'Others').map((d) => d.name),
        6,
    );

    state = {
        series: [
            {
                name: '학생 정답률',
                data: currentObjs ? currentObjs.map((v) => Math.round(v.score * 100)) : [0, 0, 0, 0, 0, 0],
            },
            {
                name: '평균 정답률',
                data: currentObjs ? averageObjs.map((v) => Math.round(v.score * 100)) : [0, 0, 0, 0, 0, 0],
            },
        ],
        options: {
            chart: {
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
                    // size: 100,
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
                categories: isDummy
                    ? dummyDatas
                    : averageObjs.map((v) => {
                          const filtered = categories.filter((i) => i.id === v.category);
                          return filtered.length ? filtered[0].name : '{과목 유형 불일치}';
                      }),
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
            <ChartRoot id="chart">
                <Chart className={classes.root} options={state.options} series={state.series} type="radar" height={350} />
            </ChartRoot>
        </StyleChartWrapper>
    );
}

RadarChart.defaultProps = {
    isDummy: false,
    subject: 1,
};

export default RadarChart;
