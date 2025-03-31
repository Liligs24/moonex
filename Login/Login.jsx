import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../server/api';
import { auth, provider } from '../api/firebase.config';
import { signInWithPopup } from 'firebase/auth';
import logo from '../img/logo.png';
import googleLogo from '../img/google.png';
import appleLogo from '../img/apple.png';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Verifica si ya hay sesión activa
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/feed');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/feed');
    } catch (error) {
      console.error("Error en Google Sign-In:", error);
      setMessage('Error al iniciar sesión con Google');
    }
  };

  const handleAppleSignIn = () => {
    alert("Apple Sign-In no está implementado aún.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/feed');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Error en el login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
      <img src={logo} alt="Moonex Logo" className="login-logo" />
        <h2>Conecta bajo la misma luna</h2>
      {/* <p className="eslogan">Únete a la órbita</p>*/}

        <div className="login-buttons">
          <button className="btn-social" onClick={handleGoogleSignIn}>
            <img src={googleLogo} alt="Google" /> Iniciar con Google
          </button>
          <button className="btn-social" onClick={handleAppleSignIn}>
            <img src={appleLogo} alt="Apple" /> Iniciar con Apple
          </button>
        </div>

        <div className="separator">o</div>

        <p className="register-text">
          ¿No tienes una cuenta?
        </p>
        <button className="switch-button" onClick={handleRegisterRedirect}>Registrarse</button>
      </div>

      <div className="login-right">

        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">

{/* Correo electrónico */}
<label className="input-label">
  <i className='bx bx-envelope'></i>
  <input
    type="email"
    name="email"
    placeholder="Correo Electrónico"
    onChange={handleChange}
    required
  />
</label>

{/* Contraseña con ojito */}
<label className="input-label password-labe">
  <i className='bx bx-lock-alt'></i>
  <input
    type={showPassword ? 'text' : 'password'}
    name="password"
    placeholder="Contraseña"
    onChange={handleChange}
    required
  />
  <i
    className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} toggle-eye`}
    onClick={() => setShowPassword(!showPassword)}
  ></i>
</label>

<button type="submit">Iniciar Sesión</button>
</form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
