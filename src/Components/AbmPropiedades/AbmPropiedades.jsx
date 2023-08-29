import Select from 'react-select'

import './AbmPropiedades.css'
import { useEffect, useMemo, useState } from 'react'
import { app, storage } from '../../FireBase/config'
import { getDownloadURL, ref, updateMetadata, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'


const AbmPropiedades = (detailData) => {
  const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la página actual

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const renderPageOne = () => (
    <div>
      {/* Renderiza la primera mitad de los elementos aquí */}
      <div className='d-flex mt-3 gap-5 align-items-center   my-3'>
          <p className='my-0'>Nombre</p>
          <input type="text" name='nombre' value={propiedad.nombre} onChange={(handleChange)} />
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
        <button onClick={upload} className='btn btn-success'>Subir</button>
        </div>
        <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
          <p className=' my-0'>Ubicacion</p>
          <input type="text" value={propiedad.ubicacion} name='ubicacion' onChange={handleChange} />
        </div>
        <div className='d-flex flex-column align-items-center'>
          <button className='btn btn-link' onClick={() => handleChangePage(2)} >Siguiente</button>
        </div>
    </div>
  );

  const renderPageTwo = () => (
    <div>
      {/* Renderiza la segunda mitad de los elementos aquí */}
      <div className='d-flex flex-column align-items-center containerAbm'>
        <div className='d-flex mt-3 gap-2 align-items-center  my-3'>
          <p className='my-0'>Baños:</p>
          {/* <input type="text" name='cantBaños' value={propiedad.cantBaños} onChange={handleChange} /> */}
          <Select className='comboCss2' options={roomQty} defaultValue={(detailData.propiedad.cantBaños != '') ? detailData.propiedad.cantBaños : ""} onChange={(e) => setPropiedad({ ...propiedad, cantBaños: e.value })} ></Select>
        </div>
        <div className='d-flex mt-3 align-items-center  my-3'>
          <p className='my-0'>Cuartos:</p>
          <Select className='comboCss2' options={roomQty} defaultValue={(detailData.propiedad.cantCuarto != '') ? detailData.propiedad.cantCuarto : ""} onChange={(e) => setPropiedad({ ...propiedad, cantCuarto: e.value })} ></Select>
        </div>
        <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
          <p className=' my-0'>Area cubierta</p>
          <input type="text" value={propiedad.area} name='area' onChange={handleChange} /> m2
        </div>
        <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
          <p className='my-0'>WiFi:</p>
          <input name='wifi' type='checkbox' checked={propiedad.wifi} onChange={handleChange}/>
          <p className='my-0'>Aire Acondicionado:</p>
          <input name='aire' type='checkbox' checked={propiedad.aire} onChange={handleChange}/>
          <p className='my-0'>Estacionamiento:</p>
          <input name='estacionamiento' type='checkbox' checked={propiedad.estacionamiento} onChange={handleChange}/>
          <p className='my-0'>Lavarropas:</p>
          <input name='lavarropa' type='checkbox' checked={propiedad.lavarropa} onChange={handleChange}/>
        </div>
        <div className='d-flex flex-column align-items-center'>
          <button className='btn btn-link' onClick={() => handleChangePage(1)} >Atrás</button>
        </div>
        <div className='d-flex gap-4 mt-3 '>
          <button className='btn btn-success' onClick={detailData.propiedad.nombre != ''?editDoc:createDoc}>{detailData.propiedad.nombre != '' ? 'Editar' : 'Agregar'}</button>
          <button className='btn btn-danger' onClick={() => navigate(0)} >Cancelar</button>
          <button className={detailData.propiedad.nombre != ''? 'btn btn-dark':'d-none'} onClick={deleteDoc}>Eliminar</button>
        </div>
      </div>
    </div>
  );
 
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState({})

  useEffect(() => {

    setPropiedad({ nombre: "", descripcion: "", estado: "", tipo: "", imagen: "", ubicacion: "" , cantBaños :"", cantCuarto: "", wifi:false, aire: false, estacionamiento:false, lavarropa:false, area: 0 })

    return () => {


      if (detailData.propiedades !== '') {
        console.log('aa')
        setPropiedad(detailData.propiedad)
      }

    }
  }, [detailData])


  const optionsStatus = [
    { value: 'ocupado', label: 'Ocupado' },
    { value: 'disponible', label: 'Disponible' },
  ]
  const optionsType = [
    { value: 'venta', label: 'Venta' },
    { value: 'alquiler', label: 'Alquiler' },
  ]
  const roomQty = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
  ]


  const handleChange = (event => {
    let { name, value, type} = event.target
    console.dir(event.target)
    if(value == ""){
      console.log("Completar datos")
    }

    if (type === 'checkbox'){
      value  = event.target.checked
    }
    
    setPropiedad((propiedad) => {
      return { ...propiedad, [name]: value }
    })
    
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
    addDoc(dbRef, prop).then((savedDoc) => {
      console.log("Document has been added successfully")
      alert(`Documento creado: ${savedDoc.id}`)
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
        {currentPage === 1 ? renderPageOne() : renderPageTwo()}
      </div>
    )
  }

  export default AbmPropiedades