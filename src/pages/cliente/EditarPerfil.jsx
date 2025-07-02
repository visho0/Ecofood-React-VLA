import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { saveUserData } from '../../services/userService';
import Swal from 'sweetalert2';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

export default function EditarPerfilCliente() {
  const { user, userData, loading, setUserData } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    direccion: '',
    comuna: '',
    email: '',
    telefono: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);

  useEffect(() => {
    if (!loading && userData) {
      const currentData = {
        nombre: userData.nombre || '',
        rut: userData.rut || '',
        direccion: userData.direccion || '',
        comuna: userData.comuna || '',
        email: user?.email || userData.email || '',
        telefono: userData.telefono || '',
      };
      setFormData(currentData);
      setOriginalFormData(currentData);
    }
  }, [loading, userData, user]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <p>Cargando perfil de cliente...</p>
      </Container>
    );
  }

  if (!user || !userData || userData.tipo !== 'cliente') {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="alert alert-danger" role="alert">
          Acceso denegado. No eres un cliente autorizado.
        </div>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setOriginalFormData(formData);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (originalFormData) {
      setFormData(originalFormData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;
    try {
      await saveUserData(user.uid, formData);
      setUserData(prevUserData => ({ ...prevUserData, ...formData }));
      Swal.fire('¡Éxito!', 'Perfil actualizado correctamente', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      Swal.fire('Error', 'No se pudo actualizar el perfil. Inténtalo de nuevo.', 'error');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Mi Perfil de Cliente</h2>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre:</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>RUT:</Form.Label>
                  <Form.Control
                    type="text"
                    name="rut"
                    value={formData.rut}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico:</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    disabled
                  />
                  <Form.Text className="text-muted">
                    El correo electrónico no se puede cambiar desde esta sección.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección:</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Comuna:</Form.Label>
                  <Form.Control
                    type="text"
                    name="comuna"
                    value={formData.comuna}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono:</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="primary" type="submit">
                        Guardar Cambios
                      </Button>
                      <Button variant="outline-secondary" onClick={handleCancelClick}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary" onClick={handleEditClick}>
                      Editar Perfil
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
