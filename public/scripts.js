const database = [];

// Função para converter uma string de data no formato "dd-MM-yyyy" para um objeto Date
function parseDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
    }

// Função para verificar se a data está dentro do intervalo
function isDateWithinRange(dateToCheck, startDate, endDate) {
    const date = parseDate(dateToCheck);
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    return date >= start && date <= end;
}

// Função para obter a data atual no formato "dd-MM-yyyy"
function getCurrentDateFormatted() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
}


// Função para popular o datalist e a const database
document.addEventListener("DOMContentLoaded", function() {
    fetch('./estoque.json')
        .then(response => response.json())
        .then(data => {
            let datalist = document.getElementById('itens');
            let today = getCurrentDateFormatted();

            data.forEach(item => {
                let preco = item["Preco Venda"];

                let option = document.createElement('option');
                option.value = `${item.Descricao} - R$ ${preco}`;
                datalist.appendChild(option); 
                database.push(item);
            });
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));
});