import { MDBListGroup } from "mdb-react-ui-kit";
import PropertiesItems from "../PropertiesItems/PropertiesItems";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import CustomSpinner from "../CustomSpinner/CustomSpinner";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import AbmPropiedades from "../AbmPropiedades/AbmPropiedades";
import Form from "react-bootstrap/Form";
import ListaDeFiltro from "../listaDeFiltro/ListaDeFiltro";

const Properties = ({forSelect,setNomProp,setModalProp,close}) => {
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadesToShow, setPropiedadesToShow] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTituloDesc, setsearchTituloDesc] = useState("");
  const [checkDisponible, setCheckDisponible] = useState(false);
  const [checkVenta, setCheckVenta] = useState(false);
  const [checkEstacionamiento, setCheckEstacionamiento] = useState(false);
  console.log(forSelect)
  useEffect(() => {
    const dbFirestore = getFirestore();
    const queryCollection = collection(dbFirestore, "propiedades");

    const queryCollectionFiltered = query(
      queryCollection,
      where("visible", "==", true)
    );

    getDocs(queryCollectionFiltered)
      .then((res) =>
        setPropiedades(
          res.docs.map((propiedades) => ({
            id: propiedades.id,
            ...propiedades.data(),
          }))
        )
      )
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section>
      {isLoading ? (
        <CustomSpinner></CustomSpinner>
      ) :
        (
        <>
          <div className="mx-auto w-75 ">
            <div className="w-100 h-100">
              <Form.Control
                size="lg"
                className="w-100 h-200 mb-3 mt-4"
                type="text"
                value={searchTituloDesc}
                id="buscador"
                placeholder="Filtrar"
                onChange={(e) => setsearchTituloDesc(e.target.value)}
              />
              {/* <ListaDeFiltro /> */}
              <div className="d-flex justify-content-around mb-4">
                <Form.Check // prettier-ignore
                  type="switch"
                  id="disponibleSwitch"
                  label="Disponible"
                  className={forSelect!=""? 'text-dark':'text-white'}
                  checked={checkDisponible}
                  onChange={(e) => setCheckDisponible(e.target.checked)}
                />
                <Form.Check // prettier-ignore
                  type="switch"
                  id="ventaSwitch"
                  label="Venta"
                  className={forSelect!=""? 'text-dark':'text-white'}
                  checked={checkVenta}
                  onChange={(e) => setCheckVenta(e.target.checked)}
                />
                <Form.Check // prettier-ignore
                  type="switch"
                  id="estacionamientoSwitch"
                  label="Estacionamiento"
                  className={forSelect!=""? 'text-dark':'text-white'}
                  checked={checkEstacionamiento}
                  onChange={(e) => setCheckEstacionamiento(e.target.checked)}
                />
              </div>
            </div>
            <div className=" my-3 d-flex justify-content-end">
              <Popup
                trigger={
                  <button type="button" className="btn btn-success">
                    Add New
                  </button>
                }
                modal
              >
                <AbmPropiedades
                  propiedad={{
                    id: "",
                    nombre: "",
                    descripcion: "",
                    estado: "",
                    tipo: "",
                    pais: "",
                    region: "",
                    cp: "",
                    calle: "",
                    altura: "",
                    piso: "",
                    dpto: "",
                    cantBaños: -1,
                    cantCuarto: -1,
                    area: "0",
                    wifi: false,
                    aire: false,
                    estacionamiento: false,
                    lavarropa: false,
                    imagen: "",
                  }}
                  status={"create"}
                ></AbmPropiedades>
              </Popup>
            </div>
            {console.log(checkDisponible)}
            <MDBListGroup style={{ minWidth: "22rem",border:"1px solid black" }} light>
              <PropertiesItems
              close={close}
              setModalProp={setModalProp}
                setNomProp={setNomProp}
                forSelect={forSelect}
                propiedades={propiedades.filter(
                  (propiedad) =>
                    (propiedad.nombre
                      .toLowerCase()
                      .includes(searchTituloDesc.toLowerCase()) ||
                      propiedad.descripcion
                        .toLowerCase()
                        .includes(searchTituloDesc.toLowerCase())) &&
                    (checkDisponible == true
                      ? propiedad.estado == "disponible"
                      : propiedad.estado == "disponible" ||
                        propiedad.estado == "ocupado") &&
                    (checkVenta == true
                      ? propiedad.tipo == "venta"
                      : propiedad.tipo == "venta" ||
                        propiedad.tipo == "alquiler") &&
                    (checkEstacionamiento == true
                      ? propiedad.estacionamiento == true
                      : propiedad.estacionamiento == true ||
                        propiedad.estacionamiento == false)
                )}
              />
            </MDBListGroup>
          </div>
        </>
      )}
    </section>
  );
};

export default Properties;
