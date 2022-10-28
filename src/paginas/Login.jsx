import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";
import useAuth from "../hooks/useAuth";

const Login = () => {

  // area de States

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({});

  // area de funciones
  const navigate = useNavigate();

  // funcion para usar el context

  const {setAuth } = useAuth()

  // funcion para manejar el formulario

  const handleSubmit = async e => {
    
    e.preventDefault();

    if([email, password].includes('')){
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true
      })
      return 
    }

    // si todo esta bien consultamos la API para validar
    try {
      const {data} = await clienteAxios.post('/usuarios/login',{
        email,
        password
      });
      // Resetear la alerta
      setAlerta({});

      // si ya  pasa 
      localStorage.setItem('token', data.token)
      // pasamos data  al context
      setAuth(data)
      navigate("/proyectos")
    } catch (error) {
      console.log(error.response.data.msg)
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }


  // extraer alerta por si existe

  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Inicia Sessión para Administrar tus{" "}
        <span className="text-slate-700">proyectos</span>
      </h1>
      { msg && <Alerta alerta={alerta} /> }
      <form 
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Usuario - Email "
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            htmlFor="password"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Iniciar Sessión"
          className="bg-sky-600 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          to="registrar"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          ¿No tienes Una Cuenta? - Registrate!!
        </Link>
        <Link
          to="olvide-password"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          ¿Olvidate tu Contraseña?
        </Link>
      </nav>
    </>
  );
};

export default Login;
