const settingsForm = document.getElementById("settingsForm");

function initForm() {
    chrome.storage.local.get(["currenciesList", "currency"]).then((settings) => {
        // Populate dropdown with options
        for (let [key, value] of Object.entries(settings.currenciesList)) {
            const optionElement = document.createElement("option");
            optionElement.setAttribute("value", key);

            var optionText = key.toUpperCase();
            if (value.length > 0) {
                optionText = `${key.toUpperCase()} - ${value}`;
            }
            const optionTextNode = document.createTextNode(optionText);
            optionElement.appendChild(optionTextNode);

            settingsForm.currency.appendChild(optionElement);
        }
        // Initialize the form with the user's settings
        settingsForm.currency.value = settings.currency
    });
}
initForm()

// Persist settings changes
settingsForm.currency.addEventListener("change", (event) => {
    chrome.storage.local.set({ "currency": event.target.value });
});

// Tell service worker to refresh currency list and exchange rates, re-initialize form
settingsForm.refresh.addEventListener("click", () => {
    chrome.runtime.sendMessage("refreshData");
    initForm()
});
