import React from 'react'
import { useState } from 'react';
import { app } from '../../FireBase/config'
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const ABMClienets = (detailData) => {
    const [cliente, setCliente] = useState({})
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
            setCliente((cliente) => {
              return { ...cliente, CUIT: formattedNumber }
            })
          }
          else{
            setCliente((cliente) => {
              return { ...cliente, [name]: value }
            })
          }
        }
      })

      
    const editDoc = () => {
      if (empty.value == 0){
      const examcollref = doc(db, 'clientes', detailData.cliente.id)
      updateDoc(examcollref, cliente).then(() => {
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
        const prov={...cliente,Activo:true}
        const dbRef = collection(db, "clientes");
        addDoc(dbRef, prov).then((savedDoc) => {
        console.log("Document has been added successfully")
        alert(`Documento creado`)
        navigate(0)
        updateDoc(doc(db, 'clientes', savedDoc.id), { id: savedDoc.id });
        })
        .catch(error => {
            console.log(error)
        })
      }
    console.log(detailData.cliente.CUIT)
  return (
    <div className='d-flex flex-column align-items-center'>
         <h2 className="m-auto">{detailData.cliente.nombre !== ""? "Editar":"Agregar" } Cliente</h2>
         <div className="container mt-3">
         <form name="form">
         <div className="row">
                <div className="col-md-6 mb-3">
                    <label  className="form-label">Nombre:</label>
                    <input type="text" className="form-control" defaultValue={detailData.cliente.nombre} name="nombre" onChange={handleChange}></input>
                </div>
                <div className="col-md-6 mb-3">
                    <label  className="form-label">Telefono:</label>
                    <input defaultValue={detailData.cliente.telefono} type="text" className="form-control" name="telefono" onChange={handleChange}></input>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Email:</label>
                    <input defaultValue={detailData.cliente.email} type="email" className="form-control" name="email" onChange={handleChange}></input>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">CUIT:</label>
                    <input defaultValue={detailData.cliente.CUIT}  type="text" className="form-control" name="CUIT" placeholder='Solo números' onChange={handleChange}></input>
                </div>
            </div>
        </form>
        </div>
        <div className='d-flex gap-4 mt-2 mb-2 '>
          <button className='btn btn-success' onClick={detailData.cliente.Nombre != ''?editDoc:createDoc}>{detailData.cliente.Nombre != '' ? 'Editar' : 'Agregar'}</button>
          <button className='btn btn-danger' onClick={() => navigate(0)}>Cancelar</button>
        </div>
    </div>
    
  )
}

export default ABMClienets