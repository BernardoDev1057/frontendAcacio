    let estoque = [];

    // Função para carregar produtos
    async function carregarProdutos() {
        try {
            const response = await fetch('estoque.json?date=' + new Date());  // Puxa o arquivo estoque.json
            estoque = await response.json();  // Converte a resposta para JSON
            const datalist = document.getElementById('itens');
            const dataAtual = new Date();

            // Iterar sobre os produtos no estoque
            for (const idProduto in estoque) {
                const produto = estoque[idProduto];
                const option = document.createElement('option');
                
                const dataInicioProm = new Date(produto.DATA_INICIO_PROM);
                const dataLimiteProm = new Date(produto.DATA_LIMITE_PROM);

                // Se o preço promocional for maior que 0 e a data estiver correta, adiciona "em oferta" ao nome do produto
                if (produto.PRECO_PROMOCIONAL > 0 && dataAtual >= dataInicioProm && dataAtual <= dataLimiteProm) {
                    option.textContent = `${produto.descricao} DE R$ ${produto.PRECO_VENDA} POR R$ ${produto.PRECO_PROMOCIONAL} (Em promoção)`;
                } else {
                    option.textContent = `${produto.descricao} - R$ ${produto.PRECO_VENDA}`;
                }

                // O valor do option será o ID do produto
                option.value = produto.IDPRODUTO;
                datalist.appendChild(option);
            }
        } catch (erro) {
            console.error('Erro ao carregar o arquivo JSON:', erro);
        }
    }

    // Função para adicionar um produto ao carrinho
    function adicionarProdutoAoCarrinho(idProduto, descricao, precoUnitario, quantidade) {
        let carrinho = JSON.parse(localStorage.getItem('cart')) || {
            inicio_pedido: new Date().toISOString(),
            fim_pedido: null,
            produtos: [],
            nome: '',
            endereco: '',
            identificador_unico: gerarIdentificadorUnico()
        };

        // Verificar se o produto já está no carrinho
        const produtoExistente = carrinho.produtos.find(item => item.IDPRODUTO === idProduto);

        if (produtoExistente) {
            // Atualizar a quantidade e o total se o produto já estiver no carrinho
            produtoExistente.quantidade += quantidade;
            produtoExistente.total = produtoExistente.quantidade * produtoExistente.preco_unitario;
        } else {
            // Adicionar novo produto ao carrinho
            carrinho.produtos.push({
                IDPRODUTO: idProduto,
                descricao: descricao,
                quantidade: quantidade,
                preco_unitario: precoUnitario,
                total: quantidade * precoUnitario
            });
        }

        // Salvar o carrinho atualizado no localStorage
        localStorage.setItem('cart', JSON.stringify(carrinho));

        // Atualizar a exibição do carrinho
        exibirCarrinho();
    }

    // Função para gerar um identificador único
    function gerarIdentificadorUnico() {
        return 'ID' + Math.floor(Math.random() * 1000000);
    }

    // Função para exibir o carrinho de compras
    function exibirCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('cart')) || {
            produtos: []
        };
        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';

        let totalGeral = 0;

        carrinho.produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.descricao}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.total.toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removerProduto(${produto.IDPRODUTO})">Remover</button></td>
            `;
            tbody.appendChild(tr);

            totalGeral += produto.total;
        });

        document.getElementById('total').textContent = `Total: R$ ${totalGeral.toFixed(2)}`;
    }

    // Função para remover um produto do carrinho
    function removerProduto(idProduto) {
        let carrinho = JSON.parse(localStorage.getItem('cart')) || {
            produtos: []
        };

        carrinho.produtos = carrinho.produtos.filter(produto => produto.IDPRODUTO !== idProduto);

        // Atualizar o carrinho no localStorage
        localStorage.setItem('cart', JSON.stringify(carrinho));

        // Atualizar a exibição do carrinho
        exibirCarrinho();
    }

    // Função para capturar o produto selecionado
    function capturarProdutoSelecionado() {
        const inputProdutos = document.querySelector("#produtos");
        const produtoSelecionado = inputProdutos.value;

        if (!produtoSelecionado) { return; }

        const produto = estoque[produtoSelecionado];
        if (!produto) { return; }

        // Limpar o campo de produto
        inputProdutos.value = '';

        // Exibir o modal para capturar a quantidade
        exibirModalProduto(produto.IDPRODUTO, produto.descricao, produto.PRECO_VENDA);
    }

    // Função para exibir o modal do produto
    function exibirModalProduto(idProduto, descricao, precoUnitario) {
        const modalDescricao = document.getElementById('modalProdutoDescricao');
        const modalPreco = document.getElementById('modalProdutoPreco');
        const modalQuantidade = document.getElementById('modalQuantidade');
        const modalAdicionarButton = document.getElementById('modalAdicionarButton');

        if (!modalDescricao || !modalPreco || !modalQuantidade || !modalAdicionarButton) {
            console.error('Um ou mais elementos do modal não foram encontrados.');
            return;
        }

        // Atualizar o conteúdo do modal
        modalDescricao.textContent = descricao;
        modalPreco.textContent = `R$ ${precoUnitario.toFixed(2)}`;

        // Mostrar o modal
        const modal = new bootstrap.Modal(document.getElementById('modalProduto'));
        modal.show();

        // Configurar o evento do botão "Adicionar"
        modalAdicionarButton.onclick = function () {
            const quantidade = parseInt(modalQuantidade.value);
            if (isNaN(quantidade) || quantidade <= 0) {
                alert('Quantidade inválida.');
                return;
            }

            adicionarProdutoAoCarrinho(idProduto, descricao, precoUnitario, quantidade);
            modal.hide();
        };
    }

    // Função para exibir produtos em promoção no modal
    function exibirPromocoesModal() {
    const dataAtual = new Date();
    const modalPromocaoBody = document.getElementById('modalPromocaoBody');
    modalPromocaoBody.innerHTML = ''; // Limpar o conteúdo anterior

    // Iterar sobre os produtos e exibir os que estão em promoção
    let promocaoEncontrada = false;
    for (const idProduto in estoque) {
        const produto = estoque[idProduto];
        const dataInicioProm = new Date(produto.DATA_INICIO_PROM);
        const dataLimiteProm = new Date(produto.DATA_LIMITE_PROM);

        // Verificar se o produto está em promoção
        if (produto.PRECO_PROMOCIONAL > 0 && dataAtual >= dataInicioProm && dataAtual <= dataLimiteProm) {
            promocaoEncontrada = true;

            // Criar um elemento para cada produto em promoção
            const divProduto = document.createElement('div');
            divProduto.classList.add('produto-promocao');
            divProduto.innerHTML = `
                <img src="img/${produto.IDPRODUTO}.png" alt="${produto.descricao}" class="img-fluid" style="width: 80%; margin-bottom: 10px;">
                <p>${produto.descricao}</p>
                <p>De R$ ${produto.PRECO_VENDA.toFixed(2)} por <strong>R$ ${produto.PRECO_PROMOCIONAL.toFixed(2)}</strong></p>
            `;
            modalPromocaoBody.appendChild(divProduto);
        }
    }

    // Se não houver promoções, exibir uma mensagem
    if (!promocaoEncontrada) {
        modalPromocaoBody.innerHTML = '<p>Nenhuma promoção disponível no momento.</p>';
    }

    // Mostrar o modal
    const modalPromocao = new bootstrap.Modal(document.getElementById('modalPromocao'));
    modalPromocao.show();
    }

    // Chamar a função para exibir promoções após carregar produtos
    carregarProdutos().then(() => {
        exibirPromocoesModal();
    });

    // Capturador de evento quando o usuário clica em adicionar o produto
    document.getElementById('addProductButton').addEventListener('click', capturarProdutoSelecionado);

    // Carregar produtos e exibir o carrinho ao carregar a página
    carregarProdutos();
    exibirCarrinho();


    document.getElementById('submitOrderButton').addEventListener('click', function() {
        // Pega as informações do carrinho do localStorage
        let carrinho = JSON.parse(localStorage.getItem('cart'));

        if (!carrinho || carrinho.produtos.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        // Informações básicas do pedido
        let nome = carrinho.nome;
        let endereco = carrinho.endereco;
        let produtos = carrinho.produtos;

        // Monta a mensagem
        let mensagem = `Pedido de ${nome}\nEndereço: ${endereco}\n\nItens do pedido:\n`;

        // Adiciona os produtos à mensagem
        produtos.forEach(produto => {
            mensagem += `${produto.descricao} - Quantidade: ${produto.quantidade}, Total: R$${produto.total.toFixed(2)}\n`;
        });

        // Adiciona o total geral à mensagem
        let totalGeral = produtos.reduce((acc, produto) => acc + produto.total, 0);
        mensagem += `\nTotal geral: R$${totalGeral.toFixed(2)}\n`;

        // Encode a mensagem para ser usada na URL do WhatsApp
        let mensagemEncoded = encodeURIComponent(mensagem);

        // Número do WhatsApp do destinatário (já no formato correto para WhatsApp)
        let numeroWhatsApp = "5584988989357";  // Aqui está o número fornecido

        // URL do WhatsApp com a mensagem
        let urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemEncoded}`;

        // Redireciona para o WhatsApp com a mensagem formatada
        window.open(urlWhatsApp, '_blank');
    });