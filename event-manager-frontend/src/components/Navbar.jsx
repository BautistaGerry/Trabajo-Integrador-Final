import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/')
    }

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-brand">
                    Event<span>Hub</span>
                </Link>

                <div className="navbar-links">
                    <NavLink to="/" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
                        <span>Eventos</span>
                    </NavLink>

                    {user ? (
                        <>
                            <NavLink to="/my-events" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
                                <span>Mis Eventos</span>
                            </NavLink>
                            <NavLink to="/categories" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
                                <span>Categorías</span>
                            </NavLink>
                            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Salir</button>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', paddingLeft: '0.3rem' }}>
                                {user.nombre}
                            </span>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>Ingresar</NavLink>
                            <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
