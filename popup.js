'use strict';

(function() {
    // const extPage = chrome.extension.getBackgroundPage(); // debug page
    // extPage.console.log(extPage);

    let table = document.querySelector('.table');
    let currencies = [];
    let currencyType = document.querySelector('select#currencyType');
    let currencyValue = document.querySelector('input#currencyValue');
    let currencyIndex = -1;
    let uahResult = document.querySelector('span#uahResult');

    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=11');

    xhr.addEventListener('load', function() {
        // check valid JSON
        try {
            currencies = JSON.parse(this.responseText);
            // extPage.console.log(response);
        } catch(err) {
            return onError();
        }

        currencyIndex = getCurrencyIndex(currencyType.value);

        table.innerHTML = createTableHTML();

        currencyType.addEventListener('change', function() {
            currencyIndex = getCurrencyIndex(this.value);
            showUAH(currencyValue.value);
        });

        currencyValue.addEventListener('change', function() {
            showUAH(this.value);
        });
    });

    xhr.addEventListener('error', onError);

    xhr.send();

    function onError() {
        table.innerHTML = 'Не удалось получить данные :( Попробуйте еще раз.';
    }

    function createTableHTML() {
        let result = '<table><tr><th>Валюта</th><th>Покупка</th><th>Продажа</th></tr>';

        currencies.forEach(currency => {
            result += `<tr><td>${currency.ccy}</td><td>${currency.buy}</td><td>${currency.sale}</td></tr>`;
        });

        result += '</table>';

        return result;
    }

    function getCurrencyIndex(type) {
        for (let i = 0; i < currencies.length; i++) {
            if (currencies[i].ccy === type) {
                return i;
            }
        }

        return -1;
    }

    function calcUAH(value) {
        if (currencyIndex === -1) {
            return {buy: 0, sale: 0};
        }

        let buy = (currencies[currencyIndex].buy * value).toFixed(5);
        let sale = (currencies[currencyIndex].sale * value).toFixed(5);
        return {buy, sale};
    }

    function showUAH(value) {
        let UAH = calcUAH(value);
        uahResult.innerText = `${UAH.buy} / ${UAH.sale}`;
    }
}());
