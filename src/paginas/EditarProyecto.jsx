import useProyectos from "../hooks/useProyectos";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import FormularioProyecto from "../components/FormularioProyecto";

const EditarProyecto = () => {
  // traer info del provider
  const { proyecto, cargando, obtenerProyecto, eliminarProyecto } = useProyectos();
  const params = useParams();
  const { nombre } = proyecto;

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);


  const handleClick = () => {
    //TODO: Agregar modal window
    if(confirm('¿Desea Eliminar este Proyecto?')){
      eliminarProyecto(params.id)
    }
  }

  //TODO poner spinner
  if (cargando) return "Cargando.... ";

  return (
    <>
      {/* <h3 className="font-black text-2xl text-gray-500 hover:text-gray-700 transition-colors text-center">
        Editando Proyecto: 
      </h3> */}
      <div className=" flex justify-between">
        <h3 className="text-gray-600 text-3xl">Editar Proyecto: 
        <span className="font-black ml-3 hover:text-black">{nombre}</span></h3>
        {/* icono de lapiz para editar desde heroicon.com */}
        <div className="flex items-center gap-2 text-gray-400 hover:text-red-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>

          <button 
            className="uppercase font-bold"
            onClick={handleClick}
          >Eliminar</button>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <FormularioProyecto />
      </div>
    </>
  );
};

export default EditarProyecto;
