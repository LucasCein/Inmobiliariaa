import React from 'react'
import ABMClienets from './ABMClienets'
import Popup from 'reactjs-popup';
import { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import { MDBListGroup } from 'mdb-react-ui-kit';
import ClientesItem from './ClientesItem';
import { useNavigate } from 'react-router-dom';


const Clientes = ({ forSelect, setNomCli, setOpenModal, close }) => {
    const [clientes, setClientes] = useState([])
    const [clientes_og, setClientesOg] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {

        const dbFirestore = getFirestore()
        const queryCollection = collection(dbFirestore, 'clientes')

        const queryCollectionFiltered = query(queryCollection, where('Activo', '==', true))

        getDocs(queryCollectionFiltered)
            .then(res => {
                setClientes(res.docs.map(clientes => ({ ...clientes.data() })))
                setClientesOg(res.docs.map(clientes => ({ ...clientes.data() }))); // Guardar la lista original
            })
            .catch(error => console.log(error))
            .finally(() => setIsLoading(false))

    }, [])
    const handleChange = (event => {
        let { name, value } = event.target
        if (value == "") {
            setClientes(clientes_og)
        }
        else {
            setClientes(clientes.filter(cliente => (cliente[name].toLowerCase().includes(value.toLowerCase()))))
        }
    })
    const nav=useNavigate()
    const detailData={ Nombre: "", Telefono: "", Email: "", CUIT: "" }
    return (
        <section>
            {isLoading ? <CustomSpinner></CustomSpinner> :
                <>
                    <div className='mx-auto w-100 m-1 p-3 text-white' style={{ marginTop: '20px' }}>
                        <h1 className={forSelect != "" ? 'mb-4 text-dark' : 'mb-4 text-white'}>Clientes</h1>
                        <div className='row align-items-center justify-content-center'>
                            <div className='col d-flex align-items-center justify-content-start'>
                                <div className='mb-3'>
                                    <label className={forSelect != "" ? 'me-2 text-dark' : 'me-2 text-white'}>Nombre:</label>
                                    <input type='text' name='nombre' onChange={handleChange} placeholder='Filtrar' />
                                </div>
                                <div className='mb-3 ms-4'>
                                    <label className={forSelect != "" ? 'me-2 text-dark' : 'me-2 text-white'}>Telefono:</label>
                                    <input type='text' name='telefono' onChange={handleChange} placeholder='Filtrar' />
                                </div>
                                <div className='mb-3 ms-4'>
                                    <label className={forSelect != "" ? 'me-2 text-dark' : 'me-2 text-white'}>CUIT:</label>
                                    <input type='text' name='CUIT' onChange={handleChange} placeholder='Filtrar' />
                                </div>
                            </div>
                        </div>
                        <div className='my-3 d-flex justify-content-end me-2'>
                            <button type="button" className="btn btn-success" onClick={()=>nav('/ABMClientes', { state: { detailData } })}>Add New</button>
                            {/* <Popup trigger={<button type="button" className="btn btn-success">Add New</button>} modal>
                                <ABMClienets cliente={{ Nombre: "", Telefono: "", Email: "", CUIT: "" }}></ABMClienets>
                            </Popup> */}
                        </div>
                        <MDBListGroup className='w-100'>
                            <div className='container align-items-center justify-content-center pt-1 rounded' style={{ backgroundColor: "black" }} >
                                <div className='row'>
                                    <div className='col ms-2'>
                                        <p className='fw-bold  text-light'>Nombre</p>
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
                            <ClientesItem clientes={clientes} forSelected={forSelect} setNomCli={setNomCli} setOpenModal={setOpenModal} close={close} />
                        </MDBListGroup>
                    </div>
                </>}
        </section>
    )
}


export default Clientes
