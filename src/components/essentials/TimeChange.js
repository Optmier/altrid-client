function MinutetoSecond(time) {}

function SecondtoMinute(time) {
    let mm = Math.floor(time / 60);
    let ss = time % 60;

    let arr = [];

    arr.push(mm, ss);

    return arr;
}

export { MinutetoSecond, SecondtoMinute };
