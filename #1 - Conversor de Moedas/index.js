function setupCurrencyConverter() {
    const fromCurrencySelect = document.querySelector(".from select");
    const toCurrencySelect = document.querySelector(".to select");
    const convertButton = document.querySelector("form button");
    const reverseIcon = document.querySelector("form .reverse");
    const amountInput = document.querySelector("form input");
    const resultText = document.querySelector("form .result");

    // Event Listeners para os selects de moeda
    [fromCurrencySelect, toCurrencySelect].forEach((select, i) => {
        for (let currencyCode in Country_List) {
            const selected = (i === 0 && currencyCode === "USD") || (i === 1 && currencyCode === "BRL") ? "selected" : "";
            select.insertAdjacentHTML("beforeend", `<option value="${currencyCode}" ${selected}>${currencyCode}</option>`);
        }
        select.addEventListener("change", () => {
            const code = select.value;
            const imgTag = select.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
        });
    });

    // Função para obter a taxa de conversão da moeda na API
    async function getExchangeRate() {
        const amountValue = amountInput.value || 1;
        resultText.innerText = "Pegando a taxa de conversão...";
        try {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/48ac44b265e407a4124c2d6d/latest/${fromCurrencySelect.value}`);
            const result = await response.json();
            const exchangeRate = result.conversion_rates[toCurrencySelect.value];
            const totalExchangeRate = (amountValue * exchangeRate).toFixed(2);
            resultText.innerText = `${amountValue} ${fromCurrencySelect.value} = ${totalExchangeRate} ${toCurrencySelect.value}`;
        } catch (error) {
            resultText.innerText = "Algo deu errado...";
        }
    }

    // Event Listeners para o botão de conversão e ícone de troca de moedas
    window.addEventListener("load", getExchangeRate);
    convertButton.addEventListener("click", (e) => {
        e.preventDefault();
        getExchangeRate();
    });

    reverseIcon.addEventListener("click", () => {
        [fromCurrencySelect.value, toCurrencySelect.value] = [toCurrencySelect.value, fromCurrencySelect.value];
        [fromCurrencySelect, toCurrencySelect].forEach((select) => {
            const code = select.value;
            const imgTag = select.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
        });
        getExchangeRate();
    });
}

// Chamar a função para inicializar o conversor de moeda
setupCurrencyConverter();
