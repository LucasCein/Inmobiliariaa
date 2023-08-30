import React from 'react'
import { MDBBadge, MDBListGroupItem } from 'mdb-react-ui-kit';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import AbmPropiedades from '../AbmPropiedades/AbmPropiedades';
import { useNavigate } from 'react-router-dom';
import { BsPencil } from "react-icons/bs";

const ProveedoresItem = ({proveedores}) => {
  return (
    <>
    {
        proveedores.map(({ nombre , descripcion, direccion }) =>
            <MDBListGroupItem key={nombre} className='d-flex justify-content-between align-items-center' >
                <div className='d-flex align-items-center'>
                    <div className='ms-3'>
                        <p className='fw-bold mb-1'>{nombre}</p>
                        <p className='text-muted mb-0'>Actividad: {descripcion}</p>
                        <p className='text-muted mb-0'>Direccion: {direccion}</p>
                    </div>
                </div>
                <div className='d-flex align-items-center gap-3'>
                    <Popup trigger={<button  className='btn btn-warning ' onClick={()=>{console.log('Hola')}}><BsPencil></BsPencil></button>} modal>
                    </Popup>      
                </div>
            </MDBListGroupItem>
        )
    }
    </>
  )
}

export default ProveedoresItem