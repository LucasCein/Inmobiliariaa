import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import ComprobantesItems from '../ComprobantesItems/ComprobantesItems';
import Popup from 'reactjs-popup';
import { MDBListGroup } from 'mdb-react-ui-kit';
import AbmComprobantes from '../AbmComprobantes/AbmComprobantes';
import CustomSpinner from '../CustomSpinner/CustomSpinner';

const ComprobantesPago = () => {
    const [comprobantes, setComprobantes] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {

        const dbFirestore = getFirestore()
        const queryCollection = collection(dbFirestore, 'comprobantes')

        getDocs(queryCollection)
            .then(res => setComprobantes(res.docs.map(comprobante => ({
                id: comprobante.id,
                ...comprobante.data(),
                Fecha: comprobante.data().Fecha.toDate().toLocaleDateString(),
                nombreProveedor:''
            }))))
            .catch(error => console.log(error))
            .finally(setIsLoading(false))

    }, [])


    return (
        <>
        {isLoading ? <CustomSpinner></CustomSpinner> :
        <div className='mx-auto w-75 ' style={{ marginTop: '200px' }}>
            <div className=' my-3 d-flex justify-content-end'>
                <Popup trigger={<button type="button" className="btn btn-success">Add New</button>} modal>
                    <AbmComprobantes comprobante={{ Fecha: "", Tipo: "", idProv: "", idProp: "", pTotal: "", idDetalle: "" }} ></AbmComprobantes>
                </Popup>
            </div>
            <MDBListGroup style={{ minWidth: '22rem' }} light>
                <ComprobantesItems comprobantes={comprobantes} />
            </MDBListGroup>
        </div>
        }
        </>
    )
}

export default ComprobantesPago