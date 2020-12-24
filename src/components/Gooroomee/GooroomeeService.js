class GooroomeeService {
    constructor() {
        this.loadScript();
    }

    loadScript() {
        const apiServer = 'bizapi.gooroomee.com';
        const version = '1.1.13';
        var w = window;
        if (w.GooroomeeMeeting) {
            return (window.console.error || window.console.log || function () {})('GooroomeeMeeting script included twice.');
        }
        var gm = function () {
            gm.c(arguments);
        };
        gm.q = [];
        gm.c = function (args) {
            gm.q.push(args);
        };
        w.GooroomeeMeeting = gm;
        function l() {
            var api = document.createElement('script');
            api.type = 'text/javascript';
            api.async = true;
            api.src = `https://${apiServer}/libs/meet/${version}/js/gooroomee-meeting-api.js`;
            api.charset = 'UTF-8';
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(api, x);
        }
        if (document.readyState === 'complete') {
            l();
        } else if (window.attachEvent) {
            window.attachEvent('onload', l);
        } else {
            window.addEventListener('DOMContentLoaded', l, false);
            window.addEventListener('load', l, false);
        }
    }

    test() {
        console.log('gooroomee!');
    }
}

export default new GooroomeeService();
