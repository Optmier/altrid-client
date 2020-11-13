function MinutetoSecond(mm, ss) {
    let second;
    if (!mm) {
        mm = 0;
    }
    if (!ss) {
        ss = 0;
    }
    second = parseInt(mm) * 60 + parseInt(ss);
    return second;
}

function SecondtoMinute(time) {
    let mm = Math.floor(time / 60);
    let ss = time % 60;

    let arr = [];

    arr.push(mm, ss);

    return arr;
}

export { MinutetoSecond, SecondtoMinute };
