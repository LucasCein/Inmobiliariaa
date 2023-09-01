import { MDBListGroup } from 'mdb-react-ui-kit';
import ProveedoresItem from '../Proveedor/ProveedoresItem'
import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import React from 'react'
import ABMProveedor from './ABMProveedor';
 
const Proveedor = () => {
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
        if(name.includes("name")){
            setProveedores(proveedores.filter(proveedor=>(proveedor.nombre.toLowerCase().includes(value.toLowerCase()))))
        }
        else if(name.includes("des")){
            setProveedores(proveedores.filter(proveedor=>(proveedor.descripcion.toLowerCase().includes(value.toLowerCase()))))
        }
        if( value == ""){
            setProveedores(proveedores_og)
        }
      })

   return (
        <section>
            {isLoading ? <CustomSpinner></CustomSpinner> :
            <>
            <div className='mx-auto w-75 ' style={{ marginTop: '200px' }}>
            <div className='w-100 h-100' >
                <p style={{color:"white"}}>Nombre:</p>
                <input style={{marginBottom:"10px"}} type='text' name='name_search' onChange={handleChange} placeholder='Filtrar' className='w-100 h-200'/>
                <p style={{color:"white"}}>Descricpcion:</p>
                <input style={{marginBottom:"10px"}} type='text' name='des_search' onChange={handleChange} placeholder='Filtrar' className='w-100 h-200'/>
            </div>
            <h1 style={{color: "white"}}>Proveedores</h1>
                <div className=' my-3 d-flex justify-content-end'>
                    <Popup trigger={<button type="button" className="btn btn-success">Add New</button>} modal>
                        <ABMProveedor proveedor={{nombre:"", descripcion:"",direccion:""}}></ABMProveedor>
                    </Popup>
                </div>
                <MDBListGroup style={{ minWidth: '22rem' }} light>
                    <ProveedoresItem proveedores={proveedores} />
                </MDBListGroup>
            </div>
            </>}

        </section>
   )
 }

 export default Proveedor
 