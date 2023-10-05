import React from 'react'
import { MDBListGroupItem } from 'mdb-react-ui-kit';
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import { app } from '../../FireBase/config'
import { Checkbox } from '@mui/material';

const ProductoItem = ({ productos, setNomProd, setprodsSelec,close }) => {
    // const navigate = useNavigate();

    // const db = getFirestore(app);
    // const deleteDoc = (id) => {
    //     console.log(id)
    //     const examcollref = doc(db, 'productos', id)
    //     updateDoc(examcollref, { visible: false }).then(() => {
    //         alert("Deleted")
    //         navigate(0)
    //     }).catch(error => {
    //         console.log(error.message)
    //     })
    // }
    const navigate = useNavigate()
    const [checkedItems, setCheckedItems] = useState([])
    const handleCheckboxChange = (event) => {
        const { checked, value } = event.target;

        if (checked) {
            setCheckedItems([...checkedItems, value]);
        } else {
            setCheckedItems(checkedItems.filter((item) => item !== value));
        }
    };
    
    const handleClickAceptar = () => {
        // Guardar los productos seleccionados en el estado
        setprodsSelec(checkedItems.map((id)=>{
            return productos.find((prod)=>prod.id==id)
          }));
       close()
    };

   
    return (
        <>
            {
                productos.map(({ id, nombre, descripcion, precio }) =>
                    <MDBListGroupItem key={id} className='container align-items-center justify-content-center'>
                        <div className='row '>
                            <div className='col'>
                                <p className='fw-bold mb-1'>Nombre</p>
                                <p className='text-muted mb-0'>{nombre}</p>
                            </div>
                            <div className="col" >
                                <p className='fw-bold mb-1'>Descripcion</p>
                                <p className='text-muted mb-0'>{descripcion}</p>
                            </div>
                            <div className="col">
                                <p className='fw-bold mb-1'>Precio</p>
                                <p className='text-muted mb-0'>${precio}</p>
                            </div>
                            <div className='col d-flex align-items-center justify-content-end me-5'>
                                <Checkbox
                                    checked={checkedItems.includes(id)}
                                    onChange={handleCheckboxChange}
                                    value={id}
                                />
                            </div>

                        </div>

                    </MDBListGroupItem>
                )

            }
            <div className='d-flex justify-content-end mt-3'>
                <button onClick={handleClickAceptar} className='btn btn-success'>Aceptar</button>
            </div>
        </>
    )
}

export default ProductoItem