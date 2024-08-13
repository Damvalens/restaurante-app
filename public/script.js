document.addEventListener('DOMContentLoaded', () => {
  const menuDiv = document.getElementById('menu');
  const searchInput = document.getElementById('search');
  const filtersDiv = document.getElementById('filters');
  const cartDiv = document.getElementById('cart');
  const placeOrderButton = document.getElementById('place-order');
  const confirmationModal = document.getElementById('confirmation-modal');
  const orderSummary = document.getElementById('order-summary');
  const closeButton = document.querySelector('.close-button');
  const confirmOrderButton = document.getElementById('confirm-order');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let menu = [];

  fetch('/menu')
    .then(response => response.json())
    .then(data => {
      menu = data;
      displayMenu(menu);
    });

  function displayMenu(menu) {
    menuDiv.innerHTML = '';
    menu.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'menu-item';
      itemDiv.innerHTML = `
        <span><strong>${item.name}</strong> - ${item.price} Gs</span>
        <button data-id="${item.id}">Agregar al carrito</button>
      `;
      menuDiv.appendChild(itemDiv);
    });
  }

  searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredMenu = menu.filter(item => item.name.toLowerCase().includes(searchText));
    displayMenu(filteredMenu);
  });

  filtersDiv.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const category = e.target.getAttribute('data-category');
      const filteredMenu = category === 'all' ? menu : menu.filter(item => item.category === category);
      displayMenu(filteredMenu);
    }
  });


  menuDiv.addEventListener('click', (e) => {
>>>>>>> 5bbbc3f313568f43d3cefc17fcd1758f3c907806
  if (e.target.tagName === 'BUTTON') {
    const itemId = e.target.getAttribute('data-id');
    const item = menu.find(i => i.id == itemId);
    const cartItem = cart.find(i => i.id == itemId);

    if (cartItem) {
      cartItem.quantity++;
    } else {
      item.quantity = 1;
      cart.push(item);
    }

    // Deshabilitar el botón después de agregar al carrito
    e.target.disabled = true;
    e.target.classList.add('button-disabled');
    e.target.innerText = 'Agregado';

    updateCart();
  }
});

cartDiv.addEventListener('change', (e) => {
  if (e.target.tagName === 'INPUT') {
    const itemIndex = e.target.getAttribute('data-index');
    cart[itemIndex].quantity = parseInt(e.target.value);
    updateCart();
  }
});

cartDiv.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const itemIndex = e.target.getAttribute('data-index');
    const itemId = cart[itemIndex].id;
    cart.splice(itemIndex, 1);
    updateCart();

    // Reactivar el botón en el menú
    const menuItemButton = document.querySelector(`button[data-id="${itemId}"]`);
    if (menuItemButton) {
      menuItemButton.disabled = false;
      menuItemButton.classList.remove('button-disabled');
      menuItemButton.innerText = 'Agregar al carrito';
    }
  }
});

>>>>>>> 5bbbc3f313568f43d3cefc17fcd1758f3c907806
  function updateCart() {
    cartDiv.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <span><strong>${item.name}</strong> - ${item.price} Gs x ${item.quantity}</span>
        <input type="number" value="${item.quantity}" min="1" data-index="${index}">
        <button data-index="${index}">Eliminar</button>
      `;
      cartDiv.appendChild(itemDiv);
      total += item.price * item.quantity;
    });

    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.innerHTML = `<strong>Total: ${total} Gs</strong>`;
    cartDiv.appendChild(totalDiv);

    localStorage.setItem('cart', JSON.stringify(cart));

    cartDiv.addEventListener('change', (e) => {
      if (e.target.tagName === 'INPUT') {
        const itemIndex = e.target.getAttribute('data-index');
        cart[itemIndex].quantity = parseInt(e.target.value);
        updateCart();
      }
    });

    cartDiv.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const itemIndex = e.target.getAttribute('data-index');
        cart.splice(itemIndex, 1);
        updateCart();
      }
    });
  }

  function showModal() {
    orderSummary.innerHTML = '';
    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.innerHTML = `
        <span><strong>${item.name}</strong> - ${item.price} Gs x ${item.quantity}</span>
      `;
      orderSummary.appendChild(itemDiv);
    });
    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<strong>Total: ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0)} Gs</strong>`;
    orderSummary.appendChild(totalDiv);
    confirmationModal.style.display = 'block';
  }

  placeOrderButton.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    showModal();
  });

  closeButton.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target == confirmationModal) {
      confirmationModal.style.display = 'none';
    }
  });

  confirmOrderButton.addEventListener('click', () => {
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
      confirmationModal.style.display = 'none';
    })
    .catch(error => {
      alert('Error al realizar el pedido');
    });
  });

  updateCart();
<<<<<<< HEAD
});
=======
})
>>>>>>> 5bbbc3f313568f43d3cefc17fcd1758f3c907806
