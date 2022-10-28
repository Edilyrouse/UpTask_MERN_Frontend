import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const Registrar = () => {
  // declaracion de variables y estados
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [alerta, setAlerta] = useState({});
  // DECLARACION DE HOOKS

  // area de funciones

  const handleSubmit = async e => {
    e.preventDefault();

    // VALIDAR FORMULARIO
    // si alguno de los estados esta vacio, 
    if([name, email, password, repetirPassword].includes('')){
      setAlerta({
        msg: 'Todos los campos son Obligatorios',
        error: true
      })
      return 
    }
    // comprobar password
    if(password !== repetirPassword){
      setAlerta({
        msg: " Los passwords no son iguales",
        error: true
      })
    }

    // comprobar valid password
    if(password.length < 6){
      setAlerta({
        msg: "El password es muy corto",
        error: true
      })
    }

    // Limpiar la alerta
    setAlerta({});

    // conectar a la API

    try {
      // axios con .post toma dos parametros la url y tambien los datos que vamos a enviar
      
      //console.log(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios`)

      const { data } = await clienteAxios.post(`/usuarios`, {
        name,
        email,
        password
      });
      
      setAlerta({
        msg: data.msg,
        error: false
      })
    // si  el codigo llega hasta ak  es xq ya se guardo el usuario
    // Entonces podemos resetear los states del formulario o resetear el formulario
    
    setName("");
    setEmail("");
    setPassword("");
    setRepetirPassword("");

    } catch (error) {
       setAlerta({
        msg: error.response.data.msg,
         error: true
       })
    }     

  }






  // revisar si existe la alerta

  const { msg } = alerta

  /// area de returns
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Crea tu <span className="text-slate-700">Cuenta</span>
      </h1>
      { msg && <Alerta alerta={alerta} />}
      {/* Formulario de registro */}
      <form
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        {/* Div para cada Elemento o Campo del Formulario */}
        <div className="my-5">
          <label
            htmlFor="name"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Nombre
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tu Nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Div para cada Elemento o Campo del Formulario */}
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

        {/* Div para cada Elemento o Campo del Formulario */}
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

        {/* Div para cada Elemento o Campo del Formulario */}
        <div className="my-5">
          <label
            htmlFor="password2"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Confirmar Password
          </label>
          <input
            id="password2"
            type="password"
            placeholder="Repetir Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={repetirPassword}
            onChange={e => setRepetirPassword(e.target.value)}
          />
        </div>

        {/* AREA DE BOTONES*/}
        <input
          type="submit"
          value="Crear Cuenta"
          className="bg-sky-600 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
        />
      </form>
      {/*  AREA DE ENLACES  */}
      <nav className="lg:flex lg:justify-between">
        <Link
          to="/"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          ¿Ya tienes una Cuenta? - Iniciar sesión!!
        </Link>
        <Link
          to="/olvide-password"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          ¿Olvidate tu Contraseña?
        </Link>
      </nav>
    </>
  );
};

export default Registrar;
