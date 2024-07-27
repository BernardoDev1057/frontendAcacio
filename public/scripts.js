
const firebaseConfig = {
    apiKey: "AIzaSyC-4D-5eh0LnVPyt58faoNM-tKmVSaVJD8",
    authDomain: "acaciobebidas-d6bd6.firebaseapp.com",
    databaseURL: "https://acaciobebidas-d6bd6-default-rtdb.firebaseio.com",
    projectId: "acaciobebidas-d6bd6",
    storageBucket: "acaciobebidas-d6bd6.appspot.com",
    messagingSenderId: "510637509123",
    appId: "1:510637509123:web:67609ea8d14b77c22a5c36",
    measurementId: "G-4HD7QHMEBQ"
  };

  
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch and display data
async function fetchData() {
    const productsDiv = document.getElementById('products');
    try {
        const querySnapshot = await db.collection('produtos').get();
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const product = {
                descricao: data["Descrição"],
                preco_venda: data["Preco Venda"],
                data_ini_prom: data["Data Ini Prom"],
                data_lim_prom: data["Data Lim Prom"],
                id_produto: data["IdProduto"],
                total_estoques: data["Total Estoques"]
            };

            // Create HTML elements to display the product data
            const productDiv = document.createElement('div');
            productDiv.innerHTML = `
                <p>Descrição: ${product.descricao}</p>
                <p>Preço Venda: ${product.preco_venda}</p>
                <p>Data Início Promoção: ${product.data_ini_prom}</p>
                <p>Data Limite Promoção: ${product.data_lim_prom}</p>
                <p>ID Produto: ${product.id_produto}</p>
                <p>Total Estoques: ${product.total_estoques}</p>
            `;
            productsDiv.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

fetchData();