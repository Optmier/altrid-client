/* eslint-disable no-control-regex */
export function stringifiedJsonUnparser(stringifiedJson: String, initData = null) {
    let _data = initData;
    try {
        _data = JSON.parse(
            stringifiedJson
                .replace(/\\n/g, '\\n')
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, '\\&')
                .replace(/\\r/g, '\\r')
                .replace(/\\t/g, '\\t')
                .replace(/\\b/g, '\\b')
                .replace(/\\f/g, '\\f')
                .replace(/[\u0000-\u0019]+/g, ''),
        );
    } catch (e) {
        // buildMode === 'dev' && console.error(e);
    }
    return _data;
}
