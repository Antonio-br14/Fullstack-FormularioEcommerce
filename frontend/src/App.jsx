import { useState } from 'react'
import './style.css'

function App() {
  const [producto, setProducto] = useState({
    nombre: '',
    talla: '',
    precio: '',
    stock: ''
  });

  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

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
        setMensaje({ tipo: 'success', texto: 'Producto guardado exitosamente' });
        setProducto({ nombre: '', talla: '', precio: '', stock: '' });
      } else {
        setMensaje({ tipo: 'error', texto: 'Error al guardar el producto' });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión con el servidor' });
    }
  };

  return (
    <div className="app-container">
      <div className="form-wrapper">
        <h1 className="form-title">Registrar Nuevo Producto</h1>

        {/* Mensajes de estado */}
        {mensaje.texto && (
          <div className={`message ${mensaje.tipo === 'success' ? 'message-success' : 'message-error'}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre del Producto
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={producto.nombre}
              onChange={handleChange}
              placeholder="Ej: Camiseta Premium"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="talla" className="form-label">
              Talla
            </label>
            <input
              type="text"
              name="talla"
              id="talla"
              value={producto.talla}
              onChange={handleChange}
              placeholder="Ej: M, L, XL, 30, 42"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="precio" className="form-label">
              Precio (USD)
            </label>
            <input
              type="number"
              name="precio"
              id="precio"
              value={producto.precio}
              onChange={handleChange}
              placeholder="Ej: 29.99"
              min="0"
              step="0.01"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock" className="form-label">
              Stock Disponible
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              value={producto.stock}
              onChange={handleChange}
              placeholder="Ej: 150"
              min="0"
              step="1"
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Guardar Producto
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;