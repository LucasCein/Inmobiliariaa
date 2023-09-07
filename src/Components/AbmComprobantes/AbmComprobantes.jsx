import { Autocomplete, TextField } from "@mui/material"
import { Firestore, Timestamp, addDoc, collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../../FireBase/config";
import "@reach/combobox/styles.css";
import Popup from "reactjs-popup";
import { MDBListGroup } from "mdb-react-ui-kit";
import DetalleComp from "../DetalleComp/DetalleComp";
import AbmProds from "../AbmProds/AbmProds";
const AbmComprobantes = (detailData) => {
  const db = getFirestore(app);
  const navigate = useNavigate();
  const [comprobante, setComprobante] = useState({ Fecha: "", Tipo: "", idProv: "", idProp: "", pTotal: "", idDetalle: "", nombrePropiedad: "", nombreProveedor: "", originalDate: "", idDetalle: "" })
  const [proveedores, setProveedores] = useState([])
  const [propiedades, setPropiedades] = useState([])
  const [prods, setProds] = useState([])
  const [orginialDate, setOriginalDate] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [editDate, setEditDate] = useState([])
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const fetch = async () => {

      const proveedorCollection = collection(db, 'proveedores');
      const proveedorSnapshot = await getDocs(proveedorCollection);
      const proveedorList = proveedorSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProveedores(proveedorList)
      const propiedadCollection = collection(db, 'propiedades');
      const propiedadSnapshot = await getDocs(propiedadCollection);
      const propiedadList = propiedadSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPropiedades(propiedadList)
      const prodsCollection = collection(db, 'productos');
      const prodsSnapshot = await getDocs(prodsCollection);
      const prodsList = prodsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProds(prodsList)
    }
    fetch()
    return () => {
      if (detailData.detailData !== '') {
        console.log('aa')
        setComprobante(detailData.detailData)
        // const part=detailData.detailData.Fecha.split("/")
        // const dateF=part[2]+"-"+part[1]+"-"+part[0]
        // const dateFormatted=new Date(dateF)
        // setEditDate(dateF)
      }
    }
  }, [detailData, db])
  console.log(editDate)
  const handleChangeTipo = (prop => {
    if (prop.value == "") {
      console.log("Completar datos")
    }
    setComprobante({ ...comprobante, Tipo: prop.value })

  })
  console.log(comprobante)
  const renderPageOne = () => {
    return (

      <div>
        <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
          <p className='my-0'>Fecha</p>
          <input type="date" name='Fecha' defaultValue={""} value={orginialDate} onChange={handleChangeFecha} />

        </div>
        <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
          <p className='my-0'>Tipo</p>
          <Autocomplete
            disablePortal={true}
            defaultValue={""}
            value={comprobante?.Tipo === 'a' ? optionsType[0] : comprobante?.Tipo === 'b' ? optionsType[1] : optionsType[2]}
            onChange={(event, newValue) => handleChangeTipo(newValue)}
            options={optionsType}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField {...params} sx={{ width: 200 }} />}
          />

        </div>
        <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
          <p className='my-0'>Proveedor</p>
          <Autocomplete
            defaultValue={""}
            disablePortal={true}
            value={proveedores.nombre}
            onChange={(event, newValue) => handleChangeProv(newValue)}
            options={proveedores}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => <TextField {...params} sx={{ width: 200 }} />}
          />
        </div>
        <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
          <p className='my-0'>Propiedad</p>
          <Autocomplete
            defaultValue={""}
            disablePortal={true}
            value={propiedades.nombre}
            onChange={(event, newValue) => handleChangeProp(newValue)}
            options={propiedades}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => <TextField {...params} sx={{ width: 200 }} />}
          />
        </div>
        <div className='d-flex flex-column align-items-center'>
          <button className='btn btn-link' onClick={() => handleChangePage(2)} >Siguiente</button>
        </div>
      </div>
    )
  }

  const renderPageTwo = () => {
    return (

      <div>
        <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
          <p className='my-0'>Producto</p>
          <Autocomplete
            disablePortal={true}
            defaultValue={""}
            value={productoSeleccionado}
            onChange={(event, newValue) => handleChangeProducto(newValue)}
            options={prods}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => <TextField {...params} sx={{ width: 200 }} />}
          />
        </div>

        <MDBListGroup style={{ minWidth: '22rem' }} light>
          <DetalleComp productos={productos} />
        </MDBListGroup>
        <div className="ms-3">
          <p className='fw-bold mb-1'>Precio Total</p>
          <p className='text-muted mb-0'>${precioF}</p>
        </div>
        <div className='d-flex flex-column align-items-center'>
          <button className='btn btn-link' onClick={() => handleChangePage(1)} >Atrás</button>
        </div>
        <div className='d-flex gap-4 mt-3 '>
          <button className='btn btn-success' onClick={createDetComp}>Agregar</button>
          <button className='btn btn-danger' onClick={() => navigate(0)} >Cancelar</button>
          <button className={detailData.detailData?.Fecha != '' ? 'btn btn-dark' : 'd-none'} onClick={deleteDoc}>Eliminar</button>
        </div>

      </div>
    )
  }




  const editDoc = () => {
    const examcollref = doc(db, 'comprobantes', comprobante.id)
    updateDoc(examcollref, comprobante).then(() => {
      alert("Updated")
      navigate(0)
    }).catch(error => {
      console.log(error.message)
    })
  }

  const deleteDoc = () => {
    const examcollref = doc(db, 'comprobantes', comprobante.id)
    updateDoc(examcollref, { visible: false }).then(() => {
      alert("Deleted")
      navigate(0)
    }).catch(error => {
      console.log(error.message)
    })
  }

  const createDetComp = () => {
    const prop = { productos }
    const dbRef = collection(db, "detalleComprobante");
    addDoc(dbRef, prop).then((docRef) => {
      console.log("detalle has been added successfully")
      setComprobante({ ...comprobante, idDetalle: docRef.id })
      createDoc(docRef)
    })
  }

  const createDoc = (idDet) => {
    const prop = { ...comprobante, visible: true, idDetalle: idDet, pTotal: precioF }
    const dbRef = collection(db, "comprobantes");
    addDoc(dbRef, prop).then(() => {
      console.log("Document has been added successfully")
      navigate(0)
    })
      .catch(error => {
        console.log(error)
      })
  }
  const optionsType = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' }
  ]
  const handleChangeProv = async (e) => {
    console.log(e)
    setComprobante({ ...comprobante, idProv: e.id })
  }
  const handleChangeProp = async (e) => {
    console.log(e)
    setComprobante({ ...comprobante, idProp: e.id })
  }

  const handleChangeFecha = async (e) => {
    const partes = e.target.value.split("-");

    const fechaComoTimestamp = Timestamp.fromDate(new Date(partes[0], partes[1], partes[2]));

    setComprobante({ ...comprobante, Fecha: fechaComoTimestamp });
    setOriginalDate(e.target.value)

  }
  const [productos, setProductos] = useState([])
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [precioF, setprecioF] = useState(0)
  const handleChangeProducto = (producto) => {
    if (!productos.includes(producto)) {
      setprecioF(precioF + producto.precio)
      setProductoSeleccionado(producto);
      setProductos([...productos, producto]);

    }
  };

  console.log(orginialDate)
  return (

    <div className='d-flex flex-column align-items-center containerAbm'>
      <h2 className="m-auto">{detailData.detailData?.Fecha != '' ? 'Editar Factura' : 'Agregar Factura'}</h2>
      {currentPage === 1 ? renderPageOne() : renderPageTwo()}
    </div>

  )
}

export default AbmComprobantes