const express = require('express');
const app = express();

app.use(express.json());

// ─── DATOS EN MEMORIA ────────────────────────────────────────────
let productos = [
  { id: 1, nombre: "Pizza Margarita",     precio: 120, disponible: true },
  { id: 2, nombre: "Hamburguesa Clásica", precio: 90,  disponible: true },
  { id: 3, nombre: "Tacos de Pastor",     precio: 70,  disponible: true },
  { id: 4, nombre: "Orden de Alitas",     precio: 110, disponible: true },
  { id: 5, nombre: "Refresco 600ml",      precio: 25,  disponible: true }
];

let pedidos = [];
let siguienteId = 1;

// ─── ENDPOINT 1: Obtener todos los productos ─────────────────────
app.get('/productos', (req, res) => {
  res.json({
    mensaje: "Lista de productos",
    total: productos.length,
    productos
  });
});

// ─── ENDPOINT 2: Obtener un producto por ID ──────────────────────
app.get('/productos/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }
  res.json(producto);
});

// ─── ENDPOINT 3: Agregar un nuevo producto ───────────────────────
app.post('/productos', (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ mensaje: "Nombre y precio son requeridos" });
  }
  const nuevo = {
    id: productos.length + 1,
    nombre,
    precio,
    disponible: true
  };
  productos.push(nuevo);
  res.status(201).json({
    mensaje: "Producto agregado correctamente",
    producto: nuevo
  });
});

// ─── ENDPOINT 4: Crear un pedido ─────────────────────────────────
app.post('/pedido', (req, res) => {
  const { usuario, producto, cantidad } = req.body;
  if (!usuario || !producto || !cantidad) {
    return res.status(400).json({ mensaje: "Usuario, producto y cantidad son requeridos" });
  }
  const productoEncontrado = productos.find(p => p.nombre === producto);
  if (!productoEncontrado) {
    return res.status(404).json({ mensaje: "Producto no encontrado en el menú" });
  }
  const nuevoPedido = {
    id: siguienteId++,
    usuario,
    producto,
    cantidad,
    total: productoEncontrado.precio * cantidad,
    estado: "pendiente",
    fecha: new Date().toISOString()
  };
  pedidos.push(nuevoPedido);
  res.status(201).json({
    mensaje: "Pedido recibido y guardado",
    pedido: nuevoPedido
  });
});

// ─── ENDPOINT 5: Obtener todos los pedidos ───────────────────────
app.get('/pedidos', (req, res) => {
  res.json({
    mensaje: "Lista de pedidos",
    total: pedidos.length,
    pedidos
  });
});

// ─── ENDPOINT 6: Obtener pedido por ID ──────────────────────────
app.get('/pedidos/:id', (req, res) => {
  const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
  if (!pedido) {
    return res.status(404).json({ mensaje: "Pedido no encontrado" });
  }
  res.json(pedido);
});

// ─── ENDPOINT 7: Actualizar estado de un pedido ─────────────────
app.put('/pedidos/:id', (req, res) => {
  const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
  if (!pedido) {
    return res.status(404).json({ mensaje: "Pedido no encontrado" });
  }
  pedido.estado = req.body.estado || pedido.estado;
  res.json({
    mensaje: "Estado del pedido actualizado",
    pedido
  });
});

// ─── INICIO DEL SERVIDOR ─────────────────────────────────────────
app.listen(3000, () => {
  console.log('======================================');
  console.log('  Servidor corriendo en puerto 3000');
  console.log('  http://localhost:3000');
  console.log('======================================');
  console.log('Endpoints disponibles:');
  console.log('  GET    /productos');
  console.log('  GET    /productos/:id');
  console.log('  POST   /productos');
  console.log('  POST   /pedido');
  console.log('  GET    /pedidos');
  console.log('  GET    /pedidos/:id');
  console.log('  PUT    /pedidos/:id');
});
