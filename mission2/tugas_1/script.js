let productsData = [
    {
        title: 'Sony Xperia Z1',
        price: 1960000,
        imageSrc: './images/xperiaz1.jpg'
    },
    {
        title: 'Asus A455U',
        price: 5800000,
        imageSrc: './images/asusa455u.jpg'
    },
    {
        title: 'Acer Aspire 5 2023',
        price: 6765005,
        imageSrc: './images/aceraspire5.jpg'
    },
    {
        title: 'Iphone 13 Pro',
        price: 1749900000,
        imageSrc: './images/iphone13pro.jpg'
    },
    {
        title: 'Dell Inspiron 14 3443',
        price: 3300000,
        imageSrc: './images/dellinspiron14.jpg'
    },
    {
        title: 'Sony PS3',
        price: 1145000,
        imageSrc: './images/ps3.jpg'
    },
    {
        title: 'Sony PS4',
        price: 4975000,
        imageSrc: './images/ps4.jpg'
    },
    {
        title: 'Sony PS5',
        price: 7099000,
        imageSrc: './images/ps5.jpg'
    },
    {
        title: 'Microsoft XBOX Series S',
        price: 3980000,
        imageSrc: './images/xboxS.jpg'
    },
    {
        title: 'Asus ROG Strix G513QE',
        price: 17999000,
        imageSrc: './images/rogstrix.jpg'
    },
    {
        title: 'Acer Swift X 2023',
        price: 28749000,
        imageSrc: './images/swiftx.jpg'
    },
    {
        title: 'NVIDIA GeForce RTX 4060 Ti',
        price: 7390000,
        imageSrc: './images/rtx4060ti.jpg'
    },
];

const cart = [];

// Pilih elemen-elemen DOM
const productsContainer = document.querySelector('.products');
const cartList = document.getElementById('cart-list');
const totalItems = document.getElementById('total-items');
const totalPrice = document.getElementById('total-price');
const totalPayable = document.getElementById('total-payable');
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const darkModeToggle = document.querySelector('#dark-mode-toggle');
const body = document.body;
const printReceiptButton = document.querySelector('#print-receipt');

// Fungsi untuk membuat elemen produk
function createProductElement(productData) {
    const product = document.createElement('div');
    product.classList.add('product');

    const img = document.createElement('img');
    img.src = productData.imageSrc;
    img.alt = 'Product Image';
    product.appendChild(img);

    const h3 = document.createElement('h3');
    h3.innerText = productData.title;
    product.appendChild(h3);

    const p = document.createElement('p');
    p.innerText = productData.price;
    product.appendChild(p);

    // Kontrol jumlah
    const quantityControls = document.createElement('div');
    quantityControls.classList.add('quantity-controls');

    const decreaseButton = document.createElement('button');
    decreaseButton.classList.add('quantity-decrease');
    decreaseButton.textContent = '-';
    quantityControls.appendChild(decreaseButton);

    const quantityInput = document.createElement('input');
    quantityInput.classList.add('quantity-input');
    quantityInput.type = 'number';
    quantityInput.value = '0';
    quantityInput.min = '0';
    quantityInput.readOnly = true;
    quantityControls.appendChild(quantityInput);

    const increaseButton = document.createElement('button');
    increaseButton.classList.add('quantity-increase');
    increaseButton.textContent = '+';
    quantityControls.appendChild(increaseButton);

    product.appendChild(quantityControls);

    // Tombol "Tambahkan ke Keranjang"
    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('add-to-cart');
    addToCartButton.textContent = 'Tambah Barang';
    product.appendChild(addToCartButton);

    productsContainer.appendChild(product);
}

// Loop melalui data produk dan buat elemen produk
productsData.forEach((productData) => {
    createProductElement(productData);
});

// Fungsi untuk melakukan pencarian
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    productsContainer.querySelectorAll('.product').forEach((product) => {
        const productTitle = product.querySelector('h3').innerText.toLowerCase();
        if (productTitle.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Event listener untuk tombol pencarian
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Event listener untuk toggle dark mode
darkModeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
});

// Event listener untuk tombol "Tambahkan ke Keranjang"
productsContainer.querySelectorAll('.product').forEach((product) => {
    const addToCartButton = product.querySelector('.add-to-cart');
    const quantityInput = product.querySelector('.quantity-input');
    const quantityIncreaseButton = product.querySelector('.quantity-increase');
    const quantityDecreaseButton = product.querySelector('.quantity-decrease');

    quantityIncreaseButton.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });

    quantityDecreaseButton.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 0) {
            quantityInput.value = currentValue - 1;
        }
    });

    addToCartButton.addEventListener('click', () => {
        const productTitle = product.querySelector('h3').innerText;
        const productPrice = parseFloat(product.querySelector('p').innerText);
        const productImageSrc = product.querySelector('img').src;
        const quantity = parseInt(quantityInput.value);

        const item = {
            title: productTitle,
            price: productPrice,
            imageSrc: productImageSrc,
            quantity: quantity,
        };

        const existingItemIndex = cart.findIndex((cartItem) => cartItem.title === item.title);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push(item);
        }

        renderCart();
    });
});

