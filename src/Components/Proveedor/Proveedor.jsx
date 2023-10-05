import { MDBListGroup } from 'mdb-react-ui-kit';
import ProveedoresItem from '../Proveedor/ProveedoresItem'
import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import React from 'react'
import ABMProveedor from './ABMProveedor';
import { getValueFromValueOptions } from '@mui/x-data-grid/components/panel/filterPanel/filterPanelUtils';
 
const Proveedor = ({forSelect,setNomProv,setOpenModal,close}) => {
    const [proveedores, setProveedores] = useState([])
    const [proveedores_og, setProveedoresOG] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {

        const dbFirestore = getFirestore()
        const queryCollection = collection(dbFirestore, 'proveedores')

        const queryCollectionFiltered = query(queryCollection,where('Activo','==',true))

        getDocs(queryCollectionFiltered)
            .then(res =>{
                setProveedores(res.docs.map(proveedores => ({ ...proveedores.data() })))
                setProveedoresOG(res.docs.map(proveedor => ({ ...proveedor.data() }))); // Guardar la lista original
            })
            .catch(error => console.log(error))
            .finally(() => setIsLoading(false))
            
    }, [])
    const handleChange = (event => {
        let {name, value} = event.target
        if( value == ""){
            setProveedores(proveedores_og)
        }
        else{
            setProveedores(proveedores.filter(proveedor=>(proveedor[name].toLowerCase().includes(value.toLowerCase()))))
        }
      })

   return (
        <section>
            {isLoading ? <CustomSpinner></CustomSpinner> :
            <>
            <div className='mx-auto w-100 m-1 p-3' style={{ marginTop: '20px' }}>
            <h1 className={forSelect!=""?'mb-4 text-dark':'mb-4 text-white'}>Proveedores</h1>
            <div className='row align-items-center justify-content-center'>
                <div className='col d-flex align-items-center justify-content-start'>
                    <div className='mb-3'>
                        <label className={forSelect!=""?'me-2 text-dark':'me-2 text-white'}>Nombre:</label>
                        <input type='text' name='nombre' onChange={handleChange} placeholder='Filtrar'  />
                    </div>
                    <div className='mb-3 ms-4'>
                        <label className={forSelect!=""?'me-2 text-dark':'me-2 text-white'}>Descripción:</label>
                        <input type='text' name='descripcion' onChange={handleChange} placeholder='Filtrar'  />
                    </div>
                </div>
                <div className='d-flex align-items-center justify-content-start'>
                    <label className={forSelect!=""?'me-2 text-dark':'me-2 text-white'}>CUIT:</label>
                    <input className='ms-4' type='text' name='CUIT' onChange={handleChange} placeholder='Filtrar' />
                </div>    
            </div>
                <div className=' my-3 d-flex justify-content-end'>
                    <Popup trigger={<button type="button" className="btn btn-success">Add New</button>} modal>
                        <ABMProveedor proveedor={{nombre:"", descripcion:"",direccion:""}}></ABMProveedor>
                    </Popup>
                </div>
                <MDBListGroup className='w-100'>
                <div className='container align-items-center justify-content-center pt-1 rounded' style={{backgroundColor:"black"}} >
            <div className='row'>
                <div className='col ms-2'>
                  <p className='fw-bold  text-light'>Nombre</p>
                  </div>
                 <div className="col ps-3">
                    <p className='fw-bold text-light'>Descripcion</p>
         
                  </div>
                  <div className="col ps-5">
                    <p className='fw-bold  text-light'>CUIT</p>
                  
                 </div>
                  <div className="col ps-4">
                   <p className='fw-bold text-white'>E-Mail</p>       
                  </div>
                  <div className="col ps-5 ms-3">
                   <p className='fw-bold text-white ps-1'>Telefono</p>       
                  </div>
                  <div className='col d-flex align-items-center justify-content-center me-3'>
                    <p className='fw-bold text-light'>Opciones</p>    
                  </div>
            </div>
            </div>
                    <ProveedoresItem proveedores={proveedores} forSelected={forSelect} setNomProv={setNomProv} setOpenModal={setOpenModal} close={close}/>
                </MDBListGroup>
            </div>
            </>}

        </section>
   )
 }

 export default Proveedor
 