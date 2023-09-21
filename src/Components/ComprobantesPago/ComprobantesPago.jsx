import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import ComprobantesItems from '../ComprobantesItems/ComprobantesItems';
import Popup from 'reactjs-popup';
import { MDBListGroup } from 'mdb-react-ui-kit';
import AbmComprobantes from '../AbmComprobantes/AbmComprobantes';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import './comprobantes.css'
import Select, { components } from 'react-select'
const ComprobantesPago = () => {
    const [comprobantes, setComprobantes] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [inpFilter, setInpFilter] = useState()
    const [compFiltered, setCompFiltered] = useState([])
    const [filterSelected, setFilterSelected] = useState([])
    const [ComprobantesConProveedores, setComprobantesConProveedores] = useState([])
    useEffect(() => {
        async function fetchData() {
          try {
            const dbFirestore = getFirestore();
            const queryCollection = collection(dbFirestore, 'comprobantes');
            const queryCollectionFiltered = query(queryCollection, where('visible', '==', true));
            const res = await getDocs(queryCollectionFiltered);
            const comprobantesData = res.docs.map(comprobante => ({
              id: comprobante.id,
              ...comprobante.data(),
              Fecha: comprobante.data().Fecha.toDate().toLocaleDateString(),
              nombreProveedor: '',
              originalDate: comprobante.data().Fecha
            }));
      
            // Procesa los proveedores y propiedades aquí
            const proveedorCollection = collection(dbFirestore, 'proveedores');
            const proveedorSnapshot = await getDocs(proveedorCollection);
            const proveedorList = proveedorSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            const propiedadCollection = collection(dbFirestore, 'propiedades');
            const propiedadSnapshot = await getDocs(propiedadCollection);
            const propiedadList = propiedadSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
      
            const comprobantesConProveedoresTemp = comprobantesData.map(comprobante => {
              const proveedor = proveedorList.find(prov => prov.id === comprobante.idProv);
              const propiedad = propiedadList.find(prop => prop.id === comprobante.idProp)
      
              return {
                ...comprobante,
                nombreProveedor: proveedor ? proveedor.nombre : '',
                nombrePropiedad: propiedad ? propiedad.nombre : '',
                cuit: proveedor ? proveedor.CUIT : '',
              };
            });
      
            setComprobantesConProveedores(comprobantesConProveedoresTemp);
            setIsLoading(false);
          } catch (error) {
            console.error(error);
          }
        }
      
        fetchData();
      }, []);

    console.log(comprobantes)
    const filterOptions = [
        { value: 'date', label: 'Fecha' },
        { value: 'prov', label: 'Nombre Prov' },
        { value: 'tipo', label: 'Tipo Comp' }
    ]
    const handleChangeFilter = (e) => {
        console.log(e)
        if (e.value == 'date') {
            setInpFilter('date')
            setFilterSelected('date')
        }
        else if (e.value == 'prov') {
            setInpFilter('text')
            setFilterSelected('prov')
        }
        else {
            setInpFilter('text')
            setFilterSelected('tipo')
        }
    }
    const handleFilter = (e) => {

        if (filterSelected == 'date') {

            setCompFiltered(comprobantesConProveedores.filter((comp) => {
                const partsfechaComp = comp.Fecha.split("/")
                const reverse = partsfechaComp[2] + "-" + partsfechaComp[1] + "-" + (partsfechaComp[0].length == 1 ? '0' + partsfechaComp[0] : partsfechaComp[0])
                console.log(reverse)
                if (reverse == e.target.value) {
                    return comp
                }
            }))
        }
        else if (filterSelected == 'prov') {
            console.log(e.target.value)
            setCompFiltered(comprobantesConProveedores.filter((comp) => {
                console.log(comp.nombreProveedor)
                return comp.nombreProveedor.toLowerCase().includes(e.target.value.toLowerCase())
            }))
        }
        else if (filterSelected == 'tipo') {
            setCompFiltered(comprobantesConProveedores.filter((comp) => {
                if (comp.Tipo == e.target.value) {
                    return comp
                }
            }))
        }
    }

    console.log(comprobantesConProveedores)
    return (
        <>
            {isLoading ? <CustomSpinner></CustomSpinner> :
                <div className='d-flex flex-column align-items-center mt-5'>
                    <h2 className='text-light'>Facturas</h2>
                    <div className='mx-auto w-75 ' style={{ marginTop: '100px' }}>
                        <div className='d-flex '>
                            <input type={inpFilter} name="" id="" className='w-100' onChange={handleFilter} />
                            <Select className='comboCss basic-single select' options={filterOptions} placeholder={"Filtros"} name='filter' onChange={handleChangeFilter} ></Select>
                        </div>
                        <div className=' my-3 d-flex justify-content-end'>
                            <Popup className='popPupCompb' trigger={<button type="button" className="btn btn-success">Add New</button>} modal>
                                <AbmComprobantes comprobante={{ Fecha: "", Tipo: "", idProv: "", idProp: "", pTotal: "", idDetalle: "" }} ></AbmComprobantes>
                            </Popup>
                        </div>
                        <MDBListGroup style={{ minWidth: '22rem' }} light>
                            <ComprobantesItems comprobantes={compFiltered != "" ? compFiltered : comprobantes} />
                        </MDBListGroup>

                    </div>
                </div>
            }
        </>
    )
}

export default ComprobantesPago