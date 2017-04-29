'use strict';

(function() {
    // const extPage = chrome.extension.getBackgroundPage(); // debug page
    // extPage.console.log(extPage);

    let container = document.querySelector('.container');

    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');

    xhr.addEventListener('load', function() {
        let response = {};

        // check valid JSON
        try {
            response = JSON.parse(this.responseText);
            // extPage.console.log(response);
        } catch(err) {
            return onError();
        }

        let result = '<table><tr><th>Валюта</th><th>Покупка</th><th>Продажа</th></tr>';
        response.forEach(currency => {
            result += `<tr><td>${currency.ccy}</td><td>${currency.buy}</td><td>${currency.sale}</td></tr>`;
        });
        result += '</table>';

        container.innerHTML = result;
    });

    xhr.addEventListener('error', onError);

    xhr.send();

    function onError() {
        container.innerHTML = 'Не удалось получить данные :( Попробуйте еще раз.';
    }
}());
