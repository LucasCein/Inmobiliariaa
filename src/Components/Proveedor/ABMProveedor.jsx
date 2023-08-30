import { useEffect, useMemo, useState } from 'react'
import { app, storage } from '../../FireBase/config'
import { getDownloadURL, ref, updateMetadata, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const ABMProveedor = () => {
    const [proveedor, setProveedor] = useState({})
    const handleChange = (event => {
        let { name, value, type} = event.target
        setProveedor((proveedor) => {
            return { ...proveedor, [name]: value }
          })

    })
    const navigate = useNavigate();
    const db = getFirestore(app);
    const createDoc = () => {
        console.log("HOla")
        const prov={...proveedor,Activo:true}
        const dbRef = collection(db, "proveedores");
        addDoc(dbRef, prov).then((savedDoc) => {
        console.log("Document has been added successfully")
        alert(`Documento creado: ${savedDoc.id}`)
        navigate(0)
        updateDoc(doc(db, 'proveedores', savedDoc.id), { id: savedDoc.id });
        })
        .catch(error => {
            console.log(error)
        })
    }

  return (
    <div className='d-flex flex-column align-items-center'>
         <h2 className="m-auto">Agregar Proveedor</h2>
        <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
        <p className='my-0'>Nombre</p>
        <input type="text" name='nombre' onChange={handleChange} />
        </div>
        <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
        <p className='my-0'>Descripción</p>
        <input type="text" name='descripcion' onChange={handleChange} />
        </div>
        <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
        <p className='my-0'>Dirección</p>
        <input type="text" name='direccion' onChange={handleChange}  />
        </div>
        <div className='d-flex gap-4 mt-3 '>
          <button className='btn btn-success' onClick={createDoc}>Agregar</button>
          <button className='btn btn-danger'  >Cancelar</button>
        </div>
    </div>
    
  )
}

export default ABMProveedor