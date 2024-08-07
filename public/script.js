
document.addEventListener('DOMContentLoaded', () => {
  const menuDiv = document.getElementById('menu');
  const cartDiv = document.getElementById('cart');
  const placeOrderButton = document.getElementById('place-order');
  let cart = [];

  fetch('/menu')
    .then(response => response.json())
    .then(menu => {
      menu.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
          <span><strong>${item.name}</strong> - ${item.price} Gs</span>
          <button data-id="${item.id}">Agregar al carrito</button>
        `;
        menuDiv.appendChild(itemDiv);
      });

      menuDiv.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          const itemId = e.target.getAttribute('data-id');
          const item = menu.find(i => i.id == itemId);
          cart.push(item);
          updateCart();
        }
      });
    });

  function updateCart() {
    cartDiv.innerHTML = '';
    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <span><strong>${item.name}</strong> - ${item.price} Gs</span>
      `;
      cartDiv.appendChild(itemDiv);
    });
  }

  placeOrderButton.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const confirmation = confirm('¿Estás seguro de que deseas realizar el pedido?');
    if (confirmation) {
      fetch('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
      })
      .then(response => response.json())
      .then(data => {
        alert('Pedido realizado con éxito');
        cart = [];
        updateCart();
      })
      .catch(error => {
        alert('Error al realizar el pedido');
      });
    }
  });
});
