// el { Outlet }  permite imprimir el contenido de los componentes hijos que se agregen a la rutaen este caso al authorization layout

import { Outlet } from "react-router-dom";




const AuthLayouts = () => {
  return (
    <>  
      <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center" >
        <div className="md:w-2/3 lg:w-1/3">
          <Outlet />  
        </div>
        
      </main>
      
    </>
    
  )
}

export default AuthLayouts