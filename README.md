# Acacio Bebidas - Sistema de Solicitação de Delivery

Este é um sistema simples de solicitação de delivery para o comércio **Acacio Bebidas**. O sistema permite que os clientes preencham seus dados e selecionem produtos disponíveis para compra, incluindo itens em promoção, e os adicionem a um carrinho de compras. A aplicação também armazena o carrinho localmente e exibe o total do pedido antes da finalização.

## Funcionalidades

- **Formulário de Pedido**: O cliente preenche seu nome e endereço para solicitar a entrega.
- **Seleção de Produtos**: Produtos disponíveis no estoque são exibidos em uma lista para seleção, com preços promocionais destacados.
- **Carrinho de Compras**: O cliente pode adicionar produtos ao carrinho, definir quantidades e visualizar o valor total do pedido.
- **Promoções Semanais**: Produtos em promoção são exibidos dinamicamente em um modal especial.
- **Firebase Analytics**: Integrado com o Firebase para coletar dados analíticos sobre o uso do site.

## Estrutura do Projeto

### 1. `index.html`
Contém a estrutura básica do site, com o formulário para solicitação de delivery, a tabela para exibição do carrinho de compras e modais para promoções e confirmação de produtos.

- **Bootstrap 5**: Utilizado para estilização responsiva e componentes modais.
- **Formulário**: Inclui campos para o cliente preencher seu nome, endereço e selecionar produtos.
- **Tabela do Carrinho**: Exibe os produtos selecionados, suas quantidades e o total.
- **Modais**: Para confirmação de quantidade de produtos e exibição de promoções.

### 2. `styles.css`
Este arquivo contém as estilizações customizadas do site, utilizando uma paleta de cores baseadas em **laranja e azul**. Principais características:

- **Botões**: Azul para enviar a solicitação e laranja para adicionar produtos ao carrinho.
- **Tabela de Carrinho**: Estilo limpo com foco nos valores e quantidades dos produtos.
- **Modal de Promoções**: Exibe de forma clara e visualmente atraente os produtos em promoção.

### 3. `scripts.js`
Contém toda a lógica da aplicação:

- **Carregamento dos Produtos**: Utiliza um arquivo `estoque.json` para carregar dinamicamente os produtos e suas promoções.
- **Carrinho de Compras**: O carrinho é armazenado no `localStorage`, permitindo que o usuário continue a compra mesmo após recarregar a página.
- **Promoções Dinâmicas**: Exibe produtos em promoção de acordo com as datas configuradas.
- **Modal de Produto**: Captura a quantidade e preço do produto selecionado antes de adicionar ao carrinho.

### 4. `estoque.json`
Arquivo externo com o inventário de produtos. Este arquivo contém informações como nome, preço, preço promocional, e datas de início e fim das promoções.

### 5. Firebase
O Firebase é utilizado para coleta de dados analíticos do site através do **Firebase Analytics**. Isso ajuda a monitorar o comportamento dos usuários e otimizar a experiência do cliente.

## Tecnologias Utilizadas

- **HTML5** e **CSS3**: Para estrutura e design responsivo.
- **JavaScript**: Lógica do frontend, manipulação do DOM, e armazenamento local de dados.
- **Bootstrap 5**: Framework CSS para responsividade e estilização.
- **Firebase Analytics**: Coleta de dados sobre o uso da aplicação.
- **JSON**: Usado para o armazenamento dos dados dos produtos em `estoque.json`.

## Como Usar

1. Clone este repositório em seu computador.
2. Abra o arquivo `index.html` em um navegador.
3. Preencha os dados no formulário de solicitação.
4. Selecione produtos e adicione-os ao carrinho.
5. Envie a solicitação de pedido para entrega.

### Pré-requisitos

- Conexão com a internet para carregar o Bootstrap e Firebase Analytics.
- Um arquivo `estoque.json` corretamente formatado para listar os produtos disponíveis.

## Melhorias Futuras

- Implementação de autenticação de usuário com Firebase Authentication.
- Integração com API de pagamento para finalizar compras online.
- Back-end para processamento de pedidos e gerenciamento de estoque em tempo real.
  
## Autor

Este projeto foi desenvolvido por **BernardoDev1057** para fins de estudo e aprendizado em desenvolvimento web.

---

**Acacio Bebidas - Solicite seu delivery agora e aproveite nossas promoções!**