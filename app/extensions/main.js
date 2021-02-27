const fallbackLanguage = "EN";
const theme = () => {
    if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');
    return localStorage.getItem('theme');
};

var langpack = null;
nodeCall('/getUserCountry', [], data => {
    $.getJSON('/public/language.json', langs => {
        console.log(data);
        if (Object.keys(langs).includes(data.country.toUpperCase())) langpack = langs[data.country.toUpperCase()];
        else langpack[fallbackLanguage.toUpperCase()];
        updateLang();
    });
});

$(() => {
    $('body').attr('theme', theme());
    updateLang();
    $('body').change(() => updateLang());
});

/**
 * @ignore
 */
function updateLang() {
    if (langpack) {
        $('body [transcode]').each(function() {
            if ($(this).is('input')) $(this).attr('placeholder', translate($(this).attr('transcode')));
            else $(this).text(translate($(this).attr('transcode')));
        });
    }
}

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


/**
 * @typedef LanguageObject
 * @param {String} translation The translation
 */

/**
 * @typedef LanguageObjects
 * @param {String} transcode The code of the translation
 * @param {String} translation The translation
 */

/**
 * @typedef LanguagePack
 * @param {Array<LanguageObjects>} translations All translations
 */

/**
 * 
 * @param {String} transcode The code of the string to translate
 * @returns {LanguageObject|LanguagePack} Either returns LanguageObject if transcode is set else LanguagePack
 */
function translate(transcode = null) {
    if (!transcode) return langpack;
    return langpack[transcode];
}