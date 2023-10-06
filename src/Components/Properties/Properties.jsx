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

  /* return (
    <section>
      {isLoading ? (
        <CustomSpinner></CustomSpinner>
      ) : (
        <>
          <div className="mx-auto w-100 m-1 p-3" style={{ marginTop: "20px" }}>
            <h1
              className={forSelect != "" ? "mb-4 text-dark" : "mb-4 text-white"}
            >
              Propiedades
            </h1>
            <div className="row align-items-center justify-content-center">
              <div className="col d-flex align-items-center justify-content-start">
                <div className="mb-3">
                  <label
                    className={
                      forSelect != "" ? "me-2 text-dark" : "me-2 text-white"
                    }
                  >
                    Nombre:
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    onChange={(e) => setsearchTituloDesc(e.target.value)}
                    placeholder="Filtrar"
                  />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-start">
                <label
                  className={
                    forSelect != "" ? "me-2 text-dark" : "me-2 text-white"
                  }
                >
                  Estado:
                </label>
                <input
                  className="ms-4"
                  type="text"
                  name="CUIT"
                  onChange={handleChange}
                  placeholder="Filtrar"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  ); */

  /* return (
    <section>
      {isLoading ? (
        <CustomSpinner></CustomSpinner>
      ) : (
        <>
          <div className="mx-auto w-100 m-1 p-3" style={{ marginTop: "20px" }}>
            <h1
              className={forSelect != "" ? "mb-4 text-dark" : "mb-4 text-white"}
            >
              Propiedades
            </h1>
            <div className="row align-items-center justify-content-center">
              <div className="col d-flex align-items-center justify-content-start">
                <div className="mb-3">
                  <label
                    className={
                      forSelect != "" ? "me-2 text-dark" : "me-2 text-white"
                    }
                  >
                    Nombre:
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    onChange={handleChange}
                    placeholder="Filtrar"
                  />
                </div>
                <div className="mb-3 ms-4">
                  <label
                    className={
                      forSelect != "" ? "me-2 text-dark" : "me-2 text-white"
                    }
                  >
                    Descripción:
                  </label>
                  <input
                    type="text"
                    name="descripcion"
                    onChange={handleChange}
                    placeholder="Filtrar"
                  />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-start">
                <label
                  className={
                    forSelect != "" ? "me-2 text-dark" : "me-2 text-white"
                  }
                >
                  CUIT:
                </label>
                <input
                  className="ms-4"
                  type="text"
                  name="CUIT"
                  onChange={handleChange}
                  placeholder="Filtrar"
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
                <ABMProveedor
                  proveedor={{ nombre: "", descripcion: "", direccion: "" }}
                ></ABMProveedor>
              </Popup>
            </div>
            <MDBListGroup className="w-100">
              <div
                className="container align-items-center justify-content-center pt-1 rounded"
                style={{ backgroundColor: "black" }}
              >
                <div className="row">
                  <div className="col ms-2">
                    <p className="fw-bold  text-light">Nombre</p>
                  </div>
                  <div className="col ps-3">
                    <p className="fw-bold text-light">Descripcion</p>
                  </div>
                  <div className="col ps-5">
                    <p className="fw-bold  text-light">CUIT</p>
                  </div>
                  <div className="col ps-4">
                    <p className="fw-bold text-white">E-Mail</p>
                  </div>
                  <div className="col ps-5 ms-3">
                    <p className="fw-bold text-white ps-1">Telefono</p>
                  </div>
                  <div className="col d-flex align-items-center justify-content-center me-3">
                    <p className="fw-bold text-light">Opciones</p>
                  </div>
                </div>
              </div>
              <ProveedoresItem
                proveedores={proveedores}
                forSelected={forSelect}
                setNomProv={setNomProv}
                setOpenModal={setOpenModal}
                close={close}
              />
            </MDBListGroup>
          </div>
        </>
      )}
    </section>
  ); */

  return (
    <section>
      {isLoading ? (
        <CustomSpinner></CustomSpinner>
      ) : (
        <>
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
                <div className="d-flex flex-row">
                  <label className="text-white me-4 row justify-content-center align-items-center">
                    Estado
                  </label>
                  <Select options={optionsStatus}></Select>
                </div>
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
                  proveedor={{ nombre: "", descripcion: "", direccion: "" }}
                ></AbmPropiedades>
              </Popup>
            </div>
            <MDBListGroup className="w-100">
              <div
                className="container align-items-center justify-content-center pt-1 rounded"
                style={{ backgroundColor: "black" }}
              >
                <div className="row">
                  <div className="col ms-5">
                    <p className="fw-bold  text-light">Imagen</p>
                  </div>
                  <div className="col ms-2">
                    <p className="fw-bold  text-light">Nombre</p>
                  </div>
                  <div className="col ps-3">
                    <p className="fw-bold text-light">Descripcion</p>
                  </div>
                  <div className="col ps-2">
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

  /* return (
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
              {/* <ListaDeFiltro /> }
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
  ); */
};

export default Properties;
