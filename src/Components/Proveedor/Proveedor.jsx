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
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {

        const dbFirestore = getFirestore()
        const queryCollection = collection(dbFirestore, 'proveedores')

        const queryCollectionFiltered = query(queryCollection,where('Activo','==',true))

        getDocs(queryCollectionFiltered)
            .then(res => setProveedores(res.docs.map(proveedores => ({ ...proveedores.data() }))))
            .catch(error => console.log(error))
            .finally(() => setIsLoading(false))
    }, [])
   return (
        <section>
            {isLoading ? <CustomSpinner></CustomSpinner> :
            <>
            <div className='mx-auto w-75 ' style={{ marginTop: '200px' }}>
                <div className=' my-3 d-flex justify-content-end'>
                    <Popup trigger={<button type="button" className="btn btn-success">Add New</button>} modal>
                        <ABMProveedor></ABMProveedor>
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
 