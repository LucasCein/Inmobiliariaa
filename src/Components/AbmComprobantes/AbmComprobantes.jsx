import { MenuItem, Select } from "@mui/material"
import { addDoc, collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../../FireBase/config";

const AbmComprobantes = (detailData) => {
  console.log(detailData.comprobante)
  const db = getFirestore(app);
  const navigate = useNavigate();
  const [comprobante, setComprobante] = useState({ Fecha: "", Tipo: "", idProv: "", idProp: "", pTotal: "", idDetalle: "" })
  const [proveedores, setProveedores] = useState([])
  const [propiedades, setPropiedades] = useState([])

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
    }
    fetch()
    return () => {
      if (detailData.comprobantes !== '') {
        console.log('aa')
        setComprobante(detailData.comprobante)
      }
    }
  }, [detailData, db])


  const handleChange = (event => {
    const { name, value } = event.target
    if (event.target.value == "") {
      console.log("Completar datos")
    }
    comprobante((comp) => {
      return { ...comp, [name]: value }
    })

  })



  const createDoc = () => {
    const prop = { ...comprobante, visible: true }
    const dbRef = collection(db, "comprobantes");
    addDoc(dbRef, prop).then(() => {
      console.log("Document has been added successfully")
      navigate(0)
    })
      .catch(error => {
        console.log(error)
      })


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
  const optionsType = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' }
  ]
  const handleChangeProv = async (e) => {
    const proveedorCollection = collection(db, 'proveedores');
    const proveedorSnapshot = await getDocs(proveedorCollection);
    const proveedorList = proveedorSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    const proveedor = proveedorList.find(prov => prov.nombre === e.value);
    setComprobante({ ...comprobante, idProv: proveedor.id })

  }



  return (
    <div className='d-flex flex-column align-items-center containerAbm'>
      <h2 className="m-auto">{detailData.comprobante.Fecha != '' ? 'Editar Factura' : 'Agregar Factura'}</h2>
      <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
        <p className='my-0'>Fecha</p>
        <input type="date" name='Fecha' value={comprobante.Fecha} onChange={(handleChange)} />

      </div>
      <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
        <p className='my-0'>Tipo Factura</p>
        <Select
          className='comboCss basic-single select'
          value={comprobante.Tipo}
          onChange={(e) => setComprobante({ ...comprobante, estado: e.target.value })}
          name='tipo'
        >
          {optionsType.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
        <p className='my-0'>Proveedor</p>
        <Select
          className='comboCss2'
          value={comprobante.idProv}
          onChange={(e) => handleChangeProv(e)}
          name='nombreProveedor'
        >
          {proveedores.map((proveedor) => (
            <MenuItem key={proveedor.id} value={proveedor.id}>
              {proveedor.nombre}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
        <p className='my-0'>Propiedad</p>
        <Select
          className='comboCss2'
          value={comprobante.idProp}
          onChange={(e) => setComprobante({ ...comprobante, idProp: e.target.value })}
          name='nombrePropiedad'
        >
          {propiedades.map((propiedad) => (
            <MenuItem key={propiedad.id} value={propiedad.id}>
              {propiedad.nombre}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className='d-flex gap-4 mt-3 '>
        <button className='btn btn-success' onClick={detailData.comprobante?.Fecha != '' ? editDoc : createDoc}>{detailData.comprobante?.Fecha != '' ? 'Editar' : 'Agregar'}</button>
        <button className='btn btn-danger' onClick={() => navigate(0)} >Cancelar</button>
        <button className={detailData.comprobante?.Fecha != '' ? 'btn btn-dark' : 'd-none'} onClick={deleteDoc}>Eliminar</button>
      </div>
    </div>
  )
}

export default AbmComprobantes