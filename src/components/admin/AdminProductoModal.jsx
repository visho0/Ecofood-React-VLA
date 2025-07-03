import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getEmpresas } from '../../services/userService';

export default function AdminProductoModal({ show, handleClose, productoInicial, handleSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
    vencimiento: '',
    estado: 'Disponible',
    tipoPrecio: 'Pago',
    ubicacion: '',
    empresaId: '',
  });
  const [errors, setErrors] = useState({});
  const [empresas, setEmpresas] = useState([]);
  const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha de hoy en formato YYYY-MM-DD

  useEffect(() => {
    const cargarEmpresas = async () => {
      const empresasData = await getEmpresas();
      setEmpresas(empresasData);
      if (!productoInicial && empresasData.length > 0) {
        setFormData(prev => ({ ...prev, empresaId: empresasData[0].id }));
      }
    };
    cargarEmpresas();
  }, []);

  useEffect(() => {
    if (show) {
      if (productoInicial) {
        const formattedDate = productoInicial.vencimiento ?
          new Date(productoInicial.vencimiento).toISOString().split('T')[0] : '';
        setFormData({
          nombre: productoInicial.nombre || '',
          descripcion: productoInicial.descripcion || '',
          precio: productoInicial.precio || 0,
          cantidad: productoInicial.cantidad || 0,
          vencimiento: formattedDate, // Usar la fecha formateada
          estado: productoInicial.estado || 'Disponible',
          tipoPrecio: productoInicial.tipoPrecio || 'Pago',
          ubicacion: productoInicial.ubicacion || '',
          empresaId: productoInicial.empresaId || (empresas.length > 0 ? empresas[0].id : ''),
        });
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
          precio: 0,
          cantidad: 0,
          vencimiento: '', // Opcional: podrías poner 'today' aquí como valor inicial para nuevos productos
          estado: 'Disponible',
          tipoPrecio: 'Pago',
          ubicacion: '',
          empresaId: empresas.length > 0 ? empresas[0].id : '',
        });
      }
      setErrors({});
    }
  }, [show, productoInicial, empresas]);

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
    if (!formData.tipoPrecio) newErrors.tipoPrecio = 'El tipo de precio es requerido.';
    if (!formData.empresaId) newErrors.empresaId = 'La empresa es requerida.';

    // NUEVA VALIDACIÓN: Fecha de vencimiento no puede ser anterior a hoy
    if (formData.vencimiento && formData.vencimiento < today) {
      newErrors.vencimiento = 'La fecha de vencimiento no puede ser anterior a hoy.';
    }

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
              min={today} // Impide seleccionar fechas pasadas en el calendario
              isInvalid={!!errors.vencimiento} // Mostrar error si la validación falla
            />
            <Form.Control.Feedback type="invalid">{errors.vencimiento}</Form.Control.Feedback>
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

          <Form.Group className="mb-3">
            <Form.Label>Ubicación</Form.Label>
            <Form.Control
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Empresa</Form.Label>
            <Form.Select
              name="empresaId"
              value={formData.empresaId}
              onChange={handleChange}
              isInvalid={!!errors.empresaId}
            >
              <option value="">Selecciona una Empresa</option>
              {empresas.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.nombre || emp.id}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.empresaId}</Form.Control.Feedback>
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