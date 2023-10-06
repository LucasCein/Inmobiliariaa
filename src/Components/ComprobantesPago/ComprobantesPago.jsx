import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import ComprobantesItems from '../ComprobantesItems/ComprobantesItems';
import Popup from 'reactjs-popup';
import { MDBListGroup } from 'mdb-react-ui-kit';
import AbmComprobantes from '../AbmComprobantes/AbmComprobantes';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import './comprobantes.css'
import Select, { components } from 'react-select'
import { Link } from 'react-router-dom';
import { CloseButton } from 'react-bootstrap';
const ComprobantesPago = () => {
    const [comprobantes, setComprobantes] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [comprobantesOr, setComprobantesOr] = useState([])

    useEffect(() => {

        const dbFirestore = getFirestore()
        const queryCollection = collection(dbFirestore, 'comprobantes')
        const queryCollectionFiltered = query(queryCollection, where('visible', '==', true))
        getDocs(queryCollectionFiltered)
            .then(res => setComprobantes(res.docs.map(comprobante => ({
                id: comprobante.id,
                ...comprobante.data(),
                Fecha: comprobante.data().Fecha.toDate().toLocaleDateString(),
                nombreProveedor: '',
                originalDate: comprobante.data().Fecha
            }))))
            .catch(error => console.log(error))
            .finally(setIsLoading(false))

        const nombreProv = async (id) => {
            const dbFirestore = getFirestore();
            const proveedorCollection = collection(dbFirestore, 'proveedores');
            const proveedorSnapshot = await getDocs(proveedorCollection);
            const proveedorList = proveedorSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const proveedor = proveedorList.find(prov => prov.id == id);
            return {
                nombre: proveedor?.nombre,
                cuit: proveedor?.CUIT
            };
        }

        const actualizarComprobantes = async () => {
            const nuevosComprobantes = await Promise.all(
                comprobantes.map(async (comprobante) => {
                    const proveedorInfo = await nombreProv(comprobante.idProv);
                    const propiedadInfo = await nombreProp(comprobante.idProp)
                    return {
                        ...comprobante,
                        nombreProveedor: proveedorInfo.nombre,
                        cuitProveedor: proveedorInfo.cuit,
                        nombrePropiedad: propiedadInfo.nombre
                    };
                })
            );

            // Actualiza el estado de los comprobantes con los nombres de proveedores
            setComprobantes(nuevosComprobantes);
            setComprobantesOr(nuevosComprobantes)
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
            return propiedad


        }
        nombreProp(comprobantes[0]?.idProp)
        setComprobantesOr(comprobantes)
    }, [])

    const handleChange = (event => {
        let { name, value } = event.target
        console.log(name, value)
        if (value == "") {
            setComprobantes(comprobantesOr)
        }
        else {
            if (name == "nombreProveedor") {
                setComprobantes(comprobantesOr.filter(fac => (fac.nombreProveedor.toLowerCase().includes(value.toLowerCase()))))
            } else if (name == "fechaDesde") {
                setComprobantes(comprobantesOr.filter((comp) => {
                    const partsfechaComp = comp.Fecha.split("/")
                    const reverse = partsfechaComp[2] + "-" + partsfechaComp[1] + "-" + (partsfechaComp[0].length == 1 ? '0' + partsfechaComp[0] : partsfechaComp[0])
                    console.log(reverse)
                    if (reverse >= value) {
                        return comp
                    }
                }))

            } else if (name == "fechaHasta") {
                setComprobantes(comprobantesOr.filter((comp1) => {
                    const partsfechaComp1 = comp1.Fecha.split("/")
                    const reverse1 = partsfechaComp1[2] + "-" + partsfechaComp1[1] + "-" + (partsfechaComp1[0].length == 1 ? '0' + partsfechaComp1[0] : partsfechaComp1[0])
                    console.log(reverse1)
                    if (reverse1 <= value) {
                        return comp1
                    }
                }))
            } else if (name == "TipoFact") {
                setComprobantes(comprobantesOr.filter(fac => {
                    if (fac.Tipo == value) {
                        return fac
                    }
                    else if (value == "") {
                        return fac
                    }

                }
                ))
            }
        }

    })

    console.log(comprobantesOr)
    console.log(comprobantes)
    return (
        <>
            {isLoading ? <CustomSpinner></CustomSpinner> :
                <div className='d-flex flex-column align-items-center mt-3'>
                    <h2 className='text-light'>Facturas</h2>
                    <div className='mx-auto w-75 mt-2'>
                        <div className='d-flex flex-column gap-4'>
                            <div className='d-flex gap-5'>
                                <div className='d-flex gap-2 align-items-center'>
                                    <label className='text-white' >Proveedor:</label>
                                    <input type="text" name='nombreProveedor' onChange={handleChange} />

                                </div>
                                <div className='d-flex gap-2 align-items-center'>
                                    <label className='text-white'>Fecha Desde:</label>
                                    <input type="date" name='fechaDesde' onChange={handleChange} />
                                </div>
                                <div className='d-flex gap-2 align-items-center'>
                                    <label className='text-white'>Fecha Hasta:</label>
                                    <input type="date" name='fechaHasta' onChange={handleChange} />
                                </div>
                            </div>
                            <div className='d-flex gap-2 align-items-center'>
                                <label className='text-white'>Letra Factura:</label>
                                <select name='TipoFact' onChange={handleChange}>
                                    <option value=""></option>
                                    <option value="a">A</option>
                                    <option value="b">B</option>
                                    <option value="c">C</option>

                                </select>

                            </div>
                        </div>
                        <div className=' my-3 d-flex justify-content-end'>
                            <Link to={"/AbmComprobantes"}>
                                <button className='btn btn-success'>Add New</button>
                            </Link>
                        </div>
                        <MDBListGroup style={{ minWidth: '22rem' }} light>
                            <div className='container align-items-center justify-content-center pt-3 rounded' style={{ backgroundColor: "black" }} >
                                <div className='row align-items-center'>
                                    <div className='col mx-2'>
                                        <p className='fw-bold  text-light'>Proveedor</p>
                                    </div>
                                    <div className="col ps-4" >
                                        <p className='fw-bold text-light'>Fecha</p>

                                    </div>
                                    <div className="col ms-4">
                                        <p className='fw-bold  text-light'>Letra</p>

                                    </div>
                                    <div className="col pe-4">
                                        <p className='fw-bold text-white'>Precio</p>
                                    </div>
                                    <div className='col d-flex align-items-center ps-5'>
                                        <p className='fw-bold text-light'>Opciones</p>
                                    </div>
                                </div>
                            </div>
                            <ComprobantesItems comprobantes={comprobantes} />
                        </MDBListGroup>

                    </div>
                </div>
            }
        </>
    )
}

export default ComprobantesPago