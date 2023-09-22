
import { MDBListGroupItem } from "mdb-react-ui-kit"
import Popup from "reactjs-popup"
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { BsArchiveFill, BsEyeFill } from "react-icons/bs"
import DetalleComprobante from "../DetalleComprobante/DetalleComprobante"
import CustomSpinner from "../CustomSpinner/CustomSpinner"
import { app } from "../../FireBase/config"
import { useNavigate } from "react-router-dom";


const ComprobantesItems = ( {comprobantes} ) => {
    const navigate = useNavigate();
    console.log(comprobantes)
    const [proveedorName, setProveedorName] = useState(null)
    const [propiedadName, setPropiedadName] = useState(null)
    const [proveedorCuit, setProveedorCuit] = useState(null)
    const[comprobantesRen,setComprobantesRen] = useState (comprobantes)

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const currentComprobnates = comprobantesRen.slice(startIndex, endIndex);

    const db = getFirestore(app);
    const deleteDoc = (id) => {
        const examcollref = doc(db, 'comprobantes', id)
        updateDoc(examcollref, { visible: false }).then(() => {
            alert("Deleted")
            navigate(0)
        }).catch(error => {
            console.log(error.message)
        })
    }
    useEffect(()=> {
        
        const nombreProv = async (id) => {
            const dbFirestore = getFirestore()
            const proveedorCollection = collection(dbFirestore, 'proveedores');
            const proveedorSnapshot = await getDocs(proveedorCollection);
            const proveedorList = proveedorSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            const proveedor = proveedorList.find(prov => prov.id == id);
            return proveedor.nombre;
          }
          
          const actualizarComprobantes = async () => {
            const nuevosComprobantes = await Promise.all(
              comprobantes.map(async (comprobante) => {
                const nombre = await nombreProv(comprobante.idProv);
                return { ...comprobante, nombreProveedor: nombre };
              })
            );
          
            // Actualiza el estado de los comprobantes con los nombres de proveedores
            setComprobantesRen(nuevosComprobantes);
            console.log(nuevosComprobantes, "ACA");
          }
          
          // Llama a la función para actualizar los comprobantes
          actualizarComprobantes();
          
        const nombreProp = async (id) => {
            const dbFirestore = getFirestore()
            const propiedadCollection = collection(dbFirestore, 'propiedades');
            const propiedadSnapshot = await getDocs(propiedadCollection);
            const propiedadList = propiedadSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const propiedad = propiedadList.find(prop => prop.id === id)
            setPropiedadName(propiedad.nombre)

            
        }
        nombreProp(comprobantes[0]?.idProp)
        
    },[comprobantes])

    const handlePreviousPage = () => {
        setCurrentPage(Math.max(currentPage - 1, 1));
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(comprobantesRen.length / itemsPerPage);
        setCurrentPage(Math.min(currentPage + 1, totalPages));
    };

    return (
        <>
            {
                currentComprobnates.map(({ id, Fecha, Tipo, pTotal, nombreProveedor, idDetalle, idProp, idProv, nombrePropiedad, cuit, numSuc }) =>
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
                            <button className="btn btn-danger" onClick={() => deleteDoc(id)} ><BsArchiveFill></BsArchiveFill></button>
                            <Popup className="position-absolute" trigger={<button className='btn btn-info '><BsEyeFill></BsEyeFill></button>} modal>
                                <DetalleComprobante item={{ id, Fecha, Tipo, pTotal, nombreProveedor, idDetalle, idProp, idProv, propiedadName, proveedorCuit, numSuc }}></DetalleComprobante>
                            </Popup>
                        </div>
                    </MDBListGroupItem>
                )
            }

<div className="d-flex flex-column align-items-center m-3">
            <p>
        <button
          className="btn btn-secondary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary ms-2"
          onClick={handleNextPage}
          disabled={endIndex >= comprobantesRen.length}
        >
          Next
        </button>
        </p>
      </div>
        </>
    )
}

export default ComprobantesItems