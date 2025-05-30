// Variáveis globais
let cartItems = [];
let cartTotal = 0;

// Elementos DOM
document.addEventListener('DOMContentLoaded', function() {
    // Botões de adicionar ao carrinho
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Ícone do carrinho
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.addEventListener('click', openCart);

    // Fechar carrinho
    const closeCart = document.querySelector('.close-cart');
    closeCart.addEventListener('click', closeCartModal);

    // Botão de finalizar compra
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', checkout);
});

// Função para adicionar produto ao carrinho
function addToCart(event) {
    const button = event.target;
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    const productImage = productCard.querySelector('img').src;
    
    // Converter preço para número
    const price = parseFloat(productPrice.replace('R$ ', '').replace('.', '').replace(',', '.'));
    
    // Verificar se o produto já está no carrinho
    const existingItem = cartItems.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name: productName,
            price: price,
            image: productImage,
            quantity: 1
        });
    }
    
    // Atualizar contador do carrinho
    updateCartCount();
    
    // Mostrar notificação
    showNotification(`${productName} adicionado ao carrinho!`);
}

// Função para atualizar contador do carrinho
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Função para abrir o modal do carrinho
function openCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('active');
    
    // Atualizar itens do carrinho
    updateCartItems();
}

// Função para fechar o modal do carrinho
function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('active');
}

// Função para atualizar itens do carrinho no modal
function updateCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total span');
    
    // Limpar conteúdo atual
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        cartTotalElement.textContent = 'R$ 0,00';
        return;
    }
    
    // Adicionar cada item ao carrinho
    cartItems.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        
        const itemTotal = item.price * item.quantity;
        
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">×</button>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Adicionar event listeners para os botões de quantidade
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');
    const removeButtons = document.querySelectorAll('.remove-item');
    
    minusButtons.forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    plusButtons.forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', removeItem);
    });
    
    // Atualizar total
    updateCartTotal();
}

// Função para aumentar quantidade
function increaseQuantity(event) {
    const index = event.target.dataset.index;
    cartItems[index].quantity += 1;
    updateCartItems();
    updateCartCount();
}

// Função para diminuir quantidade
function decreaseQuantity(event) {
    const index = event.target.dataset.index;
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
    } else {
        cartItems.splice(index, 1);
    }
    updateCartItems();
    updateCartCount();
}

// Função para remover item
function removeItem(event) {
    const index = event.target.dataset.index;
    cartItems.splice(index, 1);
    updateCartItems();
    updateCartCount();
}

// Função para atualizar total do carrinho
function updateCartTotal() {
    const cartTotalElement = document.querySelector('.cart-total span');
    cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `R$ ${cartTotal.toFixed(2).replace('.', ',')}`;
}

// Função para finalizar compra
function checkout() {
    if (cartItems.length === 0) {
        showNotification('Seu carrinho está vazio!');
        return;
    }
    
    // Aqui seria a integração com o sistema de pagamento
    alert('Obrigado por sua compra! Em um site real, você seria redirecionado para o sistema de pagamento.');
    
    // Limpar carrinho após compra
    cartItems = [];
    updateCartCount();
    updateCartItems();
    closeCartModal();
}

// Função para mostrar notificação
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Adicionar estilos para notificação
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--roxo);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1001;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .cart-item {
        display: flex;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid var(--cinza);
    }
    
    .cart-item-image {
        width: 60px;
        height: 60px;
        overflow: hidden;
        border-radius: 5px;
        margin-right: 15px;
    }
    
    .cart-item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .cart-item-details {
        flex: 1;
    }
    
    .cart-item-details h4 {
        margin-bottom: 5px;
        font-size: 16px;
    }
    
    .cart-item-price {
        color: var(--roxo);
        font-weight: 600;
        margin-bottom: 5px;
    }
    
    .cart-item-quantity {
        display: flex;
        align-items: center;
    }
    
    .quantity-btn {
        width: 25px;
        height: 25px;
        background-color: var(--cinza);
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: bold;
    }
    
    .cart-item-quantity span {
        margin: 0 10px;
    }
    
    .remove-item {
        background: none;
        border: none;
        color: #999;
        font-size: 20px;
        cursor: pointer;
        padding: 0 10px;
    }
    
    .remove-item:hover {
        color: #ff0000;
    }
`;

document.head.appendChild(style);
