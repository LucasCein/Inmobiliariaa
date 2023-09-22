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
import './abmcomprobantes.css'
const AbmComprobantes = () => {
  const db = getFirestore(app);
  const navigate = useNavigate();
  const [comprobante, setComprobante] = useState({ Fecha: "",numSuc:"", Tipo: "", idProv: "", idProp: "", pTotal: "", idDetalle: "", nombrePropiedad: "", nombreProveedor: ""})
  const [proveedores, setProveedores] = useState([])
  const [propiedades, setPropiedades] = useState([])
  const [prods, setProds] = useState([])
  const [orginialDate, setOriginalDate] = useState([])

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

  }, [db])

  const handleChangeTipo = (prop => {
    if (prop.value == "") {
      console.log("Completar datos")
    }
    setComprobante({ ...comprobante, Tipo: prop.value })

  })


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
    const prop = {productos}
    const dbRef = collection(db, "detalleComprobante");
    addDoc(dbRef, prop).then((docRef) => {
      console.log("detalle has been added successfully")
      setComprobante({ ...comprobante, idDetalle: docRef.id })
      createDoc(docRef)
    })
  }

  const createDoc = (idDet) => {
    const prop = { ...comprobante, visible: true, idDetalle: idDet, pTotal: precioF, pagada: false }
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
      setComprobante({...comprobante,pTotal:comprobante.pTotal+precioF})
    }
    const elemento = document.getElementById("elemento");
    elemento.blur();
    setProductoSeleccionado("");

  };
  const handleChangeSuc=(e)=>{
    setComprobante({...comprobante,numSuc:e.target.value})
  }

  const handleDeleteProduct = (idProduct) => {
    console.log(idProduct);
    console.log(productos);

    const newProducts = [...productos];
    const indiceObjetoModificar = newProducts.findIndex(
      (product) => product.id === idProduct
    );
    const newPrice = precioF - productos[indiceObjetoModificar].precio;
    newProducts.splice(indiceObjetoModificar, 1);
    setProductos(newProducts);

    setprecioF(newPrice);
  };

  const handlePriceChange = (idProduct, newPrice) => {
    
    console.log("entro", idProduct);

    const newProducts = [...productos];
    const indiceObjetoModificar = newProducts.findIndex(
      (product) => product.id === idProduct
    );
    newProducts[indiceObjetoModificar].precio = newPrice;
    
    setProductos(newProducts);
    
    console.log("newProducts",newProducts)
    
    const newFinalPrice = newProducts.reduce((acc, product) => parseInt(acc) + parseInt(product.precio), 0);
    
    console.log("newFinalPrice",newFinalPrice)
    
    setprecioF(newFinalPrice)
  }


  console.log(orginialDate)
  return (

    <div className='containerAbm'>
      <h2 className="m-auto TitleGrid">Comprobantes</h2>
      <div className="gridCol1">

        <p className='my-0 dateTitle'>Fecha</p>
        <input className="dateInp" type="date" name='Fecha' defaultValue={""} value={orginialDate} onChange={handleChangeFecha} />
        <p className="my-0 numSucTitle">N° Sucursal</p>
        <input className=" numSucInp" type="number" value={comprobante.numSuc} onChange={handleChangeSuc} />
        <p className='my-0 typeTitle'>Tipo</p>
        <Autocomplete
          className="typeInp"
          disablePortal={true}
          defaultValue={""}
          value={comprobante?.Tipo === 'a' ? optionsType[0] : comprobante?.Tipo === 'b' ? optionsType[1] : optionsType[2]}
          onChange={(event, newValue) => handleChangeTipo(newValue)}
          options={optionsType}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} sx={{ width: 200 }} />}
        />

          <p className='my-0 provTitle'>Proveedor</p>
          <Autocomplete
          className="provInp"
            defaultValue={""}
            disablePortal={true}
            value={proveedores.nombre}
            onChange={(event, newValue) => handleChangeProv(newValue)}
            options={proveedores}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => <TextField {...params} sx={{ width: 200 }} />}
          />

       
          <p className='my-0 propTitle'>Propiedad</p>
          <Autocomplete
          className="propInp"
            defaultValue={""}
            disablePortal={true}
            value={propiedades.nombre}
            onChange={(event, newValue) => handleChangeProp(newValue)}
            options={propiedades}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => <TextField {...params} sx={{ width: 200 }} />}
          />
      
      </div>
      <div className="gridCol2">
        <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
          <p className='my-0'>Producto</p>
          <Autocomplete
            id="elemento"
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
          <DetalleComp productos={productos} handleDeleteProduct={handleDeleteProduct} handlePriceChange={handlePriceChange} />
        </MDBListGroup>
        <div className="ms-3">
          <p className='fw-bold mb-1'>Precio Total</p>
          <p className='text-muted mb-0'>${precioF}</p>
        </div>
        <div className='d-flex justify-content-center gap-4 mt-3 '>
          <button className='btn btn-success' onClick={createDetComp}>Agregar</button>
          <button className='btn btn-danger' onClick={() => navigate(0)} >Cancelar</button>
        </div>
      </div>
    </div>

  )
}

export default AbmComprobantes