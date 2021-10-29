function HoursAndMinutesToSecond(hh, mm) {
    let seconds;
    if (!hh) {
        hh = 0;
    }
    if (!mm) {
        mm = 0;
    }
    seconds = parseInt(hh) * 3600 + parseInt(mm) * 60;
    return seconds;
}

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

function SecondsToHoursAndMinutes(time) {
    const hh = Math.floor(time / 3600);
    const mm = Math.floor(time / 60) % 60;
    const arr = [];
    arr.push(hh, mm);
    return arr;
}

export { MinutetoSecond, SecondtoMinute, HoursAndMinutesToSecond, SecondsToHoursAndMinutes };
