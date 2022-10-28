import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const ConfirmarCuenta = () => {
  // area de variables
  const params = useParams();
  const { id } = params;
  console.log(id)

  // state
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  // useEffect para ejecutarlo una sola vez
  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`;
        const { data } = await clienteAxios(url);
        // mensaje de cuenta confirmada
        setAlerta({
          msg: data.msg,
          error: false,
        });
        // redireccionar despues de confirmar
        setCuentaConfirmada(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };

    // mandamos a llamar la cuenta que acabmos de crear
    confirmarCuenta();
  }, []);

  // extraer mensaje de alerta
  const { msg } = alerta;

  // Area del return
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Confirma Tu <span className="text-slate-700">Cuenta</span>
      </h1>
      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 bg-white">
        {msg && <Alerta alerta={alerta} />}</div>
      {cuentaConfirmada && (
        <Link
          to="/"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >Iniciar Session</Link>
      )}
    </>
  );
};

export default ConfirmarCuenta;
