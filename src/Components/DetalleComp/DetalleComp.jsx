import { MDBListGroupItem } from "mdb-react-ui-kit"
import Popup from "reactjs-popup"
import { CloseButton } from "react-bootstrap"

const DetalleComp = ({productos, handleDeleteProduct }) => {
 console.log(productos)
  return (
    <>
            {
                productos?.map(({ id,nombre,descripcion,precio }) =>
                    <MDBListGroupItem key={id} className='d-flex justify-content-between' >
                        <div className='d-flex align-items-center '>
                            <div className="d-flex gap-4">
                                <div className='ms-3'>
                                    <p className='fw-bold mb-1'>Nombre</p>
                                    <p className='text-muted mb-0'>{nombre}</p>
                                </div>
                                <div className="ms-3">
                                    <p className='fw-bold mb-1'>Descripcion</p>
                                    <p className='text-muted mb-0'>{descripcion}</p>
                                </div>
                                <div className="ms-3">
                                    <p className='fw-bold mb-1'>Precio</p>
                                    <p className='text-muted mb-0'>${precio}</p>
                                </div>
                                <div className="ms-3">
                <p className="fw-bold mb-1">Eliminar</p>
                <CloseButton
                  onClick={() => {
                    handleDeleteProduct(id);
                  }}
                />
              </div>

                            </div>
                            
                        </div>

                        
                    </MDBListGroupItem>
                )
            }
        </>
  )
}

export default DetalleComp