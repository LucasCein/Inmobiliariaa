import { MDBListGroup } from 'mdb-react-ui-kit';
import PropertiesItems from '../PropertiesItems/PropertiesItems';
import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import AbmPropiedades from '../AbmPropiedades/AbmPropiedades';
const Properties = () => {
    const [propiedades, setPropiedades] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {

        const dbFirestore = getFirestore()
        const queryCollection = collection(dbFirestore, 'propiedades')

        const queryCollectionFiltered = query(queryCollection,where('visible','==',true))

        getDocs(queryCollectionFiltered)
            .then(res => setPropiedades(res.docs.map(propiedades => ({ id: propiedades.id, ...propiedades.data() }))))
            .catch(error => console.log(error))
            .finally(() => setIsLoading(false))


    }, [])
    return (
        <section>
            {isLoading ? <CustomSpinner></CustomSpinner> :
                <>
                    <div className='mx-auto w-75 ' style={{ marginTop: '200px' }}>
                        <div className=' my-3 d-flex justify-content-end'>
                            <Popup trigger={<button type="button" className="btn btn-success">Add New</button>} modal>
                                <AbmPropiedades propiedad={{ nombre: "", descripcion: "", estado: "", tipo: "", imagen: "", ubicacion: "", cantBaños :"", cantCuarto: "", wifi:"",aire: "", estacionamiento: "", lavarropa: "" }} status={'create'}></AbmPropiedades>
                            </Popup>
                        </div>
                        <MDBListGroup style={{ minWidth: '22rem' }} light>
                            <PropertiesItems propiedades={propiedades} />
                        </MDBListGroup>
                    </div>
                </>}

        </section>
    )
}

export default Properties