import { useState } from "react"

const AbmProds = () => {
    const [productos, setProductos] = useState({ nombre: "", descripcion: "", precio: 0 })
    const handleChange = (event) => {
        let { name, value } = event.target
        if (value == "") {
            console.log("Completar datos")
        }
        setProductos({ ...productos, [name]: value })
    }
    return (
        <div>
            <h2>Agregar Producto</h2>
            {/* Renderiza la primera mitad de los elementos aquí */}
            <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
                <p className='my-0'>Nombre</p>
                <input type="text" name='nombre' value={productos.nombre} onChange={(handleChange)} />
            </div>
            <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
                <p className='my-0'>Descripcion</p>
                <input type="text" name='descripcion' value={productos.descripcion} onChange={(handleChange)} />
            </div>
            <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
                <p className='my-0'>Precio</p>
                <input type="number" name='precio' value={productos.precio} onChange={(handleChange)} />
            </div>
            <button className="btn btn-success">Agregar</button>
        </div>
    )
}

export default AbmProds