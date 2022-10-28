import { useEffect } from "react";
import FormularioColaborador from "../components/FormularioColaborador";
import useProyectos from "../hooks/useProyectos";
import { useParams } from "react-router-dom";
import Alerta from "../components/Alerta";

const NuevoColaborador = () => {
  const { obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador, alerta } = useProyectos();

  const params = useParams();

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  //TODO: agregar spinner
  // este if deberia de poder bloquear el resto del fumulario
  // en caso el proyecto no exista, pero el useEffect me reorna hasta proyectos
    if(!proyecto){
        return  <Alerta alerta={alerta} />
    }
  return (
    <>
      <h1 className="text-4xl text-gray-500 hover:text-gray-800">
        Añadiendo Colaborador al Proyecto:{" "}
        <span className="text-sky-700 font-bold">{proyecto.nombre}</span>
      </h1>
      <div className="mt-10 flex justify-center">
        <FormularioColaborador />
      </div>

      { cargando ?  <p className="text-center">Cargando...</p>
        : colaborador._id && (
        <div className="flex justify-center mt-10">
          <div className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">
            <h2 className="text-center mg-10 text-2xl font-bold">
              Resultado:{" "}
            </h2>
            <div className="flex justify-between items-center">
              <p className="uppercase font-bold text-lg text-gray-500">{colaborador.name}</p>
              <button
                type="button"
                className="bg-sky-500 py-3 px-5 mt-2 rounded-lg uppercase text-white font-bold text-xs"
                onClick={() => agregarColaborador({
                    email: colaborador.email                    
                })}
              >Agregar al Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NuevoColaborador;
