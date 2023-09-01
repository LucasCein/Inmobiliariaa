import Select from 'react-select'

import './AbmPropiedades.css'
import { useEffect, useMemo, useState } from 'react'
import { app, storage } from '../../FireBase/config'
import { getDownloadURL, ref, updateMetadata, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'


const AbmPropiedades = (detailData) => {
  const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la página actual
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState({})

  useEffect(() => {


    return () => {


      if (detailData.propiedades !== '') {
        
        setPropiedad(detailData.propiedad)
        
      }
      else{
        setPropiedad({id: "",nombre: "", estado: "", descripcion:"", imagen:"" , tipo:"", ciudad:"", barrio:"", calle:"", altura:"", cp:"", piso:"", depto:"", cantBaños:"", cantCuarto:"", wifi:false, aire:false, estacionamiento:false, lavarropa:false, area:"0"})

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

    console.log(propiedad)
    
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
    console.log("nombre: ", propiedad.nombre)
    if (propiedad.nombre != ""){
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
    else{
      alert("Se debe ingresar un nombre de propiedad")
    }


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
          <Select className='comboCss basic-single select' options={optionsStatus} defaultValue={(propiedad.estado != '') ? (propiedad.estado == 'ocupado') ? optionsStatus[0] : optionsStatus[1] : ""} onChange={(e) => setPropiedad({ ...propiedad, estado: e.value })} name='estado' ></Select>
        </div>
        <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
          <p className='my-0'>Tipo</p>
          <Select className='comboCss2' options={optionsType} defaultValue={(propiedad.tipo != '') ? (propiedad.tipo == 'venta') ? optionsType[0] : optionsType[1] : ""} onChange={(e) => setPropiedad({ ...propiedad, tipo: e.value })} ></Select>
        </div>
        <div className='d-flex mt-3 gap-5 align-items-center  my-3 imageAttachment'>
          <p className='my-0'>Imagen</p>
          <input type="file" name="" id="" className='' accept="image/*" onChange={(e) => { setImage(e.target.files[0]) }} />
        <button onClick={upload} className='btn btn-success'>Subir</button>
        </div>
        <div className='d-flex flex-column align-items-center'>
          <button className='btn btn-link' onClick={() => handleChangePage(2)} >Siguiente</button>
        </div>
    </div>
  );

  const renderPageTwo = () => (
    <div>
      {/* Renderiza la primera mitad de los elementos aquí */}
        <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
          <p className=' my-0'>Ciudad</p>
          <input type="text" value={propiedad.ciudad} name='ciudad' onChange={handleChange} />
        </div>
        <div className='d-flex mt-3 gap-5 align-items-center  my-3'>
          <p className=' my-0'>CP</p>
          <input type="text" value={propiedad.cp} name='cp' onChange={handleChange} />
        </div>
        <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
          <p className=' my-0'>Barrio</p>
          <input type="text" value={propiedad.barrio} name='barrio' onChange={handleChange} />
        </div>
        <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
          <p className=' my-0'>Calle</p>
          <input type="text" value={propiedad.calle} name='calle' onChange={handleChange} />
        </div>
        <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
          <p className=' my-0'>Altura</p>
          <input type="text" value={propiedad.altura} name='altura' onChange={handleChange} />
        </div>
        <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
          <p className=' my-0'>Piso</p>
          <input type="text" value={propiedad.piso} name='piso' onChange={handleChange} />
        </div>
        <div className='d-flex mt-3 gap-4 align-items-center  my-3'>
          <p className=' my-0'>Dpto.</p>
          <input type="text" value={propiedad.dpto} name='dpto' onChange={handleChange} />
        </div>
        <div className='d-flex flex-row align-items-center'>
          <button className='btn btn-link' onClick={() => handleChangePage(1)} >Atrás</button>
          <button className='btn btn-link' onClick={() => handleChangePage(3)} >Siguiente</button>
        </div>
    </div>
  );

  const renderPageThree = () => (
    <div>
      {/* Renderiza la segunda mitad de los elementos aquí */}
      <div className='d-flex flex-column align-items-center containerAbm'>
        <div className='d-flex mt-3 gap-2 align-items-center  my-3'>
          <p className='my-0'>Baños:</p>
          {/* <input type="text" name='cantBaños' value={propiedad.cantBaños} onChange={handleChange} /> */}
          <Select className='comboCss2' options={roomQty} defaultValue={(propiedad.cantBaños != "") ? roomQty.find(opcion => opcion.label === propiedad.cantBaños) : ""} onChange={(e) => setPropiedad({ ...propiedad, cantBaños: e.value })} ></Select>
        </div>
        <div className='d-flex mt-3 align-items-center  my-3'>
          <p className='my-0'>Cuartos:</p>
          <Select className='comboCss2' options={roomQty} defaultValue={(propiedad.cantCuarto != "") ? roomQty.find(opcion => opcion.label === propiedad.cantCuarto) : ""} onChange={(e) => setPropiedad({ ...propiedad, cantCuarto: e.value })} ></Select>
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
          <button className='btn btn-link' onClick={() => handleChangePage(2)} >Atrás</button>
        </div>
        <div className='d-flex gap-4 mt-3 '>
          <button className='btn btn-success' onClick={detailData.propiedad.nombre != ''? editDoc : createDoc}>{detailData.propiedad.nombre != '' ? 'Editar' : 'Agregar'}</button>
          <button className='btn btn-danger' onClick={() => navigate(0)} >Cancelar</button>
          <button className={detailData.propiedad.nombre != ''? 'btn btn-dark':'d-none'} onClick={deleteDoc}>Eliminar</button>
        </div>
      </div>
    </div>
  );
 
  


  

  return (
      <div className='d-flex flex-column align-items-center containerAbm'>
        <h2 className="m-auto">{detailData.propiedad.nombre != '' ? 'Editar Propiedad' : 'Agregar Propiedad'}</h2>
        {currentPage === 1 ? renderPageOne() : currentPage === 2 ? renderPageTwo() : renderPageThree()}
      </div>
    )
  }

  export default AbmPropiedades