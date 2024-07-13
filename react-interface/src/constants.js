// actions
export const GET_DEFAULTS = 'GET_DEFAULTS';
export const UPDATE_DEFAULTS = 'UPDATE_DEFAULTS';

export const SET_PARAMS_ON = 'SET_PARAMS_ON';
export const SET_PARAMS_OFF = 'SET_PARAMS_OFF';
export const UPDATE_PARAMS = 'UPDATE_PARAMS';

export const HANDLE_REQUEST = 'HANDLE_REQUEST';

// inputs
export const AC_MODE = [
    { value: 0, label: 'Auto' },
    { value: 1, label: 'Cool' },
    { value: 2, label: 'Dry' },
    { value: 3, label: 'Fan' },
    { value: 4, label: 'Heat' }
];

export const AC_TEMP = [
    { value: 16, label: '16°' },
    { value: 17, label: '17°' },
    { value: 18, label: '18°' },
    { value: 19, label: '19°' },
    { value: 20, label: '20°' },
    { value: 21, label: '21°' },
    { value: 22, label: '22°' },
    { value: 23, label: '23°' },
    { value: 24, label: '24°' },
    { value: 25, label: '25°' },
    { value: 26, label: '26°' },
    { value: 27, label: '27°' },
    { value: 28, label: '28°' },
    { value: 29, label: '29°' },
    { value: 30, label: '30°' },
    { value: 31, label: '31°' },
    { value: 32, label: '32°' },

];

export const AC_DIRECTION = [
    { value: 1, label: 'Auto' },
    { value: 7, label: 'Low auto' },
    { value: 9, label: 'Middle auto' },
    { value: 11, label: 'High auto' },
    { value: 2, label: 'Highest' },
    { value: 3, label: 'High' },
    { value: 4, label: 'Middle' },
    { value: 5, label: 'Low' },
    { value: 6, label: 'Lowest' }
];

export const AC_FAN_SPEED = [
    { value: 0, label: 'Auto' },
    { value: 1, label: 'Slow' },
    { value: 2, label: 'Middle' },
    { value: 3, label: 'Maxim' },
];