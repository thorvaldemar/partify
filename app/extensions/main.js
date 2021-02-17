/**
 * @callback nodeCallCallback
 * @param {Object} data the output of the request
 */

/**
 * A JQuery AJAX request for node js
 * @param {String} url Path to the request
 * @param {Array<String>} params Params to use in the request
 * @param {nodeCallCallback} callback Output of the request
 * @param {String} reqType 'post' or 'get'; default is 'post'
 * @param {String} cbType 'json' or 'text'; default is 'json'
 */
function nodeCall(url, params, callback = (data) => {}, reqType = 'post', cbType = 'json') {
    var p = '';
    params.forEach(e => {
        p += '/' + encodeURIComponent(e);
    });
    switch (reqType) {
        case 'post':
            $.post(`${url}${p}`, data => { callback(data); }, cbType);
            break;
        case 'get':
            if (cbType == 'json') $.getJSON(`${url}${p}`, data => { callback(data); });
            else $.get(`${url}${p}`, data => { callback(data); });
            break;
        default:
            throw Error(reqType + ' is not a valid nodeCall request type');
    }
}