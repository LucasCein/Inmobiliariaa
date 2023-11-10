import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { app } from "../../FireBase/config";
import CustomSpinner from "../CustomSpinner/CustomSpinner";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";

const DetalleVenta = ({ detalle_id, venta }) => {
  console.log(venta);
  const [cargos, setCargos] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [propiedad, setPropiedad] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(propiedad);
  useEffect(() => {
    const fetch = async () => {
      const db = getFirestore(app);
      const docRef = doc(db, "detalleVenta", detalle_id);
      await getDoc(docRef).then((res) =>
        setCargos(res.data().cargosSeleccionados)
      );
      const db1 = getFirestore(app);
      const docRef1 = doc(db1, "clientes", venta.cliente_id);
      await getDoc(docRef1).then((res) => setCliente(res.data()));
      const db2 = getFirestore(app);
      const docRef2 = doc(db2, "propiedades", venta.propiedad_id);
      await getDoc(docRef2).then((res) => setPropiedad(res.data()));
    };
    fetch().finally(() => {
      setIsLoading(false);
    });
  }, [detalle_id, venta]);
  console.log(cargos);
  return (
    <section>
      {isLoading ? (
        <CustomSpinner></CustomSpinner>
      ) : (
        <section className="d-flex flex-column">
          <h1 className="mb-5 text-center">Detalle de la Venta</h1>
          <section
            className="d-flex justify-content-center"
            style={{ gap: 200 }}
          >
            <section className="d-flex flex-column ms-5">
              <section className="d-flex gap-2 align-items-center">
                <p>Cliente:</p>
                <p>{cliente.Nombre}</p>
              </section>
              <section className="d-flex gap-2 align-items-center">
                <p>Propiedad:</p>
                <p>{propiedad.nombre}</p>
              </section>
            </section>
            <section className="d-flex flex-column ">
              <section className="d-flex gap-2 align-items-center">
                <p>Forma de Pago:</p>
                <p>{venta.f_pago}</p>
              </section>
              <section className="d-flex gap-2 align-items-center">
                <p>Precios:</p>
                <p> {parseFloat(venta.precio).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}</p>
              </section>
            </section>
          </section>
          <section>
            <MDBListGroup style={{ minWidth: "50rem" }} className="mt-5" light>
              <div
                className="container align-items-center justify-content-center pt-3 rounded"
                style={{ backgroundColor: "black" }}
              >
                <div className="row align-items-center">
                  <div className="col mx-2">
                    <p className="fw-bold  text-light">Cargos</p>
                  </div>
                  <div className="col ps-4">
                    <p className="fw-bold text-light">Descripcion</p>
                  </div>
                  <div className="col pe-4">
                    <p className="fw-bold text-white">Precio</p>
                  </div>
                </div>
              </div>
              {cargos.map((cargo) => (
                <MDBListGroupItem
                  key={cargo.id}
                  className="container align-items-center justify-content-center "
                >
                  <div className="row ms-1">
                    <div className="col">
                      <p className="text-dark mb-0">{cargo.nombre}</p>
                    </div>
                    <div className="col">
                      <p className="text-dark mb-0">{cargo.descripcion}</p>
                    </div>
                    <div className="col">
                      <p className="text-dark mb-0 text-end">{parseInt(cargo.precio).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}</p>
                    </div>
                  </div>
                </MDBListGroupItem>
              ))}
            </MDBListGroup>
          </section>
        </section>
      )}
    </section>
  );
};

export default DetalleVenta;