// Fungsi untuk merender keranjang
function renderCart() {
    cartList.innerHTML = '';
    let totalItemsCount = 0;
    let totalPriceValue = 0;

    cart.forEach((item) => {
        const product = productsData.find((product) => product.title === item.title);
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = product.imageSrc;
        img.alt = item.title;
        const spanTitle = document.createElement('span');
        spanTitle.innerText = item.title;
        const spanPrice = document.createElement('span');
        spanPrice.innerText = `Rp ${item.price.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`;
        const buttonRemove = document.createElement('button');
        buttonRemove.innerText = 'Hapus';
        buttonRemove.addEventListener('click', () => {
            const existingItemIndex = cart.findIndex((cartItem) => cartItem.title === item.title);
            if (existingItemIndex !== -1) {
                if (cart[existingItemIndex].quantity > 1) {
                    cart[existingItemIndex].quantity--;
                } else {
                    cart.splice(existingItemIndex, 1);
                }
            }
            renderCart();
        });
        const spanQuantity = document.createElement('span');
        spanQuantity.innerText = item.quantity;
        li.appendChild(img);
        li.appendChild(spanTitle);
        li.appendChild(spanPrice);
        li.appendChild(buttonRemove);
        li.appendChild(spanQuantity);
        cartList.appendChild(li);

        totalItemsCount += item.quantity;
        totalPriceValue += item.price * item.quantity;
    });

    const totalPaymentValue = totalPriceValue + 0.11 * totalPriceValue; // Hitung total pembayaran termasuk pajak 11%

    totalItems.innerText = totalItemsCount;
    totalPrice.innerText = `Rp ${totalPriceValue.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`;
    totalPayable.innerText = `Rp ${totalPaymentValue.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`;
}

// Event listener untuk tombol "Generate Receipt"
const generateReceiptButton = document.querySelector('#generate-receipt-button');

printReceiptButton.addEventListener('click', generateCustomReceipt);

// Fungsi untuk menghasilkan konten struk kustom
function generateCustomReceipt() {
    const customReceiptContent = createCustomReceiptContent();
    const customReceiptWindow = window.open('', '_blank');
    customReceiptWindow.document.write(customReceiptContent);
    customReceiptWindow.document.close();
}

// Fungsi untuk membuat konten struk kustom
function createCustomReceiptContent() {
    const currentDate = new Date().toLocaleDateString('en-US');
    const thankYouMessage = 'Terima kasih atas pembelian Anda!';

    let customReceiptContent = `
        <html>
        <head>
            <title>Custom Receipt</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    text-align: center; /* Center-align text in the body */
                }
                .custom-receipt {
                    max-width: 300px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 10px;
                }
                p {
                    margin: 5px 0;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                    margin-top: 10px;
                }
                li {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    border-bottom: 1px dashed #ccc;
                    padding-bottom: 5px;
                }
                img {
                    max-width: 60px; /* Increase image size for better visibility */
                    max-height: 60px;
                    margin-right: 10px;
                }
                .thank-you {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="custom-receipt">
                <h1>Receipt</h1>
                <p>Date: ${currentDate}</p>
                <ul>
    `;

    cart.forEach((item) => {
        customReceiptContent += `
            <li>
                <img src="${item.imageSrc}" alt="${item.title}" />
                <span>${item.title}</span>
                <span>Quantity: ${item.quantity}</span>
            </li>
        `;
    });

    customReceiptContent += `
                </ul>
                <p>Total Items: ${totalItems.innerText}</p>
                <p>Total Price: Rp ${totalPrice.innerText}</p>
                <p>Total Payment: Rp ${totalPayable.innerText}</p>
                <p class="thank-you">${thankYouMessage}</p>
            </div>
        </body>
        </html>
    `;

    return customReceiptContent;
}

// Render keranjang saat halaman dimuat
renderCart();