import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import io from "socket.io-client";

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  // este arreglo se llena de la consulta axios con los proyectos
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  const [tarea, setTarea] = useState({});
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
  const [colaborador, setColaborador] = useState({});
  const [modalEliminarColaborador, setModalEliminarColaborador] =
    useState(false);
  const [buscador, setBuscador] = useState(false);

  // Hook de navegar
  const { auth } = useAuth();
  const navigate = useNavigate();

  //const token = localStorage.getItem("token");

  //useEffect para traer proyectos
  //TODO: QUITAR EL TOKEN del effect para que se pueda
  //actualizar el proyecto o que se quede en el area de proyecto y no vuelva
  //al listado general de los proyectos

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        // jalar el token desde localStorage
        const token = localStorage.getItem("token");
        if (!token) return; // es poco probable esto pero siempre pongamoslo
        // config segundo parametro de axios o el clienteAxios
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        // peticion tipo get, no lleva el .get ni el tercer parametro
        const { data } = await clienteAxios("/proyectos", config);
        // si todo  viene bien hay que ponerlo en el state
        setProyectos(data);
      } catch (error) {
        console.log(error);
        //navigate("/proyectos")
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };

    obtenerProyectos();
  }, [auth]);

  // conexion al socket io

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }, []);

  // funcion a compartir para la alerta
  // esta funcion se manda en el provider
  const mostrarAlerta = (alerta) => {
    // setear mensaje de error
    setAlerta(alerta);
    // Limpiar alerta despues de 5 segundos
    setTimeout(() => {
      setAlerta({});
    }, 5000);
  };

  // conectar con el enpoint  para crear o actualizar un proyecto
  const submitProyecto = async (proyecto) => {
    if (proyecto.id) {
      await editarProyecto(proyecto);
    } else {
      await nuevoProyecto(proyecto);
    }
  };
  // funcion para editar un proyecto
  const editarProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // es poco probable esto pero siempre pongamoslo
      // config segundo parametro de axios o el clienteAxios
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // conectar a la API para actualizar el proyecto
      //TODO: REVISAR XQ ANTES DE REDIRECCIONAR MUESTRA CREARPROYECTO EN EL BOTON

      const { data } = await clienteAxios.put(
        `/proyectos/${proyecto.id}`,
        proyecto,
        config
      );

      ///SINCRONIZAR EL STATE
      const proyectosActualizados = proyectos.map((proyectoState) =>
        proyectoState._id === data._id ? data : proyectoState
      );
      setProyectos(proyectosActualizados);
      // avisar si todo viene bien
      setAlerta({
        msg: "Proyecto Actualizado Correctamente",
        error: false,
      });
      // navigate  para redireccionar al usuario una vez
      // ceado el proyecto
      setTimeout(() => {
        setAlerta({});
        //navigate("/proyectos");
        navigate(`/proyectos/${proyecto.id}`);
      }, 1800);

      //
    } catch (error) {
      console.log(error);
    }
  };

  // crear nuevo proyecto

  const nuevoProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // es poco probable esto pero siempre pongamoslo
      // config segundo parametro de axios o el clienteAxios
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // conectando ..
      const { data } = await clienteAxios.post("/proyectos", proyecto, config);
      console.log(data);
      setProyectos([...proyectos, data]);

      // avisar si todo viene bien
      setAlerta({
        msg: "Proyecto Creado Correctamente",
        error: false,
      });
      // navigate  para redireccionar al usuario una vez
      // ceado el proyecto
      setTimeout(() => {
        setAlerta({});
        navigate(`/proyectos/${data._id}`);
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  // funcion para traer un proyecto en singular,
  const obtenerProyecto = async (id) => {
    // setCargando true para evitar el flash del estado anterior
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios(`/proyectos/${id}`, config);
      setProyecto(data);
    } catch (error) {
      navigate(`/proyectos/${id}`);
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    } finally {
      setCargando(false);
    }
  };

  // funcion para Eliminar proyecto

  const eliminarProyecto = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);
      // SINCRONIZAR EL STATE ANTES DE redireccionar
      const proyectosActualizados = proyectos.filter(
        (proyectoState) => proyectoState._id !== id
      );
      setProyectos(proyectosActualizados);
      // mostar mensaje de exito en pantalla
      setAlerta({
        msg: data.msg,
        error: false,
      });
      // re direccionar al usuario
      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 1400);
    } catch (error) {
      console.log(error);
    }
  };

  /************    Trabajando con tareas dentro  de proyectos   *********** */

  /// funcion para state del modal
  const handleModalTarea = () => {
    // siempre sera lo contrario del estado actual, si es false cambia a true y si el estado esta ent ture pues cambia a false
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea({});
  };

  /// crear tarea

  const submitTarea = async (tarea) => {
    if (tarea?.id) {
      await editarTarea(tarea);
    } else {
      await crearTarea(tarea);
    }
  };

  const crearTarea = async (tarea) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post("/tareas", tarea, config);

      setAlerta({});
      setModalFormularioTarea(false);

      // SOKET IO
      socket.emit("nueva tarea", data);
    } catch (error) {
      console.log(error);
    }
  };

  /// ESTA ES La funcion para editar tareas, osea conectar la data con la api
  const editarTarea = async (tarea) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.put(
        `/tareas/${tarea.id}`,
        tarea,
        config
      );

      // Limpiar formulario y cerrar la modal
      setAlerta({});
      setModalFormularioTarea(false);

      // SOCKET IO  sincronizar state en tiempo real para los usuarios
      socket.emit("actualizar tarea", data);
    } catch (error) {
      console.log(error);
    }
  };

  // funcion para  llenar el formulario de editar tareas -- evitamos pasar el setEditarTarea

  const handleModalEditarTarea = (tarea) => {
    setTarea(tarea);
    setModalFormularioTarea(true);
  };

  // funciones del modal o ventana emergente de eliminar tarea
  // funcion para modificar state del modal para eliminar tareas

  const handleModalEliminarTarea = async (tarea) => {
    setTarea(tarea);
    setModalEliminarTarea(!modalEliminarTarea);
  };

  const eliminarTarea = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.delete(
        `/tareas/${tarea._id}`,
        config
      );

      // mostrar mensaje en pantalla
      setAlerta({
        msg: data.msg,
        error: false,
      });

      // cerrar la modal
      setModalEliminarTarea(false);

      // SOCKET
      socket.emit("eliminar tarea", tarea);

      setTarea({});
      setTimeout(() => {
        setAlerta({});
      }, 1800);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  // TRABAJANDO CON  COLABORADORES DE PROYECTOS
  // ESTA ES DE LA VENTANIDTA QUE TIENE EL BOTON PARA AGREGAR

  const submitColaborador = async (email) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // notar que el parametro a enviarse siempre es un OBJETO
      const { data } = await clienteAxios.post(
        "/proyectos/colaboradores",
        { email },
        config
      );
      setColaborador(data);
      setAlerta({});
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    } finally {
      //setCargando(true)
    }
  };

  // Agregar colaborador al proyecto
  // ESTA ES LA QUE YA LO AGREGA
  const agregarColaborador = async (email) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // notar que el parametro a enviarse siempre es un OBJETO AQUI YA VIENE COMO OBJETO
      // POR ESO NO LLEVA {email} si no solo email
      const { data } = await clienteAxios.post(
        `/proyectos/colaboradores/${proyecto._id}`,
        email,
        config
      );
      setAlerta({
        msg: data.msg,
        error: false,
      });
      // reseteamos el objeto para que este vacio
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
    // Limpiar la alerta y el colaborador
    setTimeout(() => {
      setAlerta({});
      setColaborador({});
      //navigate(/proyectos")
      navigate(`/proyectos/${proyecto._id}`);
    }, 2000);
  };

  // esta funcion es para el modal de eliminar colaborador
  const handleModalEliminarColaborador = (colaborador) => {
    setModalEliminarColaborador(!modalEliminarColaborador);
    setColaborador(colaborador);
  };

  // funcion directa para eliminar colaborador

  const eliminarColaborador = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // conectando con end point
      const { data } = await clienteAxios.post(
        `/proyectos/eliminar-colaborador/${proyecto._id}`,
        { id: colaborador._id },
        config
      );

      /// sincornizar el state para que YA NO IMPRIMA EL COLABORADOR EN PANTALLA
      const proyectoActualizado = { ...proyecto };

      proyectoActualizado.colaboradores =
        proyectoActualizado.colaboradores.filter(
          (colaboradorState) => colaboradorState._id !== colaborador._id
        );

      setProyecto(proyectoActualizado);

      setColaborador({});
      setModalEliminarColaborador(false);
      setAlerta({
        msg: data.msg,
        error: false,
      });

      setTimeout(() => {
        setAlerta({});
      }, 2000);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
      //Limpiar la alerta y cerrar el modal
      setTimeout(() => {
        setAlerta({});
        setModalEliminarColaborador(!modalEliminarColaborador);
      }, 2000);
    }
  };

  // funcion para completar tareas

  const completarTarea = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post(
        `/tareas/estado/${id}`,
        {},
        config
      );      
      setTarea({});
      setAlerta({});
      // SOCKET Cambiar estado
      socket.emit('cambiar estado', data);

    } catch (error) {
      console.log(error.response);
    }
  };

  // AGREGANDO EL BUSCADOR DE PROYECTOS
  const handleBuscador = () => {
    setBuscador(!buscador);
  };

  ///  CERRAR SESSION
  const cerrarSessionProyectos = () => {
    setProyecto([]);
    setProyectos({});
    setAlerta({});
  };

  // fucniones para el socket IO

  // agregar tareas con socket io o en tiempo real
  const submitTareasProyecto = (tarea) => {
    // agregar la tarea al statre o es lo mismo que sincronizar el state

    // SINCRONIZAR EL STATE despues de agregar tarea
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
    setProyecto(proyectoActualizado);
  };

  // eliminar tareas con socket io y sincornizar estados

  const eliminarTareaProyecto = (tarea) => {
    //sincronizar el STATE
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
      (tareaState) => tareaState._id !== tarea._id
    );
    // las tareas dentro de los proyectos son un arreglo
    setProyecto(proyectoActualizado);
  };

  // ACTUALIZA TAREAS EN TIEMPO REAL

  const actualizarTareaProyecto = (tarea) => {
    //sincronizar el STATE
    const proyectoActualizado = { ...proyecto };
    // las tareas dentro de los proyectos son un arreglo
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) =>
      tareaState._id === tarea._id ? tarea : tareaState
    );
    setProyecto(proyectoActualizado);
  };

  // MARCA COMO COMPLETADO las tareas en tiempo real 

  const cambiarEstadoTarea = tarea => {
    const proyectoAcutalizado = { ...proyecto };
    proyectoAcutalizado.tareas = proyectoAcutalizado.tareas.map(
      (tareaState) => (tareaState._id === tarea._id ? tarea : tareaState)
    );
    setProyecto(proyectoAcutalizado);
  }

  /// AREA DEL RETURN o mandar las funciones o stados globales
  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        cerrarSessionProyectos,
        submitTareasProyecto,
        eliminarTareaProyecto,
        actualizarTareaProyecto,
        cambiarEstadoTarea
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };

export default ProyectosContext;
