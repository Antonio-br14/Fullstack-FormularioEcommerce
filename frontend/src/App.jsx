import { useState, useEffect } from 'react';
import './style.css';

function App() {
  const [producto, setProducto] = useState({
    nombre: '',
    talla: '',
    precio: '',
    stock: ''
  });

  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [productos, setProductos] = useState([]);

  // Cargar productos al iniciar
  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/productos');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al cargar productos' });
    }
  };

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
      });

      if (res.ok) {
        const nuevoProducto = await res.json();
        setMensaje({ tipo: 'success', texto: 'Producto guardado exitosamente' });
        setProducto({ nombre: '', talla: '', precio: '', stock: '' });
        setProductos([...productos, nuevoProducto]);
      } else {
        setMensaje({ tipo: 'error', texto: 'Error al guardar el producto' });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión con el servidor' });
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/productos/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setProductos(productos.filter(p => p.id !== id));
        setMensaje({ tipo: 'success', texto: 'Producto eliminado exitosamente' });
      } else {
        setMensaje({ tipo: 'error', texto: 'Error al eliminar el producto' });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión al eliminar' });
    }
  };

  return (
    <div className="app-container">
      <div className="form-wrapper">
        <h1 className="form-title">Registrar Nuevo Producto</h1>

        {mensaje.texto && (
          <div className={`message ${mensaje.tipo === 'success' ? 'message-success' : 'message-error'}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre del Producto</label>
            <input type="text" name="nombre" id="nombre" value={producto.nombre} onChange={handleChange} placeholder="Ej: Camiseta Premium" className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="talla" className="form-label">Talla</label>
            <input type="text" name="talla" id="talla" value={producto.talla} onChange={handleChange} placeholder="Ej: M, L, XL, 30, 42" className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="precio" className="form-label">Precio (USD)</label>
            <input type="number" name="precio" id="precio" value={producto.precio} onChange={handleChange} placeholder="Ej: 29.99" min="0" step="0.01" className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="stock" className="form-label">Stock Disponible</label>
            <input type="number" name="stock" id="stock" value={producto.stock} onChange={handleChange} placeholder="Ej: 150" min="0" step="1" className="form-input" required />
          </div>

          <button type="submit" className="submit-button">Guardar Producto</button>
        </form>
      </div>

      {productos.length > 0 && (
        <div className="form-wrapper" style={{ marginTop: '2rem' }}>
          <h2 className="form-title" style={{ fontSize: '1.5rem' }}>Lista de Productos</h2>
          <ul className="product-list">
            {productos.map(prod => (
              <li key={prod.id} className="product-item">
                <span className="product-info">
                  <strong>{prod.nombre}</strong> - Talla: {prod.talla} - ${prod.precio} - Stock: {prod.stock}
                </span>
                <button onClick={() => eliminarProducto(prod.id)} className="delete-button">
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
