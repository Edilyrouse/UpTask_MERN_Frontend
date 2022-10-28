import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PreviewProyecto = ({ proyecto }) => {
  const { auth } = useAuth();

  const { nombre, _id, cliente, creador } = proyecto;

  return (
    <div className="border-b p-5 flex flex-col md:flex-row  md:width-full justify-between">
      <div className=" flex items-center gap-2">
        <p className="flex-1">
          {nombre}
          <span className="text-sm  text-gray-500 ml-3 uppercase">
            {cliente}
          </span>
        </p>
        {/* //TODO: buscar la forma de poner responsive la leyenda de administrador */}
        {auth._id !== creador ? (
          <p> </p>
        ) : (
          <p className="p-1 text-xs text-white rounded-lg bg-green-400 font-bold uppercase">
            {" "}
            Adminstrador{" "}
          </p>
        )}
      </div>

      <Link
        to={`${_id}`}
        className="text-sky-600 hover:text-gray-800 uppercase text-sm font-bold"
      >
        Ver Proyecto
      </Link>
    </div>
  );
};

export default PreviewProyecto;
