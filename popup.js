'use strict';

(async function () {
    let table = document.querySelector('#table');
    let currencies = [];
    let currencyType = document.querySelector('#currencyType');
    let currencyValue = document.querySelector('#currencyValue');
    let currencyIndex = -1;
    let uahResult = document.querySelector('#uahResult');

    try {
        let response = await fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');

        currencies = await response.json();

        currencyIndex = getCurrencyIndex(currencyType.value);

        table.innerHTML = createTableHTML();

        currencyType.addEventListener('change', function () {
            currencyIndex = getCurrencyIndex(this.value);

            showUAH(currencyValue.value);
        });

        currencyValue.addEventListener('change', function () {
            showUAH(this.value);
        });
    } catch(err) {
        return onError();
    }

    function onError () {
        table.innerHTML = 'Не вдалося отримати данні :( Спробуйте еще раз, або пізніше.';
    }

    function createTableHTML () {
        let result = '<table><thead><tr><th>Валюта</th><th>Купівля</th><th>Продаж</th></tr></thead><tbody>';

        currencies.forEach(currency => {
            result += `<tr><td>${currency.ccy}</td><td>${currency.buy}</td><td>${currency.sale}</td></tr>`;
        });

        result += '</tbody></table>';

        return result;
    }

    function getCurrencyIndex (type) {
        return currencies.findIndex(currency => currency.ccy === type);
    }

    function calcUAH (value) {
        if (currencyIndex === -1) {
            return { buy: 0, sale: 0 };
        }

        let buy = (currencies[currencyIndex].buy * value).toFixed(2);
        let sale = (currencies[currencyIndex].sale * value).toFixed(2);

        return { buy, sale };
    }

    function showUAH (value) {
        let UAH = calcUAH(value);

        uahResult.innerText = `${UAH.buy} / ${UAH.sale}`;
    }
}());
