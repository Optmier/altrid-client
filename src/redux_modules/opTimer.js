/** Action types */
const START = 'optimer/START';
const PAUSE = 'optimer/PAUSE';
const RESUME = 'optimer/RESUME';
const STOP = 'optimer/STOP';
const SAVE = 'optimer/SAVE';
const STOP_AND_SAVE = 'optimer/STOP_AND_SAVE';

/** Action creator functions */
const OpTimer = {
    start() {
        return {
            type: START,
        };
    },
};
