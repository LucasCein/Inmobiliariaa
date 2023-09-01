import { useEffect, useMemo, useState } from 'react'
import { app, storage } from '../../FireBase/config'
import { getDownloadURL, ref, updateMetadata, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const ABMProveedor = (detailData) => {
    const [proveedor, setProveedor] = useState({})

    const db = getFirestore(app);
    const navigate = useNavigate();
    let empty={
      value:0
    }
    const handleChange = (event => {
      let { name, value, type} = event.target
      if(value == ""){
       empty={
        value:1,
        nombre:name}
      }
      else{
        empty={
          value:0
        }
        setProveedor((proveedor) => {
          return { ...proveedor, [name]: value }
        })
      }
    })

    const editDoc = () => {
      if (empty.value == 0){
      const examcollref = doc(db, 'proveedores', detailData.proveedor.id)
      updateDoc(examcollref, proveedor).then(() => {
        alert("Updated")
        navigate(0)
      }).catch(error => {
        console.log(error.message)
      })
      }
      else{
        alert("Completar datos de "+empty.nombre)
      }
    }

    const createDoc = () => {
        const prov={...proveedor,Activo:true}
        const dbRef = collection(db, "proveedores");
        addDoc(dbRef, prov).then((savedDoc) => {
        console.log("Document has been added successfully")
        alert(`Documento creado`)
        navigate(0)
        updateDoc(doc(db, 'proveedores', savedDoc.id), { id: savedDoc.id });
        })
        .catch(error => {
            console.log(error)
        })
      }
    

  return (
    <div className='d-flex flex-column align-items-center'>
         <h2 className="m-auto">{detailData.proveedor.nombre !== ""? "Editar":"Agregar" } Proveedor</h2>
         <form name="form">
        <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
        <p className='my-0'>Nombre</p>
        <input required type="text" name='nombre' onChange={handleChange} defaultValue={detailData.proveedor.nombre} required />
        </div>
        <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
        <p className='my-0'>Descripción</p>
        <input type="text" name='descripcion' onChange={handleChange} defaultValue={detailData.proveedor.descripcion} />
        </div>
        <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
        <p className='my-0'>Dirección</p>
        <input type="text" name='direccion' onChange={handleChange} defaultValue={detailData.proveedor.direccion} />
        </div>
        </form>
        <div className='d-flex gap-4 mt-3 '>
          <button className='btn btn-success' onClick={detailData.proveedor.nombre != ''?editDoc:createDoc}>{detailData.proveedor.nombre != '' ? 'Editar' : 'Agregar'}</button>
          <button className='btn btn-danger' onClick={() => navigate(0)}>Cancelar</button>
        </div>
    </div>
    
  )
}

export default ABMProveedor