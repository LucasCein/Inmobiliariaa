import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore"
import { useState } from "react"
import { NumericFormat } from "react-number-format"
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const AbmProds = ({ close }) => {
    const [productos, setProductos] = useState({ nombre: "", descripcion: "", precio: 0 })
    const handleChange = (event) => {
        let { name, value } = event.target
        if (value == "") {
            console.log("Completar datos")
        }
        setProductos({ ...productos, [name]: value })
    }
    const db = getFirestore();
    const navigate = useNavigate();
    const createDoc = () => {

        const dbRef = collection(db, "productos");
        addDoc(dbRef, { ...productos, visible: true })
            .then((savedDoc) => {
                const MySwal = withReactContent(Swal)

                MySwal.fire({
                    title: <strong>Se ha agregado con Exito!</strong>,
                    icon: 'success',
                    preConfirm: () => {
                        close()
                    }
                })
                updateDoc(doc(db, "propiedades", savedDoc.id), { id: savedDoc.id });
            })
            .catch((error) => {
                console.log(error);
            });

    };
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
                {/* <input type="number" name='precio' value={productos.precio} onChange={(handleChange)} /> */}
                <NumericFormat
                    value={parseFloat(productos.precio)}
                    thousandSeparator={true}
                    prefix={"$"}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    onValueChange={(values) => {
                        const { formattedValue, value } = values;
                        setProductos({ ...productos, precio: parseInt(value) }); // 1234.56
                    }}
                    style={{ textAlign: "right" }}
                />
            </div>
            <button className="btn btn-success" onClick={createDoc}>Agregar</button>
            <button className="btn btn-danger" onClick={() => close()}>Cancelar</button>
        </div>
    )
}

export default AbmProds