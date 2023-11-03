import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import CustomSpinner from "../CustomSpinner/CustomSpinner";
import { Link } from "react-router-dom";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { app } from "../../FireBase/config";

const Consultas = () => {
    const [consultas, setConsultas] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [consultasConPropiedad, setConsultasConPropiedad] = useState([]);
    useEffect(() => {
        const dbFirestore = getFirestore();
        const queryCollection = collection(dbFirestore, "consulta");

        getDocs(queryCollection)
            .then((res) =>
                setConsultas(
                    res.docs.map((consultas) => ({
                        id: consultas.id,
                        ...consultas.data(),
                    }))
                )
            )
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false));
    }, []);
    useEffect(() => {
        if (consultas.length > 0) {
            setIsLoading(true);
            const dbFirestore = getFirestore(app);
            const updateConsultas = async () => {
                const updatedConsultas = await Promise.all(consultas.map(async (consulta) => {
                    const docRef = doc(dbFirestore, "propiedades", consulta.idPropiedad);
                    const res = await getDoc(docRef);
                    return { ...consulta, nombre_Prop: res.data()?.nombre, tipo: res.data()?.tipo };
                }));
                setConsultasConPropiedad(updatedConsultas);
                setIsLoading(false);
            };
            updateConsultas();
        }
    }, [consultas]);

    return (
        <section>
            {isLoading ? (
                <CustomSpinner></CustomSpinner>
            ) : (
                <div className='d-flex flex-column '>
                    <h1 className='text-white fw-bold mt-4 text-center'>Consultas</h1>
                    <div className=' mt-5 d-flex align-self-end' style={{ marginRight: "10%" }}>
                        <Link to={"/ABMVentas"}>
                            <button className='btn btn-success'>Add New</button>
                        </Link>
                    </div>
                    <div>
                        <MDBListGroup style={{ minWidth: '50rem' }} className='mt-5' light>
                            <div className='container align-items-center justify-content-center pt-3 rounded' style={{ backgroundColor: "black" }} >
                                <div className='row align-items-center'>
                                    <div className='col mx-2'>
                                        <p className='fw-bold  text-light'>Email</p>
                                    </div>
                                    <div className="col ps-4" >
                                        <p className='fw-bold text-light'>Consulta</p>

                                    </div>
                                    <div className="col pe-4">
                                        <p className='fw-bold text-white'>Tipo</p>
                                    </div>
                                    <div className="col pe-4">
                                        <p className='fw-bold text-white'>Propiedad</p>
                                    </div>

                                </div>
                            </div>
                            {consultasConPropiedad?.map((consulta) => (
                                <MDBListGroupItem key={consulta.id} className='container align-items-center justify-content-center ' >
                                    <div className="row ms-1">
                                        <div className='col'>
                                            <p className='text-dark mb-0'>{consulta.email}</p>
                                        </div>
                                        <div className="col">
                                            <p className='text-dark mb-0'>{consulta.consulta}</p>
                                        </div>
                                        <div className="col">
                                            <p className='text-dark mb-0'>{consulta.tipo}</p>
                                        </div>
                                        <div className="d-flex gap-2 col">
                                            <p className='text-dark mb-0'>{consulta.nombre_Prop}</p>
                                        </div>

                                    </div>
                                </MDBListGroupItem>
                            ))}

                        </MDBListGroup>
                    </div>
                </div>)}

        </section>

    )
}

export default Consultas