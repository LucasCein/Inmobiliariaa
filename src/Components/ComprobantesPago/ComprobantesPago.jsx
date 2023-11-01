import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import ComprobantesItems from '../ComprobantesItems/ComprobantesItems';
import { MDBListGroup } from 'mdb-react-ui-kit';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import './comprobantes.css'
import { Link } from 'react-router-dom';

const ComprobantesPago = () => {
    const [comprobantes, setComprobantes] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [comprobantesOr, setComprobantesOr] = useState([])

    useEffect(() => {

        const dbFirestore = getFirestore()
        const queryCollection = collection(dbFirestore, 'comprobantes')
        const queryCollectionFiltered = query(queryCollection, where('visible', '==', true),where('pagada', '==', false))
        getDocs(queryCollectionFiltered)
            .then(res => {
                const newComp = res.docs.map(comprobante => ({
                    id: comprobante.id,
                    ...comprobante.data(),
                    Fecha: comprobante.data().Fecha.toDate().toLocaleDateString(),
                    nombreProveedor: '',
                    originalDate: comprobante.data().Fecha
                }))
                setComprobantes(newComp)
                setComprobantesOr(newComp)
                return newComp
            })
            .then(async (newComprobantes) => {  // Recibe los comprobantes y los actualiza con la información adicional
                const updatedComprobantes = await Promise.all(
                    newComprobantes.map(async (comprobante) => {
                        const proveedorInfo = await nombreProv(comprobante.idProv);
                        const propiedadInfo = await nombreProp(comprobante.idProp);
                        return {
                            ...comprobante,
                            nombreProveedor: proveedorInfo.nombre,
                            cuitProveedor: proveedorInfo.cuit,
                            nombrePropiedad: propiedadInfo.nombre
                        };
                    })
                );
                
                setComprobantes(updatedComprobantes);
                setComprobantesOr(updatedComprobantes);
            })
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

    const handleChange = (event) => {
        let { name, value } = event.target;
        let filteredComprobantes = [];
        switch(name) {
            case "nombreProveedor":
                filteredComprobantes = comprobantesOr.filter(fac => fac.nombreProveedor.toLowerCase().includes(value.toLowerCase()));
                break;
    
            case "fechaDesde":
                filteredComprobantes = comprobantesOr.filter(comp => {
                    const partsfechaComp = comp.Fecha.split("/");
                    const reverse = partsfechaComp[2] + "-" + partsfechaComp[1] + "-" + (partsfechaComp[0].length === 1 ? '0' + partsfechaComp[0] : partsfechaComp[0]);
                    return reverse >= value;
                });
                break;
    
            case "fechaHasta":
                filteredComprobantes = comprobantesOr.filter(comp => {
                    const partsfechaComp = comp.Fecha.split("/");
                    const reverse = partsfechaComp[2] + "-" + partsfechaComp[1] + "-" + (partsfechaComp[0].length === 1 ? '0' + partsfechaComp[0] : partsfechaComp[0]);
                    return reverse <= value;
                });
                break;
    
            case "TipoFact":
                filteredComprobantes = comprobantesOr.filter(fac => {
                    if (fac.Tipo === value || value === "") {
                        return true;
                    }
                    return false;
                });
                break;
    
            default:
                break;
        }
    
        console.log("Filtrados:", filteredComprobantes); 
        setComprobantes(filteredComprobantes);
    }
    

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