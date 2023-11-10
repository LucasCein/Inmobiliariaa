import React from 'react'
import { useState } from 'react';
import ABMClienets from './ABMClienets';
import { MDBListGroupItem } from 'mdb-react-ui-kit';
import Popup from 'reactjs-popup';
import { BsPencil, BsTrash } from "react-icons/bs";
import { app } from '../../FireBase/config'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ClientesItem = ({ clientes, forSelected, setNomCli, setOpenModal, close }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  console.log(clientes)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentClientes = clientes.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(clienets.length / itemsPerPage);
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  };

  const navigate = useNavigate();
  const db = getFirestore(app);
  const deleteDoc = (id) => {
    console.log(id)
    const examcollref = doc(db, 'clientes', id)
    updateDoc(examcollref, { Activo: false }).then(() => {
      const MySwal = withReactContent(Swal);

      MySwal.fire({
        title: <strong>Se ha Eliminado con Exito!</strong>,
        icon: "success",
        
      });
    }).catch(error => {
      console.log(error.message)
    })
  }

  return (
    <>
      {
        currentClientes.map(({ id, Nombre, CUIT, email, telefono }) =>
          <MDBListGroupItem key={id} className='container align-items-center justify-content-center'>
            <div className='row '>
              <div className='col'>
                <p className='mb-0 text-dark'>{Nombre}</p>
              </div>
              <div className="col" >
                <p className='mb-0 text-dark'>{CUIT}</p>
              </div>
              <div className="col">
                <p className='mb-0 text-dark'>{email}</p>
              </div>
              <div className="col ps-5 ms-5">
                <p className='mb-0 text-dark'>{telefono}</p>
              </div>

              {forSelected != "" ?
                <div className='col d-flex align-items-center'>
                  <button onClick={() => { setNomCli({ nomCli: Nombre, idCli: id }), close() }} className='btn btn-success' >Seleccionar</button>
                </div>
                : <div className='col d-flex align-items-center'>
                  <button className='btn btn-warning' onClick={() => navigate("/ABMClientes", { state: { detailData: { id, Nombre, CUIT, email, telefono } } })}><BsPencil ></BsPencil></button>
                  {/* <Popup trigger={<button  className='btn btn-warning'><BsPencil ></BsPencil></button>} modal>
                        <ABMClienets cliente={{id,Nombre,CUIT, email, telefono}}></ABMClienets>
                        </Popup> */}
                  <button className='btn btn-danger ms-2' onClick={() => deleteDoc(id)}><BsTrash></BsTrash></button>
                </div>}
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
            disabled={endIndex >= clientes.length}
          >
            Next
          </button>
        </p>
      </div>
    </>
  )
}

export default ClientesItem