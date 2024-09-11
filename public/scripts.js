const database = [];
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const submitOrderButton = document.getElementById('submitOrderButton');
const nameInput = document.querySelector("#name");
const address = document.querySelector('#address');
const phone = document.querySelector('#phone');

document.querySelectorAll("#nameInput, #address, #phone").forEach(input =>{
    input.addEventListener('input'. checkInput);
})

//checar se o pedido atende aos requisitos
function checkInput(){
    if(nameInput.value.length > 3 && address.value.length > 5 &&  phone.value.length > 7) submitOrderButton.disabled = false
    else submitOrderButton.disabled = true; 
}

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
    checkInput()
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
    checkInput();
    if(cart.length === 0){ cartTableBody.innerHTML = `<tr><td colspan='4' class='text-center'> Seru Carrinho está vazio.</td></tr>`}}


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

function sendOrderViaWhatsApp(){
    const nameValue = nameInput.value;
    const addressValue = address.value;
    const phoneValue = phone.value;

    if(cart.length === 0){
        alert("Adicione pelo menos um item ao carrinho antes de enviar o pedido.")
        return;
    }

    let message = `*Pedido de Delivery - Acacio Bebidas*%0A`;
    message += `*Nome:* ${nameValue}%0A`;
    message += `*Endereço:* ${addressValue}%0A`;
    message += `*Telefone:* ${phoneValue}%0A`;
    message += `*Itens do Pedido:*0A`

    cart.forEach(item => {
        const price = item.precoPromocao > 0 ? item.precoPromocao : item.precoVenda;
        message += `- ${item.Descrição} x${item.quantity} (R$ ${price.toFixed(2)} cada)%0A`;
    });

    let total = cart.reduce((sum, item) => {
        const price = item.precoPromocao > 0 ? item.precoPromocao : item.precoVenda;
        return sum + price * item.quantity;
    }, 0);

    message += `%0A*Total do pedido: R$ ${total.toFixed(2)}*`;

    // Número de telefone do destinatário com o código do país (no caso, +55 para o Brasil)
    const whatsappNumber = "5584988989357";

    // URL de envio para o WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Redireciona o usuário para o WhatsApp
    window.open(whatsappUrl, '_blank');
}

// Função para enviar o pedido quando o formulário for submetido
document.getElementById('deliveryForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio tradicional do formulário
    sendOrderViaWhatsApp(); // Chama a função para enviar via WhatsApp
});