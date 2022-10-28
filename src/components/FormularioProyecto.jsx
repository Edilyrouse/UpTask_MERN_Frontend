import { useState, useEffect } from "react";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";
import { useParams } from "react-router-dom";

//TODO: REVISAR XQ ANTES DE REDIRECCIONAR MUESTRA CREARPROYECTO EN EL BOTON


const FormularioProyecto = () => {
  // el state es local por eos no esta en el context
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [cliente, setCliente] = useState("");
  const [id, setId] = useState(null); // este ID tambien sirve para dientificar si es proyecto nuevo o si se esta editando

  /// el params es para detectar si estamos creando o editando un proyecto
  /// si viene algo en la url es editar si viene vacio es crear uno nuevo
  const params = useParams();

  // extrayendo propiedades del provider
  const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();

  useEffect(() => {
    // se consulta si ya viene proyecto del useproyectos y del provider
    // con el fin de detectar si estamos editando que llene el formulario
    // si se esta creando el formulario se muestra vacio
    if (params.id) {
      setNombre(proyecto.nombre);
      setDescripcion(proyecto.descripcion);
      setFechaEntrega(proyecto.fechaEntrega?.split("T")[0]);
      setCliente(proyecto.cliente);
      setId(proyecto._id);
    }
  }, [params]);

  // area de funciones
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validar formularo
    if ([nombre, descripcion, fechaEntrega, cliente].includes("")) {
      mostrarAlerta({
        msg: "Todos los Campos son Obligatorios",
        error: true,
      });
      return;
    }
    // pasar los datos hacia el provider
    // para mandar a guardar el proyecto
    // se van al provider para que pueda conectar con el endpoint
    await submitProyecto({
      id,
      nombre,
      descripcion,
      fechaEntrega,
      cliente,
    });

    // resetear el formulario
    setId(null);
    setNombre("");
    setDescripcion("");
    setFechaEntrega("");
    setCliente("");
  };

  // extraer mensaje de error
  const { msg } = alerta;

  // Area del Return
  return (
    <form
      className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      {msg && <Alerta alerta={alerta} />}

      {/* Div para nombre en el formulario */}

      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="name"
        >
          Nombre Proyecto
        </label>
        <input
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Nombre del Proyecto"
          type="text"
          id="name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      {/* fin elemento dentro del formulario  */}
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="descripcion"
        >
          Descripcion del Proyecto
        </label>
        <textarea
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Descripcion"
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      {/* elemento fecha de entrega dentro del formulario  */}
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="fecha-entrega"
        >
          Fecha de Entrega
        </label>
        <input
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Fecha de Entrega"
          type="date"
          id="fecha-entrega"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
        />
      </div>
      {/* fin elemento dentro del formulario  */}
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="cliente"
        >
          Nombre del Cliente
        </label>
        <input
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Cliente - Empresa"
          type="text"
          id="cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
      </div>
      {/* Buton para submit  */}
      <input
        className="bg-sky-500 w-full p-3 uppercase font-bold text-white rounded-lg cursor-pointer hover:bg-sky-700 transition-colors"
        type="submit"
        value={id ? "Actualizar Proyecto" : "Crear Proyecto"}
      />
    </form>
  );
};

export default FormularioProyecto;
