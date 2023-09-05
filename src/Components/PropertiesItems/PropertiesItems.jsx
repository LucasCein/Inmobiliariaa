import { MDBBadge, MDBListGroupItem } from 'mdb-react-ui-kit';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import AbmPropiedades from '../AbmPropiedades/AbmPropiedades';
import { useNavigate } from 'react-router-dom';
import { BsPencil } from "react-icons/bs";


const PropertiesItems = ({ propiedades }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const currentItems = propiedades.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage(Math.max(currentPage - 1, 1));
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(propiedades.length / itemsPerPage);
        setCurrentPage(Math.min(currentPage + 1, totalPages));
    };
    
    return (
        <>
            {
                currentItems.map(({ id, nombre, estado, descripcion, imagen, tipo, ciudad, barrio, calle, altura, cp, piso, depto, cantBaños, cantCuarto, wifi, aire, estacionamiento, lavarropa, area  }) =>
                    <MDBListGroupItem key={id} className='d-flex justify-content-between align-items-center' >
                        <div className='d-flex align-items-center'>
                            <img
                                src={imagen}
                                alt={imagen}
                                style={{ width: '80px', height: '80px', marginLeft: '10px' }}
                                className='rounded-circle'
                            />
                            <div className='ms-3'>
                                <p className='fw-bold mb-1'>{nombre}</p>
                                <p className='text-muted mb-0'>{descripcion}</p>
                            </div>
                        </div>
                        <div className='d-flex align-items-center gap-3'>
                            <Popup className='w-100' trigger={<button  className='btn btn-warning '><BsPencil></BsPencil></button>} modal>
                                <AbmPropiedades propiedad={{id, nombre, estado, descripcion, imagen, tipo, ciudad, barrio, calle, altura, cp, piso, depto, cantBaños, cantCuarto, wifi, aire, estacionamiento, lavarropa, area }} status={'edit'}></AbmPropiedades>
                            </Popup>
                            
                            <MDBBadge pill light color={estado == 'ocupado' ? 'danger' : 'success'} className='me-5'>

                                {estado}
                            </MDBBadge>
                        </div>
                    </MDBListGroupItem>
                )
            }
        <div className="d-flex flex-column align-items-center">
            <p>
        <button
            style={{margin:'5px'}}
          className="btn btn-secondary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
            style={{margin:'5px'}}
          className="btn btn-secondary"
          onClick={handleNextPage}
          disabled={endIndex >= propiedades.length}
        >
          Next
        </button>
        </p>
      </div>
        </>
    )
}

export default PropertiesItems