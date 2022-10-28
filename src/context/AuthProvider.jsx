import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

// como va a rodear toda la aplicacion se coloca como clhildren

const AuthProvider = ({ children }) => {
  // hook de autentitcaion
  const [auth, setAuth] = useState({});
  const [cargando, setCargando] = useState(true); //  usar esto con spinner
  const navigate = useNavigate(); // redireccionar 


  useEffect(() => {
    const autenticarUsuario = async() => {
        const token = localStorage.getItem('token');
        // si no hay token sale de la funcion
        if(!token){
            setCargando(false);
            return
        }

        // configuracion de Headers para usar el bearer token
        // este config se envia 
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }


        // EN CASO que si exista token trata de autenticar al usuario
        // el enponint espera el BEARER TOKEN 
        try {
            const { data } = await clienteAxios('/usuarios/perfil', config)
            setAuth(data);
            navigate("/proyectos")
            
        } catch (error) {
            setAuth({})
        } finally{
            setCargando(false);
        }

        
    }

    autenticarUsuario()
  }, []);

  const cerrarSessionAuth = () => {
    setAuth({})
  }

  // Todas las funciones que van a estar disponibles
  // en el resto de componentes van dentro del RETURN
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        cargando,
        cerrarSessionAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
