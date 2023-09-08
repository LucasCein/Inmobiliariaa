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
        if([name] == "CUIT"){
          const formattedNumber = `${value.slice(0, 2)}-${value.slice(2, 10)}-${value.slice(10, 11)}`;
          setProveedor((proveedor) => {
            return { ...proveedor, CUIT: formattedNumber }
          })
        }
        else{
          setProveedor((proveedor) => {
            return { ...proveedor, [name]: value }
          })
        }
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
         <div className="container mt-3">
         <form name="form">
         <div className="row">
                <div className="col-md-6 mb-3">
                    <label  className="form-label">Nombre:</label>
                    <input type="text" className="form-control" defaultValue={detailData.proveedor.nombre} name="nombre" onChange={handleChange}></input>
                </div>
                <div className="col-md-6 mb-3">
                    <label  className="form-label">Descripción:</label>
                    <input defaultValue={detailData.proveedor.descripcion} type="text" className="form-control" id="descripcion" name="descripcion" onChange={handleChange}></input>
                </div>
                <div className="col-md-6 mb-3">
                    <label  className="form-label">Telefono:</label>
                    <input defaultValue={detailData.proveedor.telefono} type="text" className="form-control" name="telefono" onChange={handleChange}></input>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Email:</label>
                    <input defaultValue={detailData.proveedor.email} type="email" className="form-control" name="email" onChange={handleChange}></input>
                </div>
                <div className="col mb-3">
                    <label className="form-label">CUIT:</label>
                    <input defaultValue={detailData.proveedor.CUIT} type="number" className="form-control" name="CUIT" placeholder='Solo números' onChange={handleChange}></input>
                </div>
            </div>
        </form>
        </div>
        <div className='d-flex gap-4 mt-2 mb-2 '>
          <button className='btn btn-success' onClick={detailData.proveedor.nombre != ''?editDoc:createDoc}>{detailData.proveedor.nombre != '' ? 'Editar' : 'Agregar'}</button>
          <button className='btn btn-danger' onClick={() => navigate(0)}>Cancelar</button>
        </div>
    </div>
    
  )
}

export default ABMProveedor