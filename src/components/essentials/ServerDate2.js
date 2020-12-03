export default function ServerDate2() {
    const xmlHttp = new XMLHttpRequest();
    try {
        xmlHttp.open('HEAD', window.location.href.toString(), false);
        xmlHttp.setRequestHeader('Content-Type', 'text/html');
        xmlHttp.send('');
        return xmlHttp.getResponseHeader('Date');
    } catch (e) {
        console.error(e);
        return new Date();
    }
}
