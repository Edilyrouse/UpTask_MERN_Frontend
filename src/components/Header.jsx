import { Link } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import useAuth from "../hooks/useAuth";
import Busqueda from "./Busqueda";


const Header = () => {

    const { handleBuscador, cerrarSessionProyectos } = useProyectos();
    const { cerrarSessionAuth } = useAuth()

    const handleCerrarSession = () => {
        cerrarSessionAuth();
        cerrarSessionProyectos();
        localStorage.removeItem('token');
    }

  return (
    <header className="px-4 py-5 bg-white border-b">
        <div className="md:flex md:justify-between">
            <h2 className="md:mb-0 text-4xl text-sky-600 font-black text-center">
                UpTask
            </h2>

        

            <div className="flex  flex-col md:flex-row  items-center gap-4">
            <button
                type="button"
                className="font-bold uppercase"
                onClick={handleBuscador}
            >Buscar Proyecto
            </button>
                <Link
                    to="/proyectos"
                    className="font-bold uppercase"
                >Proyectos</Link>
                <button
                    type="button"
                    className="text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold"
                    onClick={handleCerrarSession}
                >Cerrar Sessión</button>

                <Busqueda />
            </div>
        </div>
    </header>
  )
}

export default Header