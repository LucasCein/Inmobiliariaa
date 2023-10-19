import React,{useState,useEffect} from 'react'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import Popup from 'reactjs-popup';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import { MDBListGroup } from 'mdb-react-ui-kit';
import AbmProds from "../AbmProds/AbmProds"
import ProductoItem from './ProductosItems';



const Productos = ({setNomProd,setprodsSelec,close,prodsSelec}) => {

  const [isLoading, setIsLoading] = useState(true);
  const [productos, setProductos] = useState ([])
  
  useEffect(()=>{
    const fetchProductos = async () =>{
      const dbFirestore = getFirestore()
      const queryCollection = collection(dbFirestore, 'productos')
      const queryCollectionFiltered = query(queryCollection,where('visible','==',true))
      const res= await getDocs(queryCollectionFiltered)
      let productosData = res.docs.map(producto => ({
        id: producto.id,
        ...producto.data(),
      }));

    //   const queryProveedores = collection(dbFirestore, 'proveedores')
    //   const proveedorSnapshot = await getDocs(queryProveedores);
    //   const proveedorList = proveedorSnapshot.docs.map(doc => ({
    //       id: doc.id,
    //       ...doc.data()
    //   }));

    //   facturasData = facturasData.map(factura => {
    //     const proveedor = proveedorList.find(prop => prop.id === factura.proveedor)
    //     const facturaconProveedor = {
    //       ...factura,
    //       nombreProveedor: proveedor ? proveedor.nombre : '',
    //   };
    //   return facturaconProveedor;
    // });

      setProductos(productosData);
      setIsLoading(false)
      }
      fetchProductos()
  },[])

  return (
    <>
        {isLoading ? <CustomSpinner></CustomSpinner>:
        <div className='mx-auto w-100 m-1 p-3' style={{ marginTop: '20px' }}>
          <h1 className='mb-4' style={{color: "black"}}>Productos</h1>  
            <div className=' my-3 d-flex justify-content-end'>
                  <Popup trigger={<button type="button" className="btn btn-success">Add New</button>} modal>
                    <AbmProds ></AbmProds>
                  </Popup>
            </div>
                  <MDBListGroup className='w-100'>
                    <ProductoItem productos={productos} setNomProd={setNomProd} setprodsSelec={setprodsSelec} prodsSelec={prodsSelec}  close={close}></ProductoItem>
                  </MDBListGroup>
          </div>
          
        }
    </> 
  )
}

export default Productos