const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzc3ZGZmMTU4OTcwYzAwMTU3MmJiOWIiLCJpYXQiOjE3MzU5MDkzNjEsImV4cCI6MTczNzExODk2MX0.y3yFjN7rnT1CXnvf0de1Wt0hCMaQCA_WAl8sTCVDaRY";

const getAuthHeader = () => ({
  "Authorization": `Bearer ${API_TOKEN}`,
  "Content-Type": "application/json"
});

const loadProducts = async () => {
  try {
    const response = await fetch(API_URL, { headers: getAuthHeader() });
    const products = await response.json();
    const productListElement = document.getElementById('product-list');

    products.forEach(product => {
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');
      productItem.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>€${product.price}</p>
        <a href="product.html?id=${product._id}">Vedi dettagli</a>
      `;
      productListElement.appendChild(productItem);
    });
  } catch (error) {
    console.error("Errore nel caricamento dei prodotti", error);
  }
};

const loadProductDetails = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) return;

  try {
    const response = await fetch(`${API_URL}${productId}`, { headers: getAuthHeader() });
    const product = await response.json();
    const productDetailsElement = document.getElementById('product-details');
    
    productDetailsElement.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p>€${product.price}</p>
    `;
  } catch (error) {
    console.error("Errore nel caricamento del prodotto", error);
  }
};

const addOrUpdateProduct = async (event, productId = null) => {
  event.preventDefault();

  const name = document.getElementById('product-name').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const price = document.getElementById('product-price').value.trim();
  const imageUrl = document.getElementById('product-image').value.trim();
  const brand = document.getElementById('product-brand').value.trim();

  if (!name || !description || !price || !imageUrl || !brand) {
    alert("Tutti i campi sono obbligatori.");
    return;
  }

  const productData = {
    name: name,
    description: description,
    price: parseFloat(price),
    imageUrl: imageUrl,
    brand: brand
  };

  try {
    let response;
    if (productId) {
      response = await fetch(`${API_URL}${productId}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(productData)
      });
    } else {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(productData)
      });
    }

    if (!response.ok) {
      const error = await response.json();
      alert(`Errore: ${error.message || 'Non è stato possibile aggiungere o modificare il prodotto'}`);
      return;
    }

    alert("Prodotto salvato con successo");
    window.location.reload();
  } catch (error) {
    console.error("Errore nell'aggiunta o modifica del prodotto", error);
    alert("Si è verificato un errore, riprova più tardi.");
  }
};

const loadProductListBackOffice = async () => {
  try {
    const response = await fetch(API_URL, { headers: getAuthHeader() });
    const products = await response.json();
    const productListElement = document.getElementById('product-list-ul');

    products.forEach(product => {
      const productItem = document.createElement('li');
      productItem.innerHTML = `
        ${product.name} - <a href="product.html?id=${product._id}">Vedi</a>
        <button onclick="editProduct('${product._id}')">Modifica</button>
        <button onclick="deleteProduct('${product._id}')">Elimina</button>
      `;
      productListElement.appendChild(productItem);
    });
  } catch (error) {
    console.error("Errore nel caricamento della lista prodotti", error);
  }
};

const deleteProduct = async (productId) => {
  try {
    await fetch(`${API_URL}${productId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });

    alert("Prodotto eliminato con successo");
    window.location.reload();
  } catch (error) {
    console.error("Errore nell'eliminazione del prodotto", error);
  }
};

const editProduct = async (productId) => {
  try {
    const response = await fetch(`${API_URL}${productId}`, { headers: getAuthHeader() });
    const product = await response.json();

    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.imageUrl;
    document.getElementById('product-brand').value = product.brand;

    const form = document.getElementById('new-product-form');
    form.querySelector('button').textContent = "Modifica Prodotto";

    form.onsubmit = (event) => addOrUpdateProduct(event, productId);
  } catch (error) {
    console.error("Errore nel caricamento del prodotto", error);
  }
};

const newProductForm = document.getElementById('new-product-form');
if (newProductForm) {
  newProductForm.addEventListener('submit', (event) => addOrUpdateProduct(event));
}

if (document.getElementById('product-list')) {
  loadProducts();
}

if (document.getElementById('product-details')) {
  loadProductDetails();
}

if (document.getElementById('product-list-ul')) {
  loadProductListBackOffice();
}
