import React, { useState, useEffect } from 'react'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import Popup from 'reactjs-popup';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import { MDBListGroup } from 'mdb-react-ui-kit';
import ABMPagos from './ABMPagos';
import PagosItem from './PagosItem';
import { dark } from '@mui/material/styles/createPalette';
import { red } from '@mui/material/colors';



const Pagos = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [facturas, setFacturas] = useState([])
  const [facturas_og, setFacturasOg] = useState([])


  useEffect(() => {
    const fetchFacturas = async () => {
      const dbFirestore = getFirestore()
      const queryCollection = collection(dbFirestore, 'pagoFacturas')
      const queryCollectionFiltered = query(queryCollection, where('visible', '==', true))
      const res = await getDocs(queryCollectionFiltered)
      let facturasData = res.docs.map(factura => ({
        id: factura.id,
        ...factura.data(),
      }));

      const queryProveedores = collection(dbFirestore, 'proveedores')
      const proveedorSnapshot = await getDocs(queryProveedores);
      const proveedorList = proveedorSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      facturasData = facturasData.map(factura => {
        const proveedor = proveedorList.find(prop => prop.id === factura.proveedor)
        const facturaconProveedor = {
          ...factura,
          nombreProveedor: proveedor ? proveedor.nombre : '',
        };
        return facturaconProveedor;
      });

      setFacturas(facturasData);
      setFacturasOg(facturasData)
      setIsLoading(false)
    }
    fetchFacturas()
  }, [])

  const handleChange = (event => {
    let { name, value } = event.target
    if (value == "") {
      setFacturas(facturas_og)
    }
    else {
      if (name == "nombreProveedor") {
        setFacturas(facturas_og.filter(fac => (fac.nombreProveedor.toLowerCase().includes(value.toLowerCase()))))
      } else if (name == "fechaDesde") {
        setFacturas(facturas_og.filter(fac => (fac.fecha >= value)))

      } else if (name == "fechaHasta") {
        setFacturas(facturas_og.filter(fac => (fac.fecha <= value)))
      } else if (name == "FormaPago") {
        setFacturas(facturas_og.filter(fac => (fac.metodo.includes(value))))
      } else if (name == "montoDesde") {
        setFacturas(facturas_og.filter(fac => (fac.monto >= value)))
      } else if (name == "montoHasta") {
        setFacturas(facturas_og.filter(fac => (fac.monto <= value)))

      }
    }

  })

  return (
    <>
      {isLoading ? <CustomSpinner></CustomSpinner> :
        <div className='mx-auto w-100 m-1 p-3' style={{ marginTop: '20px' }}>
          <h1 className='mb-4' style={{ color: "white" }}>Pagos</h1>
          <div className='row align-items-center justify-content-center'>
            <div className='col d-flex align-items-center justify-content-start'>
              <div className='mb-3'>
                <label className='me-1' style={{ color: "white" }}>Proveedor:</label>
                <input type='text' name='nombreProveedor' onChange={handleChange} placeholder='Filtrar' style={{ height: '26px' }} />
              </div>
              <div className='mb-3 ms-4'>
                <label className='me-2' style={{ color: "white" }}>Fecha Desde:</label>
                <input type='date' name='fechaDesde' onChange={handleChange} placeholder='Filtrar' />
              </div>
              <div className='mb-3 ms-4'>
                <label className='me-2' style={{ color: "white" }}>Fecha Hasta:</label>
                <input type='date' name='fechaHasta' onChange={handleChange} placeholder='Filtrar' />
              </div>
            </div>
            <div className='d-flex align-items-center justify-content-start '>
              <label className='me-2' style={{ color: "white" }}>Forma de Pago:</label>
              <select className='ms-4' name='FormaPago' onChange={handleChange}>
                <option value="tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value=""></option>
              </select>
              <div className='ms-4'>
                <label className='' style={{ color: "white" }}>Monto Desde: $</label>
                <input type='number' name='montoDesde' onChange={handleChange} placeholder='Filtrar' style={{ height: '26px', width: '150px' }} />
              </div>
              <div className='ms-3'>
                <label className='' style={{ color: "white" }}>Monto Hasta: $</label>
                <input type='number' name='montoHasta' onChange={handleChange} placeholder='Filtrar' style={{ height: '26px', width: '150px' }} />
              </div>
            </div>
          </div>
          <div className=' my-3 d-flex justify-content-end'>
            <Popup trigger={<button type="button" className="btn btn-success">Add New</button>} modal>
              <ABMPagos factura={{ id: "", nombreProveedor: "", monto: "", fecha: "", metodo: "", idDetalle: "" }}></ABMPagos>
            </Popup>
          </div>
          <MDBListGroup className='w-100'>
            <div className='container align-items-center justify-content-center pt-1 rounded' style={{ backgroundColor: "black" }} >
              <div className='row '>
                <div className='col mx-2'>
                  <p className='fw-bold  text-light'>Proveedor</p>
                </div>
                <div className="col ps-4" >
                  <p className='fw-bold text-light'>Monto</p>

                </div>
                <div className="col ms-4">
                  <p className='fw-bold  text-light'>Fecha</p>

                </div>
                <div className="col pe-4">
                  <p className='fw-bold text-white'>Forma de Pago</p>
                </div>
                <div className='col d-flex align-items-center ps-5'>
                  <p className='fw-bold text-light'>Opciones</p>
                </div>
              </div>
            </div>
            <PagosItem facturas={facturas}></PagosItem>
          </MDBListGroup>
        </div>
      }
    </>
  )
}

export default Pagos