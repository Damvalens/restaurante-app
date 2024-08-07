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
  { "id": 9, "name": "☕ Café", "price": 35000, "category": "cena" }
];

app.get('/menu', (req, res) => {
  res.json(menu);
});

app.post('/orders', (req, res) => {
  const order = req.body;
  console.log('Pedido recibido:', order);

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

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

