const debug = false;

// Fetch list of currencies from API on extension install, update and browser start
const getCurrencies = async () => {
    if (debug) {
        console.log('Fetching curreny list...');
    }
    const currenciesList = await (await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json')).json();
    if (debug) {
        console.log(currenciesList);
    }
    chrome.storage.local.set({ "currenciesList": currenciesList });
}
chrome.runtime.onInstalled.addListener(getCurrencies);
chrome.runtime.onStartup.addListener(getCurrencies)

// Fetch exchange rates from API on extension install, update and browser start
const getExchangeRate = async () => {
    if (debug) {
        console.log('Fetching exchange rates...');
    }
    chrome.storage.local.get(["currency"]).then(async (settings) => {
        if (typeof settings.currency !== 'undefined') {
            try {
                const exchangeRates = await (await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${settings.currency}.json`)).json();
                if (debug) {
                    console.log(exchangeRates[settings.currency]);
                }
                chrome.storage.local.set({ "exchangeRates": exchangeRates[settings.currency] });
            } catch (e) {
                console.log('Failed exchange rate fetch');
            }
        } else {
            if (debug) {
                console.log('Cancel exchange rate fetch, currency not defined.');
            }
        }
    });
}
chrome.runtime.onInstalled.addListener(getExchangeRate);
chrome.runtime.onStartup.addListener(getExchangeRate)

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        // Log storage changes
        if (debug && (key !== 'currenciesList') && (key !== 'exchangeRates')) {
            console.log(
                `Storage key "${key}" in namespace "${namespace}" changed.`,
                'Old value was:', oldValue, 'New value is:', newValue
            );
        }

        // Fetch exchange rates from API upon currency selection
        if (key === 'currency') {
            getExchangeRate()
        }
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (debug) {
        console.log(request);
        console.log(sender);
        console.log(sendResponse);
        // sendResponse({ msg: "hello to you too" })
    }
    if (request === 'refreshData') {
        getCurrencies()
        getExchangeRate()
    }
});
