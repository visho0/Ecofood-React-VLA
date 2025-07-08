import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css'; // Importa el nuevo archivo CSS

export default function LandingPage() {
  useEffect(() => {
    // Función para manejar las animaciones de aparición
    const handleScrollAnimations = () => {
      const fadeElements = document.querySelectorAll('.fade-in');
      fadeElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('appear');
        } else {
          el.classList.remove('appear'); // Opcional: quitar la clase si se sale de vista
        }
      });
    };

    window.addEventListener('scroll', handleScrollAnimations);
    handleScrollAnimations(); // Ejecutar una vez al cargar para elementos visibles inicialmente

    return () => {
      window.removeEventListener('scroll', handleScrollAnimations);
    };
  }, []);

  return (
    <>
      <header>
        <div className="container">
          <nav className="navbar">
            <Link to="/" className="logo">EcoFood</Link>
            <ul className="nav-links">
              <li><a href="#about">Acerca de</a></li>
              <li><a href="#how-it-works">Cómo funciona</a></li>
              <li><a href="#testimonials">Testimonios</a></li>
              <li><Link to="/login">Iniciar Sesión</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container fade-in delay-0">
            <h1>Tu Puente hacia la Sostenibilidad Alimentaria</h1>
            <p>Conectamos productores con excedentes alimentarios y organizaciones que los necesitan. ¡Únete a EcoFood y combate el desperdicio!</p>
            <Link to="/register" className="btn">¡Regístrate ahora!</Link>
          </div>
        </section>

        <section id="about" className="main-content container">
          <h2 className="section-title fade-in delay-0">Nuestra Misión</h2>
          <p className="fade-in delay-1">En EcoFood, nos dedicamos a construir un futuro donde ningún alimento se desperdicie. Facilitamos la conexión entre aquellos que tienen excedentes alimentarios y las comunidades que buscan nutrición y apoyo.</p>
          <div className="features">
            <div className="feature-item fade-in delay-0">
              <i className="fas fa-hand-holding-heart"></i>
              <h3>Impacto Social</h3>
              <p>Ayudamos a reducir la inseguridad alimentaria, llevando alimentos nutritivos a quienes más lo necesitan.</p>
            </div>
            <div className="feature-item fade-in delay-1">
              <i className="fas fa-leaf"></i>
              <h3>Sostenibilidad Ambiental</h3>
              <p>Disminuimos la huella de carbono generada por el desperdicio de alimentos y promovemos un ecosistema más verde.</p>
            </div>
            <div className="feature-item fade-in delay-2">
              <i className="fas fa-cogs"></i>
              <h3>Eficiencia Operacional</h3>
              <p>Optimizamos la cadena de suministro, permitiendo que los excedentes se redistribuyan de manera rápida y efectiva.</p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="main-content container">
          <h2 className="section-title fade-in delay-0">¿Cómo Funciona?</h2>
          <div className="how-it-works">
            <div className="step-item fade-in delay-0">
              <i className="fas fa-truck"></i>
              <h3>1. Productores Publican Excedentes</h3>
              <p>Productores, supermercados y restaurantes publican los alimentos excedentes disponibles en nuestra plataforma.</p>
            </div>
            <div className="step-item fade-in delay-1">
              <i className="fas fa-users"></i>
              <h3>2. Organizaciones Solicitan</h3>
              <p>Organizaciones benéficas y comedores sociales revisan las ofertas y solicitan los alimentos que necesitan.</p>
            </div>
            <div className="step-item fade-in delay-2">
              <i className="fas fa-exchange-alt"></i>
              <h3>3. Conexión y Recogida</h3>
              <p>Nuestra plataforma facilita la conexión para la recogida o entrega, asegurando que los alimentos lleguen a tiempo.</p>
            </div>
          </div>
        </section>

        <section id="testimonials" className="main-content container">
          <h2 className="section-title fade-in delay-0">Lo que dicen nuestros aliados</h2>
          <div className="testimonials">
            <div className="testimonial-item fade-in delay-0">
              <img src="/testimonial-pics/maria.jpg" alt="Foto de perfil de María López" /> {/* Ruta actualizada */}
              <h3>María López</h3>
              <p>"EcoFood ha transformado la forma en que manejamos nuestros excedentes. Ahora sabemos que nuestros alimentos llegan a personas que realmente los valoran."</p>
            </div>
            <div className="testimonial-item fade-in delay-1">
              <img src="/testimonial-pics/juan.jpg" alt="Foto de perfil de Juan Pérez" /> {/* Ruta actualizada */}
              <h3>Juan Pérez</h3>
              <p>"Una plataforma increíblemente útil. Nos ha permitido alimentar a más familias y reducir drásticamente el desperdicio en nuestra cadena de producción."</p>
            </div>
            <div className="testimonial-item fade-in delay-2">
              <img src="/testimonial-pics/sofia.jpg" alt="Foto de perfil de Sofía García" /> {/* Ruta actualizada */}
              <h3>Sofía García</h3>
              <p>"Simple, efectivo y con un impacto real. Gracias a EcoFood, nuestra labor social ha crecido exponencialmente."</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container fade-in delay-0">
            <h2>¿Listo para unirte al movimiento?</h2>
            <p>Combate el desperdicio alimentario, apoya a tu comunidad y haz una diferencia hoy.</p>
            <Link to="/register" className="btn">¡Regístrate como Productor!</Link>
            <Link to="/register" className="btn" style={{ marginLeft: '10px' }}>¡Regístrate como Organización!</Link>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section fade-in delay-0">
              <h3>Contacto</h3>
              <div className="contact-info">
                <p><i className="fas fa-map-marker-alt"></i> Calle Verde 123, Ciudad Sostenible</p>
                <p><i className="fas fa-envelope"></i> contacto@ecofood.org</p>
                <p><i className="fas fa-phone"></i> +56 9 1234 5678</p>
              </div>
            </div>
            <div className="footer-section fade-in delay-1">
              <h3>Redes sociales</h3>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook"></i> EcoFoodOficial</a><br />
                <a href="#"><i className="fab fa-instagram"></i> @ecofood_oficial</a><br />
                <a href="#"><i className="fab fa-twitter"></i> @EcoFood_org</a>
              </div>
            </div>
            <div className="footer-section fade-in delay-2">
              <h3>Inicia Sesión</h3>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
                <input type="email" placeholder="Tu correo electrónico" required />
                <button type="submit" className="btn">Enviar</button> {/* Cambiado a 'Enviar' para evitar confusión con el enlace de abajo */}
                <Link to="/login" className="btn">Iniciar Sesión</Link>
              </form>
            </div>
          </div>
          <div className="copyright fade-in delay-3">
            <p>&copy; 2023 EcoFood. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}