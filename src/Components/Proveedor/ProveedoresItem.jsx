
import { MDBListGroupItem } from 'mdb-react-ui-kit';
import { useContext, useMemo, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { BsPencil, BsTrash } from "react-icons/bs";
import { app } from '../../FireBase/config'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import ABMProveedor from './ABMProveedor';
import { useNavigate } from 'react-router-dom'
import { useUpdateContext } from '../../Context/updateContext';
import { MyProvider, ProvContext } from '../ProveedorContext/ProveedorContext';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const ProveedoresItem = ({ proveedores, forSelected, setNomProv, setOpenModal, close }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentProveedores = proveedores.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(propiedades.length / itemsPerPage);
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  };

  const navigate = useNavigate();
  const db = getFirestore(app);
  const deleteDoc = (id) => {
    console.log(id)
    const examcollref = doc(db, 'proveedores', id)
    updateDoc(examcollref, { Activo: false }).then(() => {
      const MySwal = withReactContent(Swal)

      MySwal.fire({
        title: <strong>Se ha eliminado con Exito!</strong>,
        icon: 'success',
        preConfirm: () => {
          navigate(0)
        }
      })
      
    }).catch(error => {
      console.log(error.message)
    })
    
  }
  // const {value,setValue}=useContext(ProvContext)
  // const getProv=(id,nombre)=>{
  //   setValue({nomProv:nombre,idProve:id})
  //   navigate(0)
  // }

  return (
    <>
      {
        currentProveedores.map(({ id, nombre, descripcion, CUIT, email, telefono }) =>
          <MDBListGroupItem key={id} className='container align-items-center justify-content-center'>
            <div className='row '>
              <div className='col'>
                <p className='mb-0 text-dark'>{nombre}</p>
              </div>
              <div className="col" >
                <p className='mb-0 text-dark'>{descripcion}</p>
              </div>
              <div className="col">
                <p className='mb-0 text-dark'>{CUIT}</p>
              </div>
              <div className="col-3">
                <p className='mb-0 text-dark'>{email}</p>
              </div>
              <div className="col">
                <p className='mb-0 text-dark'>{telefono}</p>
              </div>
              {forSelected != "" ?
                <div className='col d-flex align-items-center'>
                  <button onClick={() => { setNomProv({ nomProv: nombre, idProv: id }), close() }} className='btn btn-success' >Seleccionar</button>
                </div>
                : <div className='col d-flex align-items-center'>
                  <button className='btn btn-warning' onClick={()=>navigate("/ABMProveedor",{state:{detailData:{id,nombre,descripcion,CUIT,email,telefono}}})}><BsPencil ></BsPencil></button>
                  {/* <Popup trigger={<button className='btn btn-warning'><BsPencil ></BsPencil></button>} modal>
                    <ABMProveedor proveedor={{ id, nombre, descripcion, CUIT, email, telefono }}></ABMProveedor>
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
            disabled={endIndex >= proveedores.length}
          >
            Next
          </button>
        </p>
      </div>
    </>
  )
}

export default ProveedoresItem