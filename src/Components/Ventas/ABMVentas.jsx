import React, { useState, useEffect } from 'react'
import { app } from '../../FireBase/config'
import { updateDoc, doc, collection, getDocs, getFirestore, query, where, addDoc } from 'firebase/firestore';
import Clientes from '../Clientes/Clientes';
import { useNavigate } from "react-router-dom"
import Select from "react-select";
import Form from "react-bootstrap/Form";
import Popup from 'reactjs-popup';
import { BsArchiveFill, BsSearch, BsSlack } from "react-icons/bs";
import Properties from "../Properties/Properties";
import { MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import { NumericFormat } from 'react-number-format';


const ABMVentas = () => {

  const [openModal, setOpenModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null);
  const [clienteSeleccionado, setclienteSeleccionado] = useState('');
  const [comprobantes, setPropiedad] = useState([])
  const [propiedadesSeleccionados, setPropiedadSeleccionados] = useState([]);
  const [nomProp, setNomProp] = useState()
  const [modalProp, setModalProp] = useState(false)
  const [venta, setVenta] = useState({ f_pago: "", fecha: "", cliente_id: "", propiedad_id: "", precio: 0, detalle_id: "" })
  const [finalPrice, setFinalPrice] = useState(0)

  const db = getFirestore(app);
  const navigate = useNavigate();
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Añade un 0 al mes si es necesario
  const day = String(today.getDate()).padStart(2, '0'); // Añade un 0 al día si es necesario
  const formattedDate = `${year}-${month}-${day}`;
  const [cargos, setCargos] = useState([])
  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [cargosSeleccionados, setCargosSeleccionados] = useState([]);
  const [preciosSeleccionados, setPreciosSeleccionados] = useState({});

  useEffect(() => {
    const fetchPropiedades = async () => {
      const dbFirestore = getFirestore()

      const propiedadCollection = collection(dbFirestore, 'propiedades');
      const propiedadSnapshot = await getDocs(propiedadCollection);
      const propiedadList = propiedadSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPropiedad(propiedadList);
    }
    fetchPropiedades()
    const fetchCargos = async () => {
      const dbFirestore = getFirestore()

      const cargosCollection = collection(dbFirestore, 'cargos');
      const cargosSnapshot = await getDocs(cargosCollection);
      const cargosList = cargosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCargos(cargosList);
    }
    fetchCargos()
    setPropiedadSeleccionados([])
  }, [clienteSeleccionado])

  useEffect(() => {
    // Calcula el precio final sumando los precios de todos los cargos seleccionados
    const nuevoFinalPrice = cargosSeleccionados.reduce((total, cargo) => parseInt(total) + parseInt(cargo.precio), 0);
    setFinalPrice(nuevoFinalPrice);
  }, [cargosSeleccionados]);
  

  const handleCheckboxChange = (id) => {
    setCargosSeleccionados(prevCargosSeleccionados => {
      // Busca el índice del cargo con el ID especificado
      const index = prevCargosSeleccionados.findIndex(cargo => cargo.id === id);
  
      if (index !== -1) {
        // Si el cargo ya está en la lista, elimínalo (desmarcar el checkbox)
        return [
          ...prevCargosSeleccionados.slice(0, index),
          ...prevCargosSeleccionados.slice(index + 1),
        ];
      } else {
        // Si el cargo no está en la lista, agrégalo (marcar el checkbox)
        // Encuentra el objeto de cargo completo basado en el ID y agrégalo a la lista
        const cargoToAdd = cargos.find(cargo => cargo.id === id);
        return [...prevCargosSeleccionados, cargoToAdd];
      }
    });
  };

  const method_Pay = [
    { label: "Efectivo", value: "Efectivo" },
    { label: "Transferencia", value: "Transferencia" },
    { value: 'Tarjeta', label: 'Tarjeta' }
  ]

  const handleChangePay = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const handleDateChange = (event) => {
    setVenta({ ...venta, fecha: event.target.value });
  };

  const createDetVenta = () => {
    const carg={cargosSeleccionados}
    const dbRef = collection(db, "detalleVenta");
    addDoc(dbRef, carg).then((docRef) => {
      console.log("detalle has been added successfully");
      setVenta({ ...venta, idDetalle: docRef.id });
      createDoc(docRef);
      navigate("/Ventas")
    });

  };
  const handlePriceChange = (newPrice, cargoId) => {
    setCargosSeleccionados(prevCargosSeleccionados => {
      return prevCargosSeleccionados.map(cargo => {
        if (cargo.id === cargoId) {
          return { ...cargo, precio: newPrice };
        }
        return cargo;
      });
    })
  };

  const createDoc = (idDet) => {
    const carg = {
      ...venta,
      f_pago: selectedOption.value, fecha: venta.fecha, cliente_id: clienteSeleccionado.idCli, propiedad_id: nomProp.idProp, precio: finalPrice, detalle_id: idDet
    };
    const dbRef = collection(db, "venta");
    addDoc(dbRef, carg)
      .then(() => {
        console.log("Document has been added successfully");
        navigate(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='m-3'>
      <h1 className='text-light mb-4'>Generar Venta</h1>
      <div className='d-flex flex-column align-items-center' style={{ color: 'white' }}>
        <div className='d-flex justify-content-center align-items-center gap-3'>
          <div className='d-flex justify-content-center align-items-center'>
            <p className='m-1'>Forma de pago:</p>
            <Select
              className="px-1 text-dark"
              value={selectedOption}
              onChange={handleChangePay}
              options={method_Pay}

            ></Select>
          </div>
          <div className='d-flex justify-content-center align-items-center'>
            <label className='m-1'>Fecha de Venta:</label>
            <input className=" dateInp" type="date" name='Fecha' value={selectedDate} onChange={handleDateChange} />
          </div>
          <div className='d-flex justify-content-center align-items-center'>
            <p className='m-2'>Cliente:</p>
            <Form.Control
              className="px-2"
              placeholder="Nombre Cliente"
              value={clienteSeleccionado?.nomCli}
              disabled
              readOnly
            />
            <Popup open={openModal} className='popPupCompb' trigger={<button onClick={() => setOpenModal(true)} type="button" className="btn btn-success"><BsSearch></BsSearch></button>} modal>
              {close => <Clientes forSelect={"forSelect"} setNomCli={setclienteSeleccionado} close={close}></Clientes>}
            </Popup>
          </div>
          <Form.Control
            className="w-50"
            placeholder="Nombre Propiedad"
            value={nomProp?.nomProp}
            disabled
            readOnly
          />
          <Popup open={modalProp} className='popPupCompb' trigger={<button onClick={() => setOpenModal(true)} type="button" className="btn btn-success"><BsSearch></BsSearch></button>} modal>
            {close => <Properties forSelect={"forSelect"} setNomProp={setNomProp} close={close}></Properties>}
          </Popup>
        </div>
        <div>
          <MDBListGroup style={{ minWidth: '50rem' }} className='mt-5' light>
            <div className='container align-items-center justify-content-center pt-3 rounded' style={{ backgroundColor: "black" }} >
              <div className='row align-items-center'>
                <div className='col mx-2'>
                  <p className='fw-bold  text-light'>Cargos</p>
                </div>
                <div className="col ps-4" >
                  <p className='fw-bold text-light'>Descripcion</p>

                </div>
                <div className="col pe-4">
                  <p className='fw-bold text-white '>Precio</p>
                </div>
                <div className='col d-flex align-items-center ps-5'>
                  <p className='fw-bold text-light'>Seleccionar</p>
                </div>
              </div>
            </div>
            {cargos.map((cargo) => (
              <MDBListGroupItem key={cargo.id} className='container align-items-center justify-content-center ' >
                <div className="row ms-1">
                  <div className='col'>
                    <p className='text-dark mb-0'>{cargo.nombre}</p>
                  </div>
                  <div className="col">
                    <p className='text-dark mb-0'>{cargo.descripcion}</p>
                  </div>
                  <div className="col">
                    <NumericFormat
                      value={0}
                      thousandSeparator={true}
                      prefix={'$'}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      onValueChange={(values) => {
                        handlePriceChange(values.value, cargo.id)
                      }}
                      style={{ textAlign: 'right' }}
                    />
                  </div>
                  <div className="d-flex gap-2 col justify-content-center">
                    <input type="checkbox" onChange={() => handleCheckboxChange(cargo.id)} />
                  </div>
                </div>
              </MDBListGroupItem>
            ))}

          </MDBListGroup>
        </div>
        <div>
          <button className='btn btn-success mt-5' onClick={() => { createDetVenta() }} >Registrar Venta</button>
        </div>
      </div>
    </div>
  )
}

export default ABMVentas