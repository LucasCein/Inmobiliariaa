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
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";

const Properties = ({ forSelect, setNomProp, setModalProp, close }) => {
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadesToShow, setPropiedadesToShow] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTituloDesc, setsearchTituloDesc] = useState("");
  const [checkDisponible, setCheckDisponible] = useState(false);
  const [checkVenta, setCheckVenta] = useState(false);
  const [checkEstacionamiento, setCheckEstacionamiento] = useState(false);

  const optionsStatus = [
    { value: "ocupado", label: "Ocupado" },
    { value: "disponible", label: "Disponible" },
  ];

  console.log(forSelect);
  useEffect(() => {
    const dbFirestore = getFirestore();
    const queryCollection = collection(dbFirestore, "propiedades");

    const queryCollectionFiltered = query(
      queryCollection,
      where("visible", "==", true),
      where("vendido", "==", false)
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
  const detailData = {
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
    cantBaños: "",
    cantCuarto: "",
    area: "0",
    wifi: false,
    aire: false,
    estacionamiento: false,
    lavarropa: false,
    imagen: "",
  };
  const nav = useNavigate();
  return (
    <section>
      {isLoading ? (
        <CustomSpinner></CustomSpinner>
      ) : (
        <>
          <h1 className={forSelect!=""?'mb-4 text-dark text-center mt-4':'mb-4 text-white text-center mt-4'}>Propiedades</h1>
          <div className="mx-auto w-100 m-1 p-3" style={{ marginTop: "20px" }}>
            <div className="mx-auto w-75 ">
              <div className="w-100 h-100">
                <div className="d-flex flex-row">
                  <label className="text-white me-4 row justify-content-center align-items-center">
                    Filtrar
                  </label>
                  <Form.Control
                    size="lg"
                    className="mb-3"
                    type="text"
                    value={searchTituloDesc}
                    id="buscador"
                    onChange={(e) => setsearchTituloDesc(e.target.value)}
                  />
                </div>
                {/* <ListaDeFiltro /> */}
                <div className="d-flex justify-content-around mb-4">
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="disponibleSwitch"
                    label="Disponible"
                    className={forSelect != "" ? "text-dark" : "text-white"}
                    checked={checkDisponible}
                    onChange={(e) => setCheckDisponible(e.target.checked)}
                  />
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="ventaSwitch"
                    label="Venta"
                    className={forSelect != "" ? "text-dark" : "text-white"}
                    checked={checkVenta}
                    onChange={(e) => setCheckVenta(e.target.checked)}
                  />
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="estacionamientoSwitch"
                    label="Estacionamiento"
                    className={forSelect != "" ? "text-dark" : "text-white"}
                    checked={checkEstacionamiento}
                    onChange={(e) => setCheckEstacionamiento(e.target.checked)}
                  />
                </div>
              </div>
            </div>
            <div
              className=" my-3 d-flex justify-content-end"
              style={{ marginRight: "10%" }}
            >
              <button
                className="btn btn-success"
                onClick={() =>
                  nav("/AbmPropiedades", { state: { detailData } })
                }
              >
                Add New
              </button>

              {/* <Popup
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
                    cantBaños: "",
                    cantCuarto: "",
                    area: "0",
                    wifi: false,
                    aire: false,
                    estacionamiento: false,
                    lavarropa: false,
                    imagen: "",
                  }}
                ></AbmPropiedades>
              </Popup> */}
            </div>
            <MDBListGroup className="w-100">
              <div
                className="container align-items-center justify-content-center pt-1 rounded"
                style={{ backgroundColor: "black" }}
              >
                <div className="row">
                  <div className="col ms-4">
                    <p className="fw-bold  text-light">Imagen</p>
                  </div>
                  <div className="col">
                    <p className="fw-bold  text-light">Nombre</p>
                  </div>
                  <div className="col">
                    <p className="fw-bold text-light">Descripcion</p>
                  </div>
                  <div className="col ms-3">
                    <p className="fw-bold  text-light">Tipo</p>
                  </div>
                  <div className="col pe-5">
                    <p className="fw-bold  text-light">Estado</p>
                  </div>
                  <div className="col d-flex align-items-center justify-content-center me-3">
                    <p className="fw-bold text-light">Opciones</p>
                  </div>
                </div>
              </div>
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
