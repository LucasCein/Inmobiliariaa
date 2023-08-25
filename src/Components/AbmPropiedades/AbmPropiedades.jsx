import Select from 'react-select'

import './AbmPropiedades.css'
import { useEffect, useMemo, useState } from 'react'
import { app, storage } from '../../FireBase/config'
import { getDownloadURL, ref, updateMetadata, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'


const AbmPropiedades = (detailData) => {
 
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState({ nombre: "", descripcion: "", estado: "", tipo: "", imagen: "", ubicacion: "" })
  useEffect(() => {

    return () => {
      if (detailData.propiedades !== '') {
        console.log('aa')
        setPropiedad(detailData.propiedad)
      }

    }
  }, [detailData])
  console.log(propiedad)
  console.log(propiedad.estado.length)

  const optionsStatus = [
    { value: 'ocupado', label: 'Ocupado' },
    { value: 'disponible', label: 'Disponible' },
  ]
  const optionsType = [
    { value: 'venta', label: 'Venta' },
    { value: 'alquiler', label: 'Alquiler' },
  ]


  const handleChange = (event => {
    const { name, value } = event.target

    setPropiedad((propiedad) => {
      return { ...propiedad, [name]: value }
    })
    console.log(propiedad.name)

  })

  const [image, setImage] = useState('')
  const upload = async () => {
    if (image == null)
      return;
    const imageref = ref(storage, `/image/${image.name}`)
    const uploadImage = await uploadBytes(imageref, image).then(alert('Se ha subido con exito'))
    const newMetadata = {
      cacheControl: 'public,max-age=2629800000',
      contentType: uploadImage.metadata.contentType
    };
    await updateMetadata(imageref, newMetadata);
    const publicImageUrl = await getDownloadURL(imageref)
    setPropiedad({ ...propiedad, imagen: publicImageUrl })
  }
  const db = getFirestore(app);
  const createDoc = () => {
    const prop={...propiedad,visible:true}
    const dbRef = collection(db, "propiedades");
    addDoc(dbRef, prop).then(() => {
      console.log("Document has been added successfully")
      navigate(0)
    })
      .catch(error => {
        console.log(error)
      })


  }
  const editDoc = () => {
    const examcollref = doc(db, 'propiedades', propiedad.id)
    updateDoc(examcollref, propiedad).then(() => {
      alert("Updated")
      navigate(0)
    }).catch(error => {
      console.log(error.message)
    })}

  const deleteDoc=()=>{
    const examcollref = doc(db, 'propiedades', propiedad.id)
    updateDoc(examcollref, {visible:false}).then(() => {
      alert("Deleted")
      navigate(0)
    }).catch(error => {
      console.log(error.message)
    })
  }
  return (
      <div className='d-flex flex-column align-items-center containerAbm'>
        <h2 className="m-auto">{detailData.propiedad.nombre != '' ? 'Editar Propiedad' : 'Agregar Propiedad'}</h2>
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
          <Select className='comboCss basic-single select' options={optionsStatus} defaultValue={(detailData.propiedad.estado != '') ? (detailData.propiedad.estado == 'ocupado') ? optionsStatus[0] : optionsStatus[1] : ""} onChange={(e) => setPropiedad({ ...propiedad, estado: e.value })} name='estado' ></Select>
        </div>
        <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
          <p className='my-0'>Tipo</p>
          <Select className='comboCss2' options={optionsType} defaultValue={(detailData.propiedad.tipo != '') ? (detailData.propiedad.tipo == 'venta') ? optionsType[0] : optionsType[1] : ""} onChange={(e) => setPropiedad({ ...propiedad, tipo: e.value })} ></Select>
        </div>
        <div className='d-flex mt-3 gap-5 align-items-center  my-3 imageAttachment'>
          <p className='my-0'>Imagen</p>
          <input type="file" name="" id="" className='' accept="image/*" onChange={(e) => { setImage(e.target.files[0]) }} />
        </div>
        <button onClick={upload} className='btn btn-success'>Subir</button>
        <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
          <p className=' my-0'>Ubicacion</p>
          <input type="text" value={propiedad.ubicacion} name='ubicacion' onChange={handleChange} />
        </div>
        <div className='d-flex gap-4 mt-3 '>
          <button className='btn btn-success' onClick={detailData.propiedad.nombre != ''?editDoc:createDoc}>{detailData.propiedad.nombre != '' ? 'Editar' : 'Agregar'}</button>
          <button className='btn btn-danger' onClick={() => navigate(0)} >Cancelar</button>
          <button className={detailData.propiedad.nombre != ''? 'btn btn-dark':'d-none'} onClick={deleteDoc}>Eliminar</button>
        </div>
      </div>
    )
  }

  export default AbmPropiedades