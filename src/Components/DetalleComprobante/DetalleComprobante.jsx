import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import './detalleComp.css'
import { useEffect, useState } from 'react';
import { MDBListGroup } from 'mdb-react-ui-kit';
import DetalleComp from '../DetalleComp/DetalleComp';
import { app } from '../../FireBase/config';

const DetalleComprobante = ({ item }) => {
    console.log(item)
    const [products, setProducts] = useState([])
    useEffect(() => {
        const fetch = async () => {
            const db = getFirestore(app);
            const docRef = doc(db, "detalleComprobante", item.idDetalle.id);
            const docSnap = await getDoc(docRef).then(res => setProducts(res.data().prodsSelec));
        }
        fetch()

    }, [item])
    console.log(products)
    return (
        <div>

            <h2 className="mainTitle">Detalle de Factura</h2>
            <div className='detailCont border border-dark'>


                <h2 className="tipoComp border border-dark ">{(item.Tipo).toUpperCase()}</h2>

                <p className="numSucTitle">Sucursal y Numero</p>
                <input className="numSucInp" type="text" disabled value={`${item.Suc}-${item.numComp}`} />
                <p className="numCompTitle">N° Comprobante</p>
                <input type="text" className="numCompInp" disabled value={item.id} />
                <p className="provName">Nombre Proveedor</p>
                <input type="text" className="provNameInp" disabled value={item.nombreProveedor} />
                <p className="provCuit">Cuit Proveedor</p>
                <input type="text" className="provCuitInp" disabled value={item.cuitProveedor} />
                <h2 className='prodsTitle'>Productos</h2>
                <MDBListGroup className='prodsDesc' style={{ minWidth: '22rem' }} light>
                    <DetalleComp productos={products} />
                </MDBListGroup>
                <p className='fw-bold pTotName'>Precio Total: {item.pTotal.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}</p>
            

            </div>
        </div>

    )
}

export default DetalleComprobante