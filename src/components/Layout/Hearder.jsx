"use client"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro que deseas cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
      borderRadius: "12px",
    })

    if (result.isConfirmed) {
      logout()
      navigate("/login")

      Swal.fire({
        icon: "success",
        title: "¡Hasta luego!",
        text: "Sesión cerrada exitosamente",
        timer: 2000,
        showConfirmButton: false,
        background: "#ffffff",
        borderRadius: "12px",
      })
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h2 className="logo">PixelHub S.A.S</h2>
          <span className="subtitle">Gestión de Suscripciones</span>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">Hola, {user?.nombre || "Usuario"}</span>
            <span className="user-email">{user?.correo}</span>
          </div>

          <button className="logout-button" onClick={handleLogout} title="Cerrar sesión">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header