import { MDBBadge, MDBListGroupItem } from 'mdb-react-ui-kit';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import AbmPropiedades from '../AbmPropiedades/AbmPropiedades';
import { useNavigate } from 'react-router-dom';
const PropertiesItems = ({ propiedades }) => {
    const detail=(id, nombre, estado, descripcion, imagen, tipo, ubicacion)=>{
        console.log('aa')
        return(
            <Popup open={true} modal>
                        <AbmPropiedades propiedad={{id,nombre,estado,descripcion,imagen,tipo,ubicacion}} ></AbmPropiedades>
            </Popup>
        )
    }
    return (
        <>
            {
                propiedades.map(({ id, nombre, estado, descripcion, imagen, tipo, ubicacion }) =>
                    <MDBListGroupItem key={id} className='d-flex justify-content-between align-items-center' >
                        <div className='d-flex align-items-center' onClick={()=>detail(id, nombre, estado, descripcion, imagen, tipo, ubicacion)}>
                            <img
                                src={imagen}
                                alt={imagen}
                                style={{ width: '100px', height: '100px', marginLeft: '10px' }}
                                className='rounded-circle'
                            />
                            <div className='ms-3'>
                                <p className='fw-bold mb-1'>{nombre}</p>
                                <p className='text-muted mb-0'>{descripcion}</p>
                            </div>
                        </div>
                        {console.log(estado)}
                        <MDBBadge pill light color={estado == 'ocupado' ? 'danger' : 'success'} className='me-5'>
                            {estado}
                        </MDBBadge>
                    </MDBListGroupItem>
                )
            }
        </>
    )
}

export default PropertiesItems