import { collection, getDocs, getFirestore, query, where, doc, getDoc } from 'firebase/firestore';
import { MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import Popup from 'reactjs-popup';
import { BsEyeFill, BsPencil } from 'react-icons/bs';
import ABMVentas from './ABMVentas';
import DetalleVenta from './DetalleVenta';

const Ventas = () => {
  const [ventas, setVentas] = useState([])
  const [ventas_og, setVentas_og] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentventas = ventas.slice(startIndex, endIndex);

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const dbFirestore = getFirestore();
        const queryCollection = collection(dbFirestore, "venta");
        const querySnapshot = await getDocs(queryCollection);

        const ventasPromises = querySnapshot.docs.map(async (venta) => {
          const propiedadId = venta.data().propiedad_id;
          const clienteId = venta.data().cliente_id;

          // Obtener información de propiedad
          const propiedadRef = doc(dbFirestore, "propiedades", propiedadId);
          const propiedadSnapshot = await getDoc(propiedadRef);
          const propiedadNombre = propiedadSnapshot.data().nombre;

          // Obtener información de cliente
          const clienteRef = doc(dbFirestore, "clientes", clienteId);
          const clienteSnapshot = await getDoc(clienteRef);
          const clienteNombre = clienteSnapshot.data().Nombre;
          console.log(propiedadNombre)
          return {
            id: venta.id,
            propiedad: propiedadNombre,
            cliente: clienteNombre,
            ...venta.data(),
          };
          
        });

        const ventasData = await Promise.all(ventasPromises);
        setVentas(ventasData);
        setVentas_og(ventasData)
      } catch (error) {
        console.error("Error al cargar las ventas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarVentas();
  }, []);

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(ventas.length / itemsPerPage);
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  };

  const handleChange = (event => {
    let { name, value } = event.target
    if (value == "") {
      setVentas(ventas_og)
    }
    else {
      if (name == "nombreCliente") {
        setVentas(ventas.filter(venta => (venta.cliente.toLowerCase().includes(value.toLowerCase()))))
      } else if (name == "fechaDesde") {
        setVentas(ventas.filter(venta => (venta.fecha >= value)))

      } else if (name == "fechaHasta") {
        setVentas(ventas.filter(venta => (venta.fecha <= value)))
      }
    }
    })
  console.log(currentventas)
  return (
    <section>
      {isLoading ? (
        <CustomSpinner></CustomSpinner>
      ) : (
        <div className='mx-auto w-100 m-1 p-3' style={{ marginTop: '20px' }}>
          <h1 className='mb-4 text-center mt-4' style={{ color: "white" }}>Ventas</h1>
          <div className='row align-items-center justify-content-center'>
            <div className='col d-flex align-items-center justify-content-start'>
          <div>
                <label className='me-1' style={{ color: "white" }}>Clientes:</label>
                <input type='text' name='nombreCliente' onChange={handleChange}  placeholder='Filtrar' style={{ height: '26px' }} />
              </div>
              <div className=' ms-4'>
                <label className='me-2' style={{ color: "white" }}>Fecha Desde:</label>
                <input type='date' name='fechaDesde' onChange={handleChange}  placeholder='Filtrar' />
              </div>
              <div className='ms-4'>
                <label className='me-2' style={{ color: "white" }}>Fecha Hasta:</label>
                <input type='date' name='fechaHasta' onChange={handleChange}  placeholder='Filtrar' />
            </div>
            </div>
            </div>
            
        <div className='d-flex justify-content-end me-2' >
          <Link to={"/ABMVentas"}>
            <button className='btn btn-success'>Add New</button>
          </Link>
        </div>
        <div>
          <MDBListGroup style={{ minWidth: '50rem' }} className='mt-3' light>
            <div className='container align-items-center justify-content-center pt-3 rounded' style={{ backgroundColor: "black" }} >
              <div className='row'>
                <div className='col ms-3'>
                  <p className='fw-bold  text-light'>Fecha</p>
                </div>
                <div className="col-2 ms-5" >
                  <p className='fw-bold text-light'>Forma de Pago</p>

                </div>
                <div className="col ms-4 ps-5">
                  <p className='fw-bold text-white'>Precio</p>
                </div>
                <div className='col ms-4 ps-4'>
                  <p className='fw-bold text-light'>Propiedad</p>
                </div>
                <div className='col ms-4 ps-5'>
                  <p className='fw-bold text-light'>Cliente</p>
                </div>
                <div className='col ms-5'>
                  <p className='fw-bold text-light'>Visualizar</p>
                </div>
              </div>
            </div>
            {currentventas?.map((venta) => (
              <MDBListGroupItem key={venta.id} className='container align-items-center justify-content-center ' >
                <div className="row ms-1">
                  <div className='col'>
                    <p className='text-dark mb-0'>{venta.fecha}</p>
                  </div>
                  <div className="col">
                    <p className='text-dark mb-0'>{venta.f_pago}</p>
                  </div>
                  <div className="d-flex gap-2 col justify-content-center">
                    <p className='text-dark mb-0'>{venta.precio.toLocaleString('en-US', {
                      style: 'currency',currency: 'USD',
                      })}</p>
                  </div>
                  <div className="d-flex gap-2 col justify-content-center">
                    <p className='text-dark mb-0'>{venta.propiedad}</p>
                  </div>
                  <div className="d-flex gap-2 col justify-content-center">
                    <p className='text-dark mb-0'>{venta.cliente}</p>
                  </div>
                  <div className='col d-flex align-items-center justify-content-center'>
                  <Popup
                    trigger={
                      <button className='btn btn-info '><BsEyeFill></BsEyeFill></button>
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
            disabled={endIndex >= ventas.length}
          >
            Next
          </button>
        </p>
      </div>

    </section>

    

  )
}

export default Ventas