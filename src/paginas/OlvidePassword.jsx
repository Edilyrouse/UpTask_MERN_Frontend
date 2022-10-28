import { Link } from "react-router-dom";
import { useState } from "react";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const OlvidePassword = () => {
  // area de states
  const [email, setEmail] = useState("");
  const [alerta, setAlerta] = useState({});

  // Area de funcioens

  const handleSubmit = async e => {
    e.preventDefault();

    if (email === "" || email.length < 6) {
      setAlerta({
        msg: "Email No Valido",
        error: true,
      });
      return;
    }

    setAlerta({});    

    try {
  
      const { data } = await clienteAxios.post(`/usuarios/olvide-password`, {email})
      setAlerta({
        msg: data.msg,
        error: false
      })
    } catch (error) {
      
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
    

      
  };

  // revisar si hay mensaje a mostrar en pantalla
  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Recupera Tu <span className="text-slate-700">Password</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      {/* Formulario de registro */}
      <form
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* AREA DE BOTONES*/}
        <input
          type="submit"
          value="Enviar Instrucciones"
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
      </nav>
    </>
  );
};

export default OlvidePassword;
