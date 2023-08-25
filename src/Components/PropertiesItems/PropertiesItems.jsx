import { MDBBadge, MDBListGroupItem } from 'mdb-react-ui-kit';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import AbmPropiedades from '../AbmPropiedades/AbmPropiedades';
import { useNavigate } from 'react-router-dom';
import { BsPencil } from "react-icons/bs";
const PropertiesItems = ({ propiedades }) => {
    
    return (
        <>
            {
                propiedades.map(({ id, nombre, estado, descripcion, imagen, tipo, ubicacion }) =>
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
                            <Popup trigger={<button  className='btn btn-warning '><BsPencil></BsPencil></button>} modal>
                                <AbmPropiedades propiedad={{id, nombre, estado, descripcion, imagen, tipo, ubicacion }} status={'edit'}></AbmPropiedades>
                            </Popup>
                            
                            <MDBBadge pill light color={estado == 'ocupado' ? 'danger' : 'success'} className='me-5'>

                                {estado}
                            </MDBBadge>
                        </div>
                    </MDBListGroupItem>
                )
            }
        </>
    )
}

export default PropertiesItems