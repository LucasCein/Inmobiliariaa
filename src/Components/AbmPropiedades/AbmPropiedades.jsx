import Select from 'react-select'

import './AbmPropiedades.css'
import { useState } from 'react'
import { app, storage } from '../../FireBase/config'
import { getDownloadURL, ref, updateMetadata, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'


const AbmPropiedades = (detailData) => {

  const navigate = useNavigate();
  const optionsStatus = [
    { value: 'ocupado', label: 'Ocupado' },
    { value: 'disponible', label: 'Disponible' },
  ]
  const optionsType = [
    { value: 'venta', label: 'Venta' },
    { value: 'alquiler', label: 'Alquiler' },
  ]
  const [propiedad, setPropiedad] = useState({ nombre: "", descripcion: "", estado: "", tipo: "", imagen: "", ubicacion: "" })
  if(detailData==!''){
    setPropiedad(detailData)
  }
  const handleChange = (event => {
    const { name, value } = event.target

    setPropiedad((propiedad) => {
      console.log(propiedad)
      return { ...propiedad, [name]: value }
    })
    console.log(propiedad.name)
    
  })

  const [image, setImage] = useState('')
  const upload = async () => {
    if (image == null)
      return;
    const imageref = ref(storage, `/image/${image.name}`)
    const uploadImage=await uploadBytes(imageref, image);
    const newMetadata = {
      cacheControl: 'public,max-age=2629800000', // 1 month
      contentType: uploadImage.metadata.contentType
    };
    await updateMetadata(imageref, newMetadata);
    const publicImageUrl = await getDownloadURL(imageref)
    setPropiedad({ ...propiedad, imagen: publicImageUrl })
  }
  const createDoc = () => {

    const db = getFirestore(app);
    const dbRef = collection(db, "propiedades");
    addDoc(dbRef, propiedad).then(docRef => {
      console.log("Document has been added successfully")
      navigate(0)
    })
      .catch(error => {
        console.log(error)
      })
    
      
  }
  return (
    <div className='d-flex flex-column align-items-center containerAbm'>
      <h2 className="m-auto">Agregar Propiedad</h2>
      <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
        <p className='my-0'>Nombre</p>
        <input type="text" name='nombre' value={propiedad.nombre} onChange={handleChange} />
      </div>
      <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
        <p className='my-0'>Descripcion</p>
        <input type="text" name='descripcion' value={propiedad.descripcion} onChange={handleChange} />
      </div>
      <div className='d-flex mt-3 gap-5 align-items-center my-3'>
        <p className='my-0'>Estado</p>
        <Select className='comboCss basic-single select' options={optionsStatus} onChange={(e) => setPropiedad({ ...propiedad, estado: e.value })} name='estado' ></Select>
      </div>
      <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
        <p className='my-0'>Tipo</p>
        <Select className='comboCss2' options={optionsType} onChange={(e) => setPropiedad({ ...propiedad, tipo: e.value })} ></Select>
      </div>
      <div className='d-flex mt-3 gap-5 align-items-center  my-3 imageAttachment'>
        <p className='my-0'>Imagen</p>
        <input type="file" name="" id="" className='' onChange={(e) => { setImage(e.target.files[0]) }} />
      </div>
      <button onClick={upload} className='btn btn-success'>Subir</button>
      <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
        <p className=' my-0'>Ubicacion</p>
        <input type="text" value={propiedad.ubicacion} name='ubicacion' onChange={handleChange} />
      </div>
      <div className='d-flex gap-4 mt-3 '>
        <button className='btn btn-success' onClick={createDoc}>Agregar</button>
        <button className='btn btn-danger' onClick={()=>navigate(0)} >Cancelar</button>
      </div>
    </div>
  )
}

export default AbmPropiedades