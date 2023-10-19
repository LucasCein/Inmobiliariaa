
import React,{useState,useEffect} from 'react'
import { app } from '../../FireBase/config'
import { updateDoc,doc,collection, getDocs, getFirestore, query, where,addDoc } from 'firebase/firestore';
import Select from "react-select";
import { MDBListGroup, MDBListGroupItem, MDBCheckbox } from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom"
import Form from "react-bootstrap/Form";
import Popup from 'reactjs-popup';
import { BsSearch } from "react-icons/bs";
import Proveedor from "../Proveedor/Proveedor";





const ABMPagos = (detailData) => {
  const [openModal, setOpenModal] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null);
    const [proveedores, setProveedores] = useState([])
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
    const [comprobantes, setComprobantes] = useState([])
    const [comprobantesSeleccionados, setComprobantesSeleccionados] = useState([]);
    
    
    const db = getFirestore(app);
    const navigate = useNavigate();
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Añade un 0 al mes si es necesario
    const day = String(today.getDate()).padStart(2, '0'); // Añade un 0 al día si es necesario
    const formattedDate = `${year}-${month}-${day}`;

    const [selectedDate, setSelectedDate] = useState(formattedDate);

    useEffect(()=>{
      const fetchComprobantes = async () =>{
        const dbFirestore = getFirestore()
        const queryCollection = collection(dbFirestore, 'comprobantes')
        const queryCollectionFiltered = query(queryCollection,where('visible','==',true),where('pagada','==', false))
        const res= await getDocs(queryCollectionFiltered)
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
        fetchComprobantes()
        setComprobantesSeleccionados([])
    },[proveedorSeleccionado])

    const handleChange =(comprobanteCheq)=>{
     if(comprobantesSeleccionados.some(comprobante=> comprobanteCheq.id == comprobante.id)){
      const sacarComprobate=comprobantesSeleccionados.filter(comp=>comp.id != comprobanteCheq.id)
      setComprobantesSeleccionados(sacarComprobate)
     }
     else{
      setComprobantesSeleccionados(comprobantesSeleccionados.concat(comprobanteCheq))
     }
    }

    const method_Pay=[
      {label:"Efectivo", value:"Efectivo"},
      {label : "Transferencia", value:"Transferencia"},
      { value: 'Tarjeta', label: 'Tarjeta' }
  ]

  const handleChangePay = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const createDetPag = () => {
    const idComp=(comprobantesSeleccionados.map(com=>com.id))
    const dbRef = collection(db, "detallePagoFacturas");
    addDoc(dbRef, {idComp}).then((docRef) => {
      (comprobantesSeleccionados.map(com=>{
        const examcollref = doc(db, 'comprobantes',com.id)
        updateDoc(examcollref, {pagada:true})
      }))
      console.log("detalle has been added successfully")
      createPag(docRef)
    })
  }

  const createPag = (idDet) => {
    const pago={
      fecha: selectedDate,
      metodo: selectedOption.value,
      proveedor : proveedorSeleccionado.id,
      monto: comprobantesSeleccionados.reduce((acc,com) =>{return acc+com.pTotal},0)
    }
    const prop = { ...pago, visible: true, idDetalle: idDet.id}
    console.log(prop)
    const dbRef = collection(db, "pagoFacturas");
    addDoc(dbRef, prop).then(() => {
      console.log("Document has been added successfully")
      navigate(0)
    })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div className='m-3'>
      <h1>Generar Pago</h1>
      <div className='d-flex align-items-center' style={{color:'white'}}>
      <div className='d-flex justify-content-center align-items-center'>
              <p className='m-1'>Forma de pago:</p>
                <Select
                className="w-50 px-2"
                value={selectedOption}
                onChange={handleChangePay}
                options={method_Pay}
                ></Select>
                <p className='m-1'>Fecha de Pago:</p>
                <input className=" w-50 dateInp" type="date" name='Fecha' value={selectedDate} onChange={handleDateChange} />
                <p className='m-2'>Proveedor:</p>
                
                <Form.Control
                    className="w-10  px-2"
                    placeholder="Nombre Proveedor"
                    value={proveedorSeleccionado?.nomProv}
                    disabled
                    readOnly
                  />
                  <Popup open={openModal} className='popPupCompb' trigger={<button onClick={() => setOpenModal(true)} type="button" className="btn btn-success"><BsSearch></BsSearch></button>} modal>
                    {close => <Proveedor forSelect={"forSelect"} setNomProv={setProveedorSeleccionado} close={close}></Proveedor>}
                  </Popup>
  
                  </div>
            </div>

          <div className='mt-2'>
          {comprobantes.map((comprobante) => (
          <MDBListGroupItem key={comprobante.id}>
                <div className='row d-flex justify-content-center'>
                        <div className='col'>
                            <p className='fw-bold mb-1'>Tipo</p>
                            <p className='text-muted mb-0'>{comprobante.Tipo}</p>
                        </div>
                        <div className="col" >
                            <p className='fw-bold mb-1'>Fecha</p>
                            <p className='text-muted mb-0'>{comprobante.Fecha}</p>
                        </div>
                        <div className="col">
                            <p className='fw-bold mb-1'>Monto</p>
                            <p className='text-muted mb-0'>${comprobante.pTotal}</p>
                        </div>
                        <div className="col">
                            <p className='fw-bold mb-1'>Nombre</p>
                            <p className='text-muted mb-0'>{comprobante.nombrePropiedad}</p>
                        </div>
                       
                          <div className='col justify-content-end align-items-end mt-3'>
                              <MDBCheckbox onChange={()=>handleChange(comprobante)}/>
                          </div>
                    
            </div>
          </MDBListGroupItem>
        ))}
      
          </div>
        
            {comprobantesSeleccionados.length>0?
            <div>
            <div className='d-flex align-items-start justify-content-between m-1'>
              <h3 >Total: ${comprobantesSeleccionados.reduce((acc,com) =>{return acc+com.pTotal},0)}</h3>
              </div>
                <div className='d-flex align-items-center justify-content-center pt-3'>
                  <button className='btn btn-success' onClick={createDetPag}>{detailData.length > 0? 'Actualizar':'Pagar'}</button>
                </div>
           </div>
            :''}
        

    </div>
  )
}

export default ABMPagos