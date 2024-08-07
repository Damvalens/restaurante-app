
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/menu', (req, res) => {
  const menu = [
    { id: 1, name: 'Hamburguesa', price: 5000 },
    { id: 2, name: 'Pizza', price: 7000 },
    { id: 3, name: 'Ensalada', price: 4000 }
  ];
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
