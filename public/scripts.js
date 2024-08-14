const database = [];
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const submitOrderButton = document.getElementById('submitOrderButton');


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
                let preco = typeof item["Preco Venda"] === 'string' 
                    ? parseFloat(item["Preco Venda"].replace(',', '.')) 
                    : item["Preco Venda"];

                let precoPromocao = typeof item["Preco Prom."] === 'string' 
                    ? parseFloat(item["Preco Prom."].replace(',', '.')) 
                    : item["Preco Prom."];
                let dataIniProm = item["Data Ini Prom"];
                let dataLimProm = item["Data Lim. Prom."];

                let option = document.createElement('option');
                if (isDateWithinRange(today, dataIniProm, dataLimProm) && precoPromocao > 0) {
                    option.value = `(${item.IdProduto}) ${item.Descrição} - de R$ ${preco.toFixed(2)} por R$ ${precoPromocao.toFixed(2)}`;
                } else {
                    option.value = `(${item.IdProduto}) ${item.Descrição} - R$ ${preco.toFixed(2)}`;
                }
                datalist.appendChild(option); 
                database.push({...item, precoVenda: preco, precoPromocao: precoPromocao}); // Armazenar como número
            });
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));

        updateCartDisplay()
});
// Função para adicionar um item ao carrinho
function addToCart(item, quantity) {
    const existingItem = cart.find(cartItem => cartItem.IdProduto === item.IdProduto);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        item.quantity = quantity;
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Função para atualizar a exibição do carrinho
function updateCartDisplay() {
    const cartTableBody = document.querySelector('table tbody');
    const totalDisplay = document.getElementById('total');

    cartTableBody.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        const price = item.precoPromocao > 0 ? item.precoPromocao : item.precoVenda;

        const row = document.createElement('tr');

        // Coluna do Produto
        const productCell = document.createElement('td');
        productCell.textContent = item.Descrição;
        row.appendChild(productCell);

        // Coluna da Quantidade
        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        row.appendChild(quantityCell);

        // Coluna do Total
        const totalCell = document.createElement('td');
        totalCell.textContent = `R$ ${(price * item.quantity).toFixed(2)}`;
        row.appendChild(totalCell);

        // Coluna do Botão de Remover
        const removeCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.textContent = 'Remover';
        removeButton.onclick = function() {
            removeFromCart(index);
        };
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);

        // Adiciona a linha na tabela
        cartTableBody.appendChild(row);

        total += price * item.quantity;
    });

    totalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;
    submitOrderButton.style.display = cart.length > 0 ? 'block' : 'none';
}


// Função para remover um item do carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Adicionar produto ao carrinho ao clicar no botão
document.getElementById('addProductButton').addEventListener('click', function() {
    const selectedValue = document.getElementById('produtos').value;
    const selectedProductIndex = parseInt(selectedValue.match(/^\((\d+)\)/)?.[1], 10);
    const selectedProduct = database.find(item => item.IdProduto === selectedProductIndex);

    if (selectedProduct) {
        const quantity = parseInt(prompt('Digite a quantidade desejada:'), 10);
        if (quantity && !isNaN(quantity) && quantity > 0) {
            addToCart(selectedProduct, quantity);
            document.getElementById('produtos').value="";
        } else {
            alert('Quantidade inválida.');
        }
    } else {
        alert('Selecione um produto válido.');
    }
});

submitOrderButton.addEventListener('click', function() {
    const cartItems = cart.map(item => {
        const price = item.precoPromocao > 0 ? item.precoPromocao : item.precoVenda;
        return `- ${item.Descrição} (x${item.quantity}): R$ ${(price * item.quantity).toFixed(2)}`;
    }).join('\n');

    const total = cart.reduce((sum, item) => {
        const price = item.precoPromocao > 0 ? item.precoPromocao : item.precoVenda;
        return sum + (price * item.quantity);
    }, 0);

    const message = `Olá, gostaria de fazer um pedido:\n\n${cartItems}\n\nTotal: R$ ${total.toFixed(2)}`;

    const phoneNumber = '558488989357'; // Código do país + DDD + número
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
});
