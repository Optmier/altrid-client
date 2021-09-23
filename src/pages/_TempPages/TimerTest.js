import React, { useEffect, useRef } from 'react';
import { OpTimer } from '../../components/OpTimer/OpTimer';

function TimerTest() {
    const timerRef = useRef();

    useEffect(() => {
        timerRef.current = new OpTimer(45, '116417327294551439010');
        console.log(timerRef.current.getLeaderBoard());
    }, []);

    return (
        <>
            <div>
                <button onClick={() => timerRef.current.start()}>start</button>
                <button onClick={() => timerRef.current.pause()}>pause</button>
                <button onClick={() => timerRef.current.resume()}>resume</button>
                <button onClick={() => timerRef.current.stop()}>stop</button>
                <button onClick={() => timerRef.current.stopAndSave()}>stopAndSave</button>
            </div>
        </>
    );
}

export default TimerTest;
