// En tu archivo existente de backend
app.use(express.json());

// Ruta para obtener pedidos (para el restaurante)
app.get('/api/admin/orders', (req, res) => {
  fs.readFile('orders.json', (err, data) => {
    if (err) {
      res.status(500).send('Error reading orders file');
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
      res.status(500).send('Error reading orders file');
      return;
    }
    const orders = JSON.parse(data);
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      fs.writeFile('orders.json', JSON.stringify(orders), err => {
        if (err) {
          res.status(500).send('Error updating orders file');
          return;
        }
        res.send('Order status updated');
      });
    } else {
      res.status(404).send('Order not found');
    }
  });
});
