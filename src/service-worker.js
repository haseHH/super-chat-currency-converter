const debug = true;

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

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        // Log storage changes
        if (debug) {
            console.log(
                `Storage key "${key}" in namespace "${namespace}" changed.`,
                'Old value was:', oldValue, 'New value is:', newValue
            );
        }
    }
});
