import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useState } from "react";
import { app } from "../../FireBase/config";

const ABMCargo = ({close}) => {
    const [cargo, setCargo] = useState({nombre:"",descripcion:""})
    const db = getFirestore(app);
    const createDoc = () => {
        const dbRef = collection(db, "cargos");
        addDoc(dbRef, cargo).then(() => {
        console.log("Document has been added successfully")
        close()
        })
        .catch(error => {
            console.log(error)
        })
      }
    return (
        <section className="d-flex flex-column align-items-center">
            <h1 className="text-center mt-2 mb-5">Nuevo Cargo</h1>
            <section className="d-flex gap-5 justify-content-center">
                <section className="d-flex gap-2 align-items-center">
                    <label>Nombre:</label>
                    <input type="text" onChange={(e) => setCargo({...cargo, nombre:e.target.value})}/>
                </section>
                <section className="d-flex gap-2 align-items-center">
                    <label>Descripcion:</label>
                    <input type="text" onChange={(e) => setCargo({...cargo, descripcion:e.target.value})}/>
                </section>
            </section>
            <button className="btn btn-success mt-5" style={{ width: "110px" }} onClick={createDoc}>Agregar</button>
        </section>
    )
}

export default ABMCargo