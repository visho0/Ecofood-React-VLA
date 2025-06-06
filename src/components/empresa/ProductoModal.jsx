import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ProductoModal({ show, handleClose, productoInicial, handleSave }) {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        vencimiento: '',
        cantidad: '',
        precio: '',
        estado: 'Disponible'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (productoInicial) {
            const formattedDate = productoInicial.vencimiento ?
                new Date(productoInicial.vencimiento).toISOString().split('T')[0] : '';
            setFormData({
                nombre: productoInicial.nombre || '',
                descripcion: productoInicial.descripcion || '',
                vencimiento: formattedDate,
                cantidad: productoInicial.cantidad || '',
                precio: productoInicial.precio || '',
                estado: productoInicial.estado || 'Disponible'
            });
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                vencimiento: '',
                cantidad: '',
                precio: '',
                estado: 'Disponible'
            });
        }
        setErrors({}); 
    }, [productoInicial, show]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
       
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio.';
        }
        if (!formData.cantidad || formData.cantidad <= 0) {
            newErrors.cantidad = 'La cantidad debe ser un número positivo.';
        }
        if (!formData.precio || formData.precio <= 0) {
            newErrors.precio = 'El precio debe ser un número positivo.';
        }
        if (!formData.vencimiento) {
            newErrors.vencimiento = 'La fecha de vencimiento es obligatoria.';
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const vencimientoDate = new Date(formData.vencimiento);
            vencimientoDate.setHours(0, 0, 0, 0);

            if (vencimientoDate < today) {
                newErrors.vencimiento = 'La fecha de vencimiento no puede ser anterior a hoy.';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            
            const productoToSave = {
                ...formData,
                precio: parseFloat(formData.precio),
                cantidad: parseInt(formData.cantidad),
                vencimiento: new Date(formData.vencimiento).toISOString() 
            };
            handleSave(productoToSave);
            handleClose();
        } else {
            Swal.fire('Error de validación', 'Por favor, corrige los errores en el formulario.', 'error');
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
                            rows={3}
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Vencimiento</Form.Label>
                        <Form.Control
                            type="date"
                            name="vencimiento"
                            value={formData.vencimiento}
                            onChange={handleChange}
                            isInvalid={!!errors.vencimiento}
                        />
                        <Form.Control.Feedback type="invalid">{errors.vencimiento}</Form.Control.Feedback>
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
                    <Button variant="primary" type="submit" className="w-100">
                        {productoInicial ? 'Actualizar Producto' : 'Añadir Producto'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}