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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const currentfacturas = facturas.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage(Math.max(currentPage - 1, 1));
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(facturas.length / itemsPerPage);
        setCurrentPage(Math.min(currentPage + 1, totalPages));
    };

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
        currentfacturas.map(({id,nombreProveedor , monto, fecha, metodo, idDetalle }) =>
            <MDBListGroupItem key={id} className='container align-items-center justify-content-center '>
                <div className='row'>
                        <div className='col'>
                            <p className='mb-0 text-dark'>{nombreProveedor}</p>
                        </div>
                        <div className="col" >
                            <p className=' mb-0 text-dark'>${monto}</p>
                        </div>
                        <div className="col">
                            <p className=' mb-0 text-dark'>{fecha}</p>
                        </div>
                        <div className="col ">
                            <p className='mb-0 text-dark'>{metodo}</p>
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
          disabled={endIndex >= facturas.length}
        >
          Next
        </button>
        </p>
      </div>
    </>
  )
}

export default PagosItem