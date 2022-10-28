import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; 
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const NuevoPassword = () => {
  // Area de States
  const [alerta, setAlerta] = useState({});
  const [tokenValido, setTokenValido] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordModificado, setPasswordModificado] = useState(false);
  // area de variables
  const params = useParams();
  const { token } = params;

  // area de Hooks
  useEffect(() => {
    const comprobarToken = async () => {
      try {      
        const {data} = await clienteAxios(
          `/usuarios/olvide-password/${token}`
        );
      
        setTokenValido(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
      return
    };

    comprobarToken();
  }, []);

  // area de funciones

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (password.length < 6) {
      setAlerta({
        msg: "El password debe tener minimo 6 caracteres",
        error: true,
      });
      return 
    } 

      // si todo viene bien conectamos al endpoint para cambiar el password
      try {
        const url = `/usuarios/olvide-password/${token}`;
        const {data} = await clienteAxios.post(url, {
          password,
        });
        console.log(data)
        setAlerta({
          msg: data.msg,
          error: false,
        });
        setPasswordModificado(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }     
  };

  // recoger mensaje de notificacion -error o completado con exito
  const { msg } = alerta;
  // area de return
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Crea un Nuevo <span className="text-slate-700">Password</span>
      </h1>
      {/* mostrar alerta en caso de error */}

      {msg && <Alerta alerta={alerta} />}
      {/* SI TOKEN ES VALIDO SE MUESTRA formulario */}

      {tokenValido && (
        <form
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={handleSubmit}
        >
          {/* Area de inputs */}
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
              placeholder="Ingresa tu Nuevo Password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {/* AREA DE BOTONES */}
          <input
            type="submit"
            value="Cambiar Password"
            className="bg-sky-600 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
          />
        </form>
      )}

      {passwordModificado && (        
        <Link 
          className="block text-center my-5 text-slate-500 uppercase"
          to="/"
        >Inicia Session
        </Link>
      )}
    </>
  );
};

export default NuevoPassword;
