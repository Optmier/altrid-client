const getAchieveValueForTypes = (
    datas = [
        { category: 1, count: 1 },
        { category: 2, count: 0 },
        { category: 3, count: 1 },
        { category: 5, count: 0 },
        { category: 6, count: 0 },
    ],
    nums = 3,
) => {
    let value = 0.0;
    datas.sort((a, b) => b.count - a.count);
    for (let i = 0; i < nums; i++) {
        if (!datas[i]) break;
        value += ((datas[i].count > nums ? nums : datas[i].count) / nums / nums) * 100.0;
    }
    return {
        value: Math.round(value),
        satisfieds: datas.filter((d, i) => d.count && i < nums),
        allExists: datas,
    };
};

export default getAchieveValueForTypes;
