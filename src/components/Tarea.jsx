import formatearFecha from "../helpers/formatearFecha";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";

const Tarea = ({ tarea }) => {
  const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea, cargando } = useProyectos();
  const admin = useAdmin();  

  const { nombre, descripcion, prioridad, fechaEntrega, _id, estado } = tarea;

  

  return (
    <div className="border-b p-5 flex justify-between items-center">
      {/* {cargando ? console.log(tarea.completado.name) : ''} */}
      <div className="flex flex-col items-start">
        <p className="mb-1 text-xl">{nombre}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
        <p className="mb-1 text-xl uppercase font-bold">
          {formatearFecha(fechaEntrega)}
        </p>
        <p className="mb-1 text-gray-600">Prioridad: {prioridad}</p>
        { estado && <p className="text-xs text-white bg-green-600 uppercase p-1 rounded-lg">Completado Por: {tarea.completado?.name}</p>}
      </div>
      <div className="flex flex-col lg:flex-row gap-2 ">
        {admin && (
          <>
            <button
              className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg "
              onClick={() => handleModalEditarTarea(tarea)}
            >
              Editar
            </button>
          </>
        )}

        <button
          className={` ${estado ? 'bg-sky-600' : 'bg-gray-600 text-xs'}  px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
          onClick={() => completarTarea(_id)}
        >{estado ? 'Completa' : 'Incompleta'}         
        </button>

        {admin && (
          <button
            className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg "
            onClick={() => handleModalEliminarTarea(tarea)}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default Tarea;
