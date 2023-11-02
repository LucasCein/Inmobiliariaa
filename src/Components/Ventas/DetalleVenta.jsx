import { doc, getDoc, getFirestore } from "firebase/firestore"
import { useEffect, useState } from "react"
import { app } from "../../FireBase/config"

const DetalleVenta = ({ detalle_id,venta }) => {
    console.log(venta)
    const [cargos, setCargos] = useState([])
    const [cliente, setCliente] = useState([])
    const [propiedad, setPropiedad] = useState([])
    console.log(propiedad)
    useEffect(() => {
        const fetch = async () => {
            const db = getFirestore(app);
            const docRef = doc(db, "detalleVenta", detalle_id);
            await getDoc(docRef).then(res => setCargos(res.data().cargosSeleccionados));
            const db1 = getFirestore(app);
            const docRef1 = doc(db1, "clientes", venta.cliente_id);
            await getDoc(docRef1).then(res => setCliente(res.data()));
            const db2 = getFirestore(app);
            const docRef2 = doc(db2, "propiedades", venta.propiedad_id);
            await getDoc(docRef2).then(res => setPropiedad(res.data()));
        }
        fetch()
        
    }, [detalle_id,venta])
    console.log(cargos)
    return (
        <section className="d-flex flex-column ms-5">
            <h1 className="mb-5 text-center">Detalle de la Venta</h1>
            <section className="d-flex gap-2 align-items-center">
                <p>Cliente:</p>
                <p>{cliente.nombre}</p>
            </section>
            <section className="d-flex gap-2 align-items-center">
                <p>Propiedad:</p>
                <p>{propiedad.nombre}</p>
            </section>
        </section>
    )
}

export default DetalleVenta