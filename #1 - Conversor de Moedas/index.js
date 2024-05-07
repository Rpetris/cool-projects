function setupCurrencyConverter() {
    const fromCur = document.querySelector(".from select");
    const toCur = document.querySelector(".to select");
    const getBtn = document.querySelector("form button");
    const exIcon = document.querySelector("form .reverse");
    const amount = document.querySelector("form input");
    const exRateTxt = document.querySelector("form .result");

    // Event Listener para o select da moeda (selects dos países)
    [fromCur, toCur].forEach((select, i) => {
        for (let curCode in Country_List) {
            const selected = (i === 0 && curCode === "USD") || (i === 1 && curCode === "BRL") ? "selected" : "";
            select.insertAdjacentHTML("beforeend", `<option value="${curCode}" ${selected}>${curCode}</option>`);
        }
        select.addEventListener("change", () => {
            const code = select.value;
            const imgTag = select.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
        });
    });

    // Função para pegar a taxa de conversão da moeda na API
    async function getExchangeRate() {
        const amountVal = amount.value || 1;
        exRateTxt.innerText = "Pegando a taxa de conversão...";
        try {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/48ac44b265e407a4124c2d6d/latest/${fromCur.value}`);
            const result = await response.json();
            const exchangeRate = result.conversion_rates[toCur.value];
            const totalExRate = (amountVal * exchangeRate).toFixed(2);
            exRateTxt.innerText = `${amountVal} ${fromCur.value} = ${totalExRate} ${toCur.value}`;
        } catch (error) {
            exRateTxt.innerText = "Algo deu errado...";
        }
    }

    // Event Listener para o botão e icone de mudar as conversões
    window.addEventListener("load", getExchangeRate);
    getBtn.addEventListener("click", (e) => {
        e.preventDefault();
        getExchangeRate();
    });

    exIcon.addEventListener("click", () => {
        [fromCur.value, toCur.value] = [toCur.value, fromCur.value];
        [fromCur, toCur].forEach((select) => {
            const code = select.value;
            const imgTag = select.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
        });
        getExchangeRate();
    });
}

// Chamar a função para inicializar o conversor de moeda (Garante que nada seja alterado no funcionamento original)
setupCurrencyConverter();
