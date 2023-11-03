import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import CustomSpinner from "../CustomSpinner/CustomSpinner";
import { Link, useNavigate } from "react-router-dom";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { app } from "../../FireBase/config";
import { BsArchiveFill } from "react-icons/bs";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Consultas = () => {
    const [consultas, setConsultas] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [consultasConPropiedad, setConsultasConPropiedad] = useState([]);
    const dbFirestore = getFirestore();
    const navigate = useNavigate()

    useEffect(() => {

        const queryCollection = collection(dbFirestore, "consulta");
        const queryCollectionFiltered = query(queryCollection, where('visible', '==', true))
        getDocs(queryCollectionFiltered)
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
    const deleteDoc = (id) => {
        console.log(id)
        const examcollref = doc(dbFirestore, 'consulta', id)
        updateDoc(examcollref, { visible: false }).then(() => {
            const MySwal = withReactContent(Swal)

            MySwal.fire({
                title: <strong>Se ha eliminado con Exito!</strong>,
                icon: 'success',
                preConfirm: () => {
                    navigate(0)
                }
            })
        }).catch(error => {
            console.log(error.message)
        })
    }
    return (
        <section>
            {isLoading ? (
                <CustomSpinner></CustomSpinner>
            ) : (
                <div className='d-flex flex-column '>
                    <h1 className='text-white fw-bold mt-4 text-center'>Consultas</h1>

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
                                    <div className="col pe-4">
                                        <p className='fw-bold text-white'>Eliminar</p>
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
                                        <div className="d-flex gap-2 col">
                                            <button className="btn btn-danger" onClick={() => deleteDoc(consulta.id)}><BsArchiveFill></BsArchiveFill></button>
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