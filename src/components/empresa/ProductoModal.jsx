import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ProductoModal({ show, handleClose, productoInicial, handleSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
    vencimiento: '',
    estado: 'Disponible', // Valor por defecto
    tipoPrecio: 'Pago', // Nuevo campo: 'Gratuito' o 'Pago'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      if (productoInicial) {
        // Si hay un producto inicial, cargarlo para edición
        setFormData({
          nombre: productoInicial.nombre || '',
          descripcion: productoInicial.descripcion || '',
          precio: productoInicial.precio || 0,
          cantidad: productoInicial.cantidad || 0,
          vencimiento: productoInicial.vencimiento || '',
          estado: productoInicial.estado || 'Disponible',
          tipoPrecio: productoInicial.tipoPrecio || 'Pago', // Cargar el nuevo campo
        });
      } else {
        // Si no hay producto inicial, resetear para nuevo producto
        setFormData({
          nombre: '',
          descripcion: '',
          precio: 0,
          cantidad: 0,
          vencimiento: '',
          estado: 'Disponible',
          tipoPrecio: 'Pago',
        });
      }
      setErrors({}); // Limpiar errores al abrir el modal
    }
  }, [show, productoInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido.';
    if (!formData.descripcion) newErrors.descripcion = 'La descripción es requerida.';
    if (formData.precio < 0) newErrors.precio = 'El precio no puede ser negativo.';
    if (formData.cantidad < 0) newErrors.cantidad = 'La cantidad no puede ser negativa.';
    if (!formData.estado) newErrors.estado = 'El estado es requerido.';
    if (!formData.tipoPrecio) newErrors.tipoPrecio = 'El tipo de precio es requerido.'; // Validación para el nuevo campo

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSave(formData);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{productoInicial ? 'Editar Producto' : 'Añadir Nuevo Producto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              isInvalid={!!errors.nombre}
            />
            <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              isInvalid={!!errors.descripcion}
            />
            <Form.Control.Feedback type="invalid">{errors.descripcion}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              isInvalid={!!errors.precio}
            />
            <Form.Control.Feedback type="invalid">{errors.precio}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              isInvalid={!!errors.cantidad}
            />
            <Form.Control.Feedback type="invalid">{errors.cantidad}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de Vencimiento</Form.Label>
            <Form.Control
              type="date"
              name="vencimiento"
              value={formData.vencimiento}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              isInvalid={!!errors.estado}
            >
              <option value="Disponible">Disponible</option>
              <option value="Reservado">Reservado</option>
              <option value="Vendido">Vendido</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.estado}</Form.Control.Feedback>
          </Form.Group>

          {/* Nuevo campo para el tipo de precio */}
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Precio</Form.Label>
            <Form.Select
              name="tipoPrecio"
              value={formData.tipoPrecio}
              onChange={handleChange}
              isInvalid={!!errors.tipoPrecio}
            >
              <option value="Pago">Pago</option>
              <option value="Gratuito">Gratuito</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.tipoPrecio}</Form.Control.Feedback>
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar Producto
        </Button>
      </Modal.Footer>
    </Modal>
  );
}