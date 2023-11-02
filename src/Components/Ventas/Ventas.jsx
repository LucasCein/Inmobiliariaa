import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import Popup from 'reactjs-popup';
import { BsPencil } from 'react-icons/bs';
import ABMVentas from './ABMVentas';
import DetalleVenta from './DetalleVenta';

const Ventas = () => {
  const [ventas, setVentas] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const dbFirestore = getFirestore();
    const queryCollection = collection(dbFirestore, "venta");
    getDocs(queryCollection)
      .then((res) =>
        setVentas(
          res.docs.map((ventas) => ({
            id: ventas.id,
            ...ventas.data(),
          }))
        )
      )
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, []);
  console.log(ventas)
  return (
    <section>
      {isLoading ? (
        <CustomSpinner></CustomSpinner>
      ) : (<div className='d-flex flex-column '>
        <div className=' mt-5 me-5 d-flex align-self-end'>
          <Link to={"/ABMVentas"}>
            <button className='btn btn-success'>Add New</button>
          </Link>
        </div>
        <div>
          <MDBListGroup style={{ minWidth: '50rem' }} className='mt-5' light>
            <div className='container align-items-center justify-content-center pt-3 rounded' style={{ backgroundColor: "black" }} >
              <div className='row align-items-center'>
                <div className='col mx-2'>
                  <p className='fw-bold  text-light'>Fecha</p>
                </div>
                <div className="col ps-4" >
                  <p className='fw-bold text-light'>Forma de Pago</p>

                </div>
                <div className="col pe-4">
                  <p className='fw-bold text-white'>Precio</p>
                </div>
                <div className='col d-flex align-items-center ps-5'>
                  <p className='fw-bold text-light'>Visualizar</p>
                </div>
              </div>
            </div>
            {ventas?.map((venta) => (
              <MDBListGroupItem key={venta.id} className='container align-items-center justify-content-center ' >
                <div className="row ms-1">
                  <div className='col'>
                    <p className='text-dark mb-0'>{venta.fecha}</p>
                  </div>
                  <div className="col">
                    <p className='text-dark mb-0'>{venta.f_pago}</p>
                  </div>
                  <div className="d-flex gap-2 col justify-content-center">
                    <p className='text-dark mb-0'>${venta.precio}</p>
                  </div>
                  <div className='col'>
                  <Popup
                    trigger={
                      <button className="btn btn-warning ms-5">
                        <BsPencil></BsPencil>
                      </button>
                    }
                    modal
                  >
                    <DetalleVenta
                      detalle_id={venta.detalle_id.id}
                      venta={venta}
                    ></DetalleVenta>
                  </Popup>
                  </div>
                </div>
              </MDBListGroupItem>
            ))}

          </MDBListGroup>
        </div>
      </div>)}

    </section>

  )
}

export default Ventas