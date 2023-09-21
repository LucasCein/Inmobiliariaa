import React from 'react'
import { MDBListGroupItem } from 'mdb-react-ui-kit';
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import {doc, getFirestore, updateDoc } from 'firebase/firestore'
import { app } from '../../FireBase/config'
import Popup from 'reactjs-popup';
import { BsPencil, BsTrash } from "react-icons/bs";
import ABMPagos from './ABMPagos';





const PagosItem = ({facturas}) => {
    const navigate = useNavigate();

    const db = getFirestore(app);
    const deleteDoc=(id)=>{
        console.log(id)
        const examcollref = doc(db, 'pagoFacturas',id)
        updateDoc(examcollref, {visible:false}).then(() => {
          alert("Deleted")
          navigate(0)
        }).catch(error => {
          console.log(error.message)
        })
      }
  return (
    <>
    {
        facturas.map(({id,nombreProveedor , monto, fecha, metodo, idDetalle }) =>
            <MDBListGroupItem key={id} className='container align-items-center justify-content-center'>
                <div className='row '>
                        <div className='col'>
                            <p className='fw-bold mb-1'>Proveedor</p>
                            <p className='text-muted mb-0'>{nombreProveedor}</p>
                        </div>
                        <div className="col" >
                            <p className='fw-bold mb-1'>Monto</p>
                            <p className='text-muted mb-0'>${monto}</p>
                        </div>
                        <div className="col">
                            <p className='fw-bold mb-1'>Fecha</p>
                            <p className='text-muted mb-0'>{fecha}</p>
                        </div>
                        <div className="col">
                            <p className='fw-bold mb-1'>Forma de Pago</p>
                            <p className='text-muted mb-0'>{metodo}</p>
                        </div>
                        <div className='col d-flex align-items-center'>
                        <Popup trigger={<button  className='btn btn-warning'><BsPencil ></BsPencil></button>} modal>
                            <ABMPagos factura={{id,nombreProveedor,monto,fecha,metodo,idDetalle}}></ABMPagos>
                        </Popup>
                        <button className='btn btn-danger ms-2' onClick={()=>deleteDoc(id)}><BsTrash></BsTrash></button>
                    </div>
              </div>
            
            </MDBListGroupItem>
        )  
    }
    </>
  )
}

export default PagosItem