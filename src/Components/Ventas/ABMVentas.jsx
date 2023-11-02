import React, { useState, useEffect } from 'react'
import { app } from '../../FireBase/config'
import { updateDoc, doc, collection, getDocs, getFirestore, query, where, addDoc } from 'firebase/firestore';
import Clientes from '../Clientes/Clientes';
import { useNavigate } from "react-router-dom"
import Select from "react-select";
import Form from "react-bootstrap/Form";
import Popup from 'reactjs-popup';
import { BsSearch, BsSlack } from "react-icons/bs";
import Properties from "../Properties/Properties";


const ABMVentas = () => {

  const [openModal, setOpenModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null);
  const [clienteSeleccionado, setclienteSeleccionado] = useState('');
  const [comprobantes, setPropiedad] = useState([])
  const [propiedadesSeleccionados, setPropiedadSeleccionados] = useState([]);
  const [nomProp, setNomProp] = useState()
  const [modalProp, setModalProp] = useState(false)



  const db = getFirestore(app);
  const navigate = useNavigate();
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Añade un 0 al mes si es necesario
  const day = String(today.getDate()).padStart(2, '0'); // Añade un 0 al día si es necesario
  const formattedDate = `${year}-${month}-${day}`;

  const [selectedDate, setSelectedDate] = useState(formattedDate);

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
    setPropiedadSeleccionados([])
  }, [clienteSeleccionado])

  const handleChange = (comprobanteCheq) => {
    if (propiedadesSeleccionados.some(comprobante => comprobanteCheq.id == comprobante.id)) {
      const sacarComprobate = propiedadesSeleccionados.filter(comp => comp.id != comprobanteCheq.id)
      setPropiedadSeleccionados(sacarComprobate)
    }
    else {
      setPropiedadSeleccionados(propiedadesSeleccionados.concat(comprobanteCheq))
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
    console.log("Despues Veo")
  }

  const createPag = () => {
    console.log("Despues Veo")
  }

  return (
    <div className='m-3'>
      <h1 className='text-light mb-4'>Generar Venta</h1>
      <div className='d-flex align-items-center' style={{ color: 'white' }}>
        <div className='d-flex justify-content-center align-items-center'>
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
                    {close=><Properties forSelect={"forSelect"} setNomProp={setNomProp} close={close}></Properties>}
                  </Popup>
        </div>
      </div>
    </div>
  )
}

export default ABMVentas