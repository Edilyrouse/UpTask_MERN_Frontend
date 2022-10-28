import { Link, useParams } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";
import { useEffect } from "react";
import Tarea from "../components/Tarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import Colaborador from "../components/Colaborador";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import io from "socket.io-client";

let socket;

const Proyecto = () => {
  /// area de variables
  // traer id de la URL
  const params = useParams();

  // extraer comparacion de usuario autenticado y si es el usuario creador
  const admin = useAdmin();

  // traer funcion del provider
  const {
    obtenerProyecto,
    proyecto,
    cargando,
    handleModalTarea,
    submitTareasProyecto,
    eliminarTareaProyecto,
    actualizarTareaProyecto,
    cambiarEstadoTarea
  } = useProyectos();

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  // este useEffect es para incluir a los usuarios al room del proyecto
  // este se ejecuta una sola vez por eso lleva array de dependencias
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit("abrir proyecto", params.id);
  }, []);

  // este use effecte es para servir las respuestas sobre el room de pryectos
  // y se ejecuta a cada rato por eso no lleva ARRRAY DE DEPENDENCIAS

  useEffect(() => {
    //  'crear nueva tarea' actualiza state en tiempo real, cuando agregan tarea
    socket.on("tarea agregada", (tareaNueva) => {
      if (tareaNueva.proyecto === proyecto._id) {
        submitTareasProyecto(tareaNueva);
      }
    });

    // 'eliminar '   actualiza el state cuando se elimina una tarea
    socket.on("tarea eliminada", (tareaEliminada) => {
      if (tareaEliminada.proyecto === proyecto._id) {
        eliminarTareaProyecto(tareaEliminada);
      }
    });

    // 'actualizar tarea' actualiza el state
    socket.on("tarea actualizada", tareaActualizada => {
        if(tareaActualizada.proyecto._id === proyecto._id){
          actualizarTareaProyecto(tareaActualizada);
        }
    });

    // "marca como completada una tarea"
    socket.on("nuevo estado", nuevoEstadoTarea =>{
      if(nuevoEstadoTarea.proyecto._id === proyecto._id ){
        cambiarEstadoTarea(nuevoEstadoTarea)
      }
    })


  }); // fin del useEffect que maneja socketIO-EVENTS

  // TRAE EL PROYECTO CON SUS POPULATE para poder desplegar la info
  // ESTE NOMBRE DE PROYECTO VIENE DEL USEEFFECT
  const { nombre } = proyecto;
  //console.log(proyecto.colaboradores); revisar si vienen los colaboradores

  // TODO: agregar un spinner
  if (cargando) return "Cargando ....";

  return (
    <>
      {/* // todo esto ak es el encabezado y el icono para editar */}
      <div className=" flex justify-between">
        <h1 className="font-black text-4xl">{nombre}</h1>

        {admin && (
          // div contenedor de editaR
          <div className="">
            {/* icono de lapiz para editar desde heroicon.com */}
            <div className="flex items-center gap-2 text-gray-400 hover:text-black">
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
              <Link
                className="uppercase font-bold"
                to={`/proyectos/editar/${params.id}`}
              >
                Editar
              </Link>
            </div>
          </div>
        )}
      </div>
      {/* boton agregar tareas */}
      {admin && (
        <>
          <button
            className="mt-8 text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase  font-bold bg-sky-400 text-white  flex gap-2"
            onClick={handleModalTarea}
          >
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
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Nueva Tarea
          </button>
        </>
      )}

      <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>
      {/* 
          YA NO SE USA ESTA ALERTA 
          <div className="flex justify-center">
            <div className="w-full   lg:w-1/4">
              {msg && <Alerta alerta={alerta} />}
            </div>
          </div> */}

      <div className="bg-white shadow mt-10 rounded-lg">
        {proyecto.tareas?.length ? (
          proyecto.tareas?.map((tarea) => (
            <Tarea key={tarea._id} tarea={tarea} />
          ))
        ) : (
          <h2 className="text-center text-sky-600  font-bold my-5 p-10 uppercase">
            No Hay Tareas en este Proyecto.
          </h2>
        )}
      </div>
      {admin && (
        <>
          {/* Area de coloboradores */}
          <div className="flex items-center justify-between mt-10">
            <p className="font-bold text-xl">Colaboradores</p>
            <Link
              to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
              className="text-gray-400 hover:text-black uppercase font-bold "
            >
              Add
            </Link>
          </div>
          {/* iterar sobre los colaboradores  PARA MOSTRARLOS EN PANTALLA */}

          <div className="bg-white shadow mt-10 rounded-lg uppercase">
            {proyecto.colaboradores?.length ? (
              proyecto.colaboradores?.map((colaborador) => (
                <Colaborador key={colaborador._id} colaborador={colaborador} />
              ))
            ) : (
              <h2 className="text-center text-sky-600  font-bold my-5 p-10 uppercase">
                No hay colaboradores en este proyecto
              </h2>
            )}
          </div>
          {/* Area de coloboradores */}
        </>
      )}

      <ModalFormularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
  );
};

export default Proyecto;
