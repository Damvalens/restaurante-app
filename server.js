const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const menu = [
  { "id": 1, "name": "🍕 Pizza", "price": 50000, "category": "cena" },
  { "id": 2, "name": "🍔 Hamburguesa", "price": 25000, "category": "almuerzo" },
  { "id": 3, "name": "🥗 Ensalada", "price": 20000, "category": "almuerzo" },
  { "id": 4, "name": "🌮 Tacos", "price": 30000, "category": "cena" },
  { "id": 5, "name": "🥪 Sandwich", "price": 15000, "category": "desayuno" },
  { "id": 6, "name": "🥞 Panqueques", "price": 10000, "category": "desayuno" },
  { "id": 7, "name": "🍲 Sopa", "price": 15000, "category": "almuerzo" },
  { "id": 8, "name": "🍣 Sushi", "price": 35000, "category": "cena" },
  { "id": 9, "name": "☕ Café", "price": 35000, "category": "desayuno" }
];

app.get('/menu', (req, res) => {
  res.json(menu);
});

app.post('/orders', (req, res) => {
  const order = req.body;
  order.id = Date.now().toString();  // Generar un ID único para cada pedido
  order.status = 'pendiente';  // Estado inicial del pedido
  console.log('Pedido recibido:', order);

  fs.readFile('orders.json', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer el archivo de pedidos' });
    }

    let orders = [];
    if (data.length > 0) {
      orders = JSON.parse(data);
    }

    // Asegúrate de que el pedido tenga un array de items
    if (!Array.isArray(order.items)) {
      order.items = [];  // Asegúrate de que 'items' sea un array
    }

    orders.push(order);

    fs.writeFile('orders.json', JSON.stringify(orders, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al guardar el pedido' });
      }

      res.json({ message: 'Pedido recibido con éxito', order });
    });
  });
});

// Ruta para obtener pedidos (para el restaurante)
app.get('/api/admin/orders', (req, res) => {
  fs.readFile('orders.json', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo de pedidos');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para actualizar el estado de un pedido (para el restaurante)
app.post('/api/admin/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  fs.readFile('orders.json', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo de pedidos');
      return;
    }
    const orders = JSON.parse(data);
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      fs.writeFile('orders.json', JSON.stringify(orders, null, 2), err => {
        if (err) {
          res.status(500).send('Error al actualizar el archivo de pedidos');
          return;
        }
        res.send('Estado del pedido actualizado');
      });
    } else {
      res.status(404).send('Pedido no encontrado');
    }
  });
});

// Página para mostrar los pedidos
app.post('/orders', (req, res) => {
  const orderItems = req.body;  // Espera que sea un array de ítems
  const order = {
    id: Date.now().toString(),  // Generar un ID único para cada pedido
    items: orderItems,
    status: 'pendiente'  // Estado inicial del pedido
  };

  fs.readFile('orders.json', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer el archivo de pedidos' });
    }

    let orders = [];
    if (data.length > 0) {
      orders = JSON.parse(data);
    }

    orders.push(order);

    fs.writeFile('orders.json', JSON.stringify(orders, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al guardar el pedido' });
      }

      res.json({ message: 'Pedido recibido con éxito', order });
    });
  });
});

app.get('/orders', (req, res) => {
  fs.readFile('orders.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer los pedidos');
    }

    const orders = JSON.parse(data);
    console.log('Pedidos cargados:', orders);  // Imprimir los pedidos en la consola

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pedidos - Restaurante</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>Pedidos Recibidos</h1>
        <div id="orders">
          ${orders.map((order, index) => `
            <div class="order">
              <p><strong>Pedido ID: ${index + 1}</strong></p>
              <ul>
                ${order.map(item => `
                  <li>${item.name} - ${item.quantity} x ${item.price} (${item.category})</li>
                `).join('')}
              </ul>
              <p><strong>Estado:</strong> ${order.status || 'Pendiente'}</p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `);
  });
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
