const getColorSets = (series, color) => {
    switch (series) {
        case 50:
            return getColors050(color);
        case 100:
            return getColors100(color);
        case 200:
            return getColors200(color);
        case 300:
            return getColors300(color);
        case 400:
            return getColors400(color);
        case 500:
            return getColors500(color);
        case 600:
            return getColors600(color);
        case 700:
            return getColors700(color);
        default:
            return getColors050(color);
    }
};

const getColors050 = (color) => {
    switch (color) {
        case 'gray':
            return '#f6f8f9';
        case 'red':
            return '#ffefed';
        case 'orange':
            return '#fff3ef';
        case 'yellow':
            return '#fffaf0';
        case 'green':
            return '#f0fff9';
        case 'blue':
            return '#eff3fe';
        case 'purple':
            return '#f4f1fa';
        case 'white':
            return '#ffffff';
        case 'black':
        default:
            return '#000000';
    }
};

const getColors100 = (color) => {
    switch (color) {
        case 'gray':
            return '#E9EDEF';
        case 'red':
            return '#FED7D2';
        case 'orange':
            return '#FFE1D6';
        case 'yellow':
            return '#FFF2D9';
        case 'green':
            return '#FFF2D9';
        case 'blue':
            return '#D4E2FC';
        case 'purple':
            return '#E3DDF2';
        case 'white':
            return '#ffffff';
        case 'black':
        default:
            return '#000000';
    }
};

const getColors200 = (color) => {
    switch (color) {
        case 'gray':
            return '#BFC6CD';
        case 'red':
            return '#F1998E';
        case 'orange':
            return '#FABDA5';
        case 'yellow':
            return '#FFE3AC';
        case 'green':
            return '#3AE2A1';
        case 'blue':
            return '#A0BFF8';
        case 'purple':
            return '#C1B5E3';
        case 'white':
            return '#ffffff';
        case 'black':
        default:
            return '#000000';
    }
};

const getColors300 = (color) => {
    switch (color) {
        case 'gray':
            return '#9AA5AF';
        case 'red':
            return '#E85C4A';
        case 'orange':
            return '#FA9269';
        case 'yellow':
            return '#FFCF70';
        case 'green':
            return '#3AE2A1';
        case 'blue':
            return '#5B91F5';
        case 'purple':
            return '#957FCE';
        case 'white':
            return '#ffffff';
        case 'black':
        default:
            return '#000000';
    }
};

const getColors400 = (color) => {
    switch (color) {
        case 'gray':
            return '#77818B';
        case 'red':
            return '#E11900';
        case 'orange':
            return '#FF6937';
        case 'yellow':
            return '#FFC043';
        case 'green':
            return '#0CB573';
        case 'blue':
            return '#276EF1';
        case 'purple':
            return '#6C46A1';
        case 'white':
            return '#ffffff';
        case 'black':
        default:
            return '#000000';
    }
};

const getColors500 = (color) => {
    switch (color) {
        case 'gray':
            return '#4D5C6A';
        case 'red':
            return '#AB1300';
        case 'orange':
            return '#C14F29';
        case 'yellow':
            return '#BC8B2C';
        case 'green':
            return '#008F58';
        case 'blue':
            return '#1E54B7';
        case 'purple':
            return '#3B1689';
        case 'white':
            return '#ffffff';
        case 'black':
        default:
            return '#000000';
    }
};

const getColors600 = (color) => {
    switch (color) {
        case 'gray':
            return '#2D3843';
        case 'red':
            return '#870F00';
        case 'orange':
            return '#9A3F21';
        case 'yellow':
            return '#997328';
        case 'green':
            return '#0A5946';
        case 'blue':
            return '#174291';
        case 'purple':
            return '#200656';
        case 'white':
            return '#ffffff';
        case 'black':
        default:
            return '#000000';
    }
};

const getColors700 = (color) => {
    switch (color) {
        case 'gray':
            return '#11171C';
        case 'red':
            return '#5A0A00';
        case 'orange':
            return '#672A16';
        case 'yellow':
            return '#674D1B';
        case 'green':
            return '#054032';
        case 'blue':
            return '#102C60';
        case 'purple':
            return '#2E224C';
        case 'white':
            return '#ffffff';
        case 'black':
        default:
            return '#000000';
    }
};

export { getColorSets, getColors050, getColors100, getColors200, getColors300, getColors400, getColors500, getColors600, getColors700 };
