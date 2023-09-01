import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { MDBBadge, MDBListGroupItem } from "mdb-react-ui-kit"
import Popup from "reactjs-popup"
import AbmPropiedades from "../AbmPropiedades/AbmPropiedades"
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore"
import { useEffect, useState } from "react"
import { BsPencil } from "react-icons/bs"
import AbmComprobantes from "../AbmComprobantes/AbmComprobantes"

const ComprobantesItems = ({ comprobantes }) => {
    const [comprobantesConProveedores, setComprobantesConProveedores] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchProveedor = async () => {
            const proveedorCollection = collection(db, 'proveedores');
            const proveedorSnapshot = await getDocs(proveedorCollection);
            const proveedorList = proveedorSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const propiedadCollection = collection(db, 'propiedades');
            const propiedadSnapshot = await getDocs(propiedadCollection);
            const propiedadList = propiedadSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            const comprobantesConProveedoresTemp = comprobantes.map(comprobante => {
                const proveedor = proveedorList.find(prov => prov.id === comprobante.idProv);
                const propiedad=propiedadList.find(prop => prop.id === comprobante.idProp)
                return {
                    ...comprobante,
                    nombreProveedor: proveedor ? proveedor.nombre : '',
                    nombrePropiedad: propiedad ? propiedad.nombre : ''
                };
            });

            setComprobantesConProveedores(comprobantesConProveedoresTemp);

        }

        fetchProveedor();
    }, [comprobantes, db]);

    console.log(comprobantes)
    console.log(comprobantesConProveedores)
    return (
        <>
            {
                comprobantesConProveedores.map(({ id, Fecha, Tipo, pTotal, nombreProveedor,idDetalle,idProp,idProv,nombrePropiedad,originalDate}) =>
                    <MDBListGroupItem key={id} className='d-flex justify-content-between' >
                        <div className='d-flex align-items-center '>
                            <div className="d-flex gap-4">
                                <div className='ms-3'>
                                    <p className='fw-bold mb-1'>Nombre Prov</p>
                                    <p className='text-muted mb-0'>{nombreProveedor}</p>
                                </div>
                                <div className="ms-3">
                                    <p className='fw-bold mb-1'>Fecha</p>
                                    <p className='text-muted mb-0'>{Fecha}</p>
                                </div>
                                <div className="ms-3">
                                    <p className='fw-bold mb-1'>Tipo</p>
                                    <p className='text-muted mb-0'>{Tipo}</p>
                                </div>
                                <div className="ms-3">
                                    <p className='fw-bold mb-1'>Precio Total</p>
                                    <p className='text-muted mb-0'>{pTotal}</p>
                                </div>
                            </div>
                        </div>

                        <div className='d-flex align-items-center gap-2 me-3'>
                            <Popup trigger={<button className='btn btn-warning '><BsPencil></BsPencil></button>} modal>
                                <AbmComprobantes comprobantes={{ id, Fecha, Tipo, pTotal, nombreProveedor,idDetalle,idProp,idProv,nombrePropiedad,originalDate }}   status={'edit'}></AbmComprobantes>
                            </Popup>
                        </div>
                    </MDBListGroupItem>
                )
            }
        </>
    )
}

export default ComprobantesItems