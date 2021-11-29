export default function MakeAutoComments(
    studentName,
    totalFixsMine,
    totalFixsAvg,
    avgSpeedFixsMine,
    avgSpeedFixsAvg,
    regressionsMine,
    regressionsAvg,
) {
    let comments = '';
    if (totalFixsMine > totalFixsAvg && regressionsAvg >= regressionsMine && avgSpeedFixsAvg >= avgSpeedFixsMine) {
        comments +=
            '신중하게 문제 풀이를 진행햐는 편이며, 독해에 있어서 단기 기억력이 타 학생에 비해 높다고 판단됩니다. 다만, 시간이 부족해질 수 있기 때문에 독해 속도 향상 연습이 필요할 것으로 예상됩니다.';
    } else if (totalFixsMine > totalFixsAvg && regressionsAvg < regressionsMine && avgSpeedFixsAvg >= avgSpeedFixsMine) {
        comments +=
            '신중하게 문제 풀이를 진행하는 편이나, 독해에 있어 단기 기억력이 타 학생에 비해 다소 부족한 것으로 판단됩니다. 따라서 단기 기억력 향상 훈련이 필요할 것으로 예상됩니다.';
    } else if (totalFixsMine > totalFixsAvg && regressionsAvg < regressionsMine && avgSpeedFixsAvg < avgSpeedFixsMine) {
        comments +=
            '같은 반 타 학생들에 비해 독해 시 다소 주의산만 한 것으로 판단되며, 독해 능력 향상에 있어 종합적인 훈련이 필요할 것입니다.';
    } else if (totalFixsMine <= totalFixsAvg && regressionsAvg >= regressionsMine && avgSpeedFixsAvg >= avgSpeedFixsMine) {
        comments +=
            '독해 능력이 같은 반 타 학생들에 비해 전반적으로 뛰어난 편입니다. 지속적으로 이 상태를 유지 하면 좋은 결과를 얻을 수 있으리라 예상됩니다.';
    } else if (totalFixsMine <= totalFixsAvg && regressionsAvg < regressionsMine && avgSpeedFixsAvg >= avgSpeedFixsMine) {
        comments +=
            '같은 반 타 학생들에 비해 독해시 단기 기억력이 다소 부족할 수 있으며, 이에 대한 시간 소모가 클 것으로 예상됩니다. 따라서 단기 기억력 향상 훈련을 통해 독해 속도 향상이 필요합니다.';
    } else if (totalFixsMine <= totalFixsAvg && regressionsAvg < regressionsMine && avgSpeedFixsAvg < avgSpeedFixsMine) {
        comments += '독해 시 다소 주의산만 한 것으로 판단되며, 전반적인 독해 향상을 위한 훈련이 필요할 것으로 예상됩니다.';
    } else {
        comments +=
            '평범한 수준의 독해 능력을 지니고 있으며, 종합적인 훈련을 통해 전반적으로 향상시킬 수 있는 잠재력을 지니고 있는 것으로 판단됩니다.';
    }
    return `${studentName} 학생은 ` + comments;
}
