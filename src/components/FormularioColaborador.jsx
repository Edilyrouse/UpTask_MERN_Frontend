import { useState } from "react";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";


const FormularioColaborador = () => {
    // STATES
  const [email, setEmail] = useState("");

  const {alerta, mostrarAlerta, submitColaborador } = useProyectos();

  // funciones 
  const handleSubmit =  async (e) => {
    e.preventDefault();
        if(email === '' || email.length < 5){
            mostrarAlerta({
                msg: "El email es OBLIGATORIO",
                error: true
            })
            return 
        }    
        
        await submitColaborador(email)

  };

  // extraer mensaje de error 

  const { msg } = alerta

  return (
    <form
      className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
      onSubmit={handleSubmit}
    >
        {msg && <Alerta alerta={alerta} />}
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
      {/* fin Input type email */}
      {/* buton para submit */}
      <input
        type="submit"
        className="bg-sky-400 hover:bg-sky-600 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded"
        value="Agregar Colaborador"
      />

      {/* fin elemento del formulario */}
    </form>
  );
};

export default FormularioColaborador;
