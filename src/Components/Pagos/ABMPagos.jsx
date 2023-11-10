
import React, { useState, useEffect } from 'react'
import { app } from '../../FireBase/config'
import { updateDoc, doc, collection, getDocs, getFirestore, query, where, addDoc, getDoc } from 'firebase/firestore';
import Select from "react-select";
import { MDBListGroup, MDBListGroupItem, MDBCheckbox } from 'mdb-react-ui-kit';
import { useLocation, useNavigate } from "react-router-dom"
import Form from "react-bootstrap/Form";
import Popup from 'reactjs-popup';
import { BsSearch, BsSlack } from "react-icons/bs";
import Proveedor from "../Proveedor/Proveedor";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'




const ABMPagos = (detailData) => {
  const [openModal, setOpenModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null);
  const [proveedores, setProveedores] = useState([])
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [comprobantes, setComprobantes] = useState([])
  const [comprobantesSeleccionados, setComprobantesSeleccionados] = useState([]);
  console.log(detailData)
  const db = getFirestore(app);
  const navigate = useNavigate();
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Añade un 0 al mes si es necesario
  const day = String(today.getDate()).padStart(2, '0'); // Añade un 0 al día si es necesario
  const formattedDate = `${year}-${month}-${day}`;

  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const hasDetailData = detailData && Object.keys(detailData).length > 0;
  useEffect(() => {
    const fetchComprobantes = async () => {
      const dbFirestore = getFirestore()
      const queryCollection = collection(dbFirestore, 'comprobantes')
      const queryCollectionFiltered = query(queryCollection, where('visible', '==', true), where('pagada', '==', false))
      const res = await getDocs(queryCollectionFiltered)
      let comprobantesData = res.docs.map(comprobante => ({
        id: comprobante.id,
        ...comprobante.data(),
        Fecha: comprobante.data().Fecha.toDate().toLocaleDateString(),
        nombreProveedor: '',
        originalDate: comprobante.data().Fecha
      }));

      comprobantesData = comprobantesData.filter(comprobante => comprobante.idProv == proveedorSeleccionado?.idProv);

      const propiedadCollection = collection(dbFirestore, 'propiedades');
      const propiedadSnapshot = await getDocs(propiedadCollection);
      const propiedadList = propiedadSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      comprobantesData = comprobantesData.map(comprobante => {
        const propiedad = propiedadList.find(prop => prop.id === comprobante.idProp)
        const comprobanteConPropiedad = {
          ...comprobante,
          nombrePropiedad: propiedad ? propiedad.nombre : '',
        };
        comprobantesData.filter(comprobante => comprobante.idProv == proveedorSeleccionado.id)
        return comprobanteConPropiedad;

      });

      setComprobantes(comprobantesData);
    }
    
    if (hasDetailData) {
      setComprobantesSeleccionados([{
        id: detailData.factura.id,
        nombrePropiedad: detailData.factura.nombreProveedor, // Asumiendo que hay un campo equivalente
        pTotal: detailData.factura.monto,
        Fecha: detailData.factura.fecha,
        Tipo: detailData.factura.metodo, // Asumiendo que hay un campo equivalente
        // Agrega aquí el resto de los campos necesarios
      }]);
      setSelectedDate(detailData.factura.fecha);
      setSelectedOption(method_Pay.find(option => option.value === detailData.factura.metodo));
      setProveedorSeleccionado({ idProv: detailData.factura.proveedor, nomProv: detailData.factura.nombreProveedor })

      const db = getFirestore(app);
      const docRef = doc(db, "detallePagoFacturas", detailData.factura.idDetalle);

      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const comprobantesIds = docSnap.data().idComp;
          const comprobantesPromises = comprobantesIds.map((compId) => {
            return getDoc(doc(db, "comprobantes", compId));
          });

          Promise.all(comprobantesPromises).then((comprobantesDocs) => {
            const propiedadesPromises = comprobantesDocs.map((comDoc) => {
              if (comDoc.exists()) {
                const comprobanteData = comDoc.data();
                const propRef = doc(db, "propiedades", comprobanteData.idProp);
                return getDoc(propRef).then((propSnap) => {
                  if (propSnap.exists()) {
                    // Agregamos el nombre de la propiedad al objeto de comprobante
                    comprobanteData.nombrePropiedad = propSnap.data().nombre;
                  } else {
                    comprobanteData.nombrePropiedad = "Propiedad no encontrada";
                  }
                  return {
                    id: comDoc.id,
                    ...comprobanteData,
                    Fecha: comprobanteData.Fecha.toDate().toLocaleDateString(),
                  };
                });
              } else {
                return Promise.resolve(null);
              }
            }).filter(Boolean); // Filtramos los comprobantes que no existen

            // Esperamos todas las promesas de las propiedades para completar los datos de comprobantes
            Promise.all(propiedadesPromises).then((comprobantesConPropiedades) => {
              // Filtramos los nulos por si algún comprobante no existía y actualizamos el estado
              const comprobantesValidos = comprobantesConPropiedades.filter(Boolean);
              setComprobantes(comprobantesValidos);
            });
          }).catch((error) => {
            console.error("Error al obtener los comprobantes: ", error);
          });
        } else {
          console.log("No se encontró el detalle de pago");
        }
      }).catch((error) => {
        console.error("Error al obtener el detalle de pago: ", error);
      });



    }
    else {
      fetchComprobantes()
      setComprobantesSeleccionados([])
    }
  }, [detailData, proveedorSeleccionado]);

  const handleChange = (comprobanteCheq) => {
    if (comprobantesSeleccionados.some(comprobante => comprobanteCheq.id == comprobante.id)) {
      const sacarComprobate = comprobantesSeleccionados.filter(comp => comp.id != comprobanteCheq.id)
      setComprobantesSeleccionados(sacarComprobate)
    }
    else {
      setComprobantesSeleccionados(comprobantesSeleccionados.concat(comprobanteCheq))
    }
  }

  const method_Pay = [
    { label: "Efectivo", value: "Efectivo" },
    { label: "Transferencia", value: "Transferencia" },
    { value: 'Tarjeta', label: 'Tarjeta' }
  ]

  const handleChangePay = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const createDetPag = () => {
    const idComp = (comprobantesSeleccionados.map(com => com.id))
    const dbRef = collection(db, "detallePagoFacturas");
    addDoc(dbRef, { idComp }).then((docRef) => {
      (comprobantesSeleccionados.map(com => {
        const examcollref = doc(db, 'comprobantes', com.id)
        updateDoc(examcollref, { pagada: true })
      }))
      console.log("detalle has been added successfully")
      createPag(docRef)
    })

  }

  const createPag = (idDet) => {
    console.log(proveedorSeleccionado)
    const pago = {
      fecha: selectedDate,
      metodo: selectedOption.value,
      proveedor: proveedorSeleccionado.idProv,
      monto: comprobantesSeleccionados.reduce((acc, com) => { return acc + com.pTotal }, 0)
    }
    const prop = { ...pago, visible: true, idDetalle: idDet.id }
    console.log(prop)
    const dbRef = collection(db, "pagoFacturas");
    addDoc(dbRef, prop).then(() => {
      const MySwal = withReactContent(Swal)

      MySwal.fire({
        title: <strong>Se ha Agregado con Exito!</strong>,
        icon: 'success',
        preConfirm: () => {
          navigate("/pagos")
        }
      })
    })
      .catch(error => {
        console.log(error)
      })
  }
  console.log(comprobantes)
  return (
    <div className='m-3'>
      <h1 className={!hasDetailData ? 'text-light mb-4 text-center' : ' mb-4 text-center'}>{!hasDetailData ? 'Registrar Pago' : 'Visualizar Pago'}</h1>
      <div className='d-flex align-items-center' style={{ color: 'white' }}>
        <div className='d-flex justify-content-center align-items-center'>
          <div className='d-flex justify-content-center align-items-center'>
            <p className={!detailData.factura ?'m-1 text-light': 'm-1 text-dark'}>Forma de pago:</p>
            <Select
              className="px-1 text-dark"
              value={selectedOption}
              onChange={handleChangePay}
              options={method_Pay}
              isDisabled={!!hasDetailData}
            ></Select>
          </div>
          <div className='d-flex justify-content-center align-items-center'>
            <label className={!detailData.factura ?'m-1 text-light': 'm-1 text-dark'}>Fecha de Pago:</label>
            <input className=" dateInp" type="date" name='Fecha' value={selectedDate} onChange={handleDateChange} readOnly={!!hasDetailData} />
          </div>
          <div className='d-flex justify-content-center align-items-center'>
            <p className={!hasDetailData ?'m-2 text-light': 'm-2 text-dark'}>Proveedor:</p>
            <Form.Control
              className="px-2"
              placeholder="Nombre Proveedor"
              value={proveedorSeleccionado?.nomProv}
              disabled
              readOnly
            />
            {!hasDetailData && <Popup open={openModal} className='popPupCompb' trigger={<button onClick={() => setOpenModal(true)} type="button" className="btn btn-success"><BsSearch></BsSearch></button>} modal>
              {close => <Proveedor forSelect={"forSelect"} setNomProv={setProveedorSeleccionado} close={close}></Proveedor>}
            </Popup>}
          </div>
        </div>
      </div>

      <div className='mt-4'>
        <div className='container align-items-center justify-content-center pt-1 rounded' style={{ backgroundColor: "black" }} >
          <div className='row'>
            <div className='col'>
              <p className='fw-bold  text-light'>Letra</p>
            </div>
            <div className="col">
              <p className='fw-bold text-light'>Fecha</p>

            </div>
            <div className="col">
              <p className='fw-bold  text-light'>Monto</p>

            </div>
            <div className="col">
              <p className='fw-bold text-white ms-3'>Nombre</p>
            </div>
            {!hasDetailData && <div className="col">
              <p className='fw-bold text-white'>Seleccion</p>
            </div>}
          </div>
        </div>
        {comprobantes.map((comprobante) => (
          <MDBListGroupItem key={comprobante.id} className='container align-items-center justify-content-center bg-white py-2'>
            <div className='row d-flex justify-content-center'>
              <div className='col'>
                <p className='text-dark mb-0 ms-4'>{comprobante.Tipo}</p>
              </div>
              <div className="col" >

                <p className='text-dark mb-0'>{comprobante.Fecha}</p>
              </div>
              <div className="col">

                <p className='text-dark mb-0 text-end pe-4'>{comprobante.pTotal.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}</p>
              </div>
              <div className="col">

                <p className='text-dark mb-0'>{comprobante.nombrePropiedad}</p>
              </div>

              {!hasDetailData && <div className='col justify-content-end align-items-end'>
                <MDBCheckbox onChange={() => handleChange(comprobante)} className='ms-3' />
              </div>}

            </div>

          </MDBListGroupItem>
        ))}

      </div>

      {comprobantesSeleccionados.length > 0 ?
        <div>
          <div className={!hasDetailData ? 'd-flex align-items-start justify-content-between m-1 mt-3 text-light' : 'd-flex align-items-start justify-content-between m-1 mt-3'}>
            <h3 >Total: {(comprobantesSeleccionados.reduce((acc, com) => { return acc + com.pTotal }, 0)).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}</h3>
          </div>
          <div className='d-flex align-items-center justify-content-center pt-3'>
            <button className='btn btn-success' onClick={createDetPag}>{detailData.length > 0 ? 'Actualizar' : 'Pagar'}</button>
          </div>
        </div>
        : ''}


    </div>
  )
}

export default ABMPagos