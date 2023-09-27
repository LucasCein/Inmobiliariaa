import { MDBListGroup } from "mdb-react-ui-kit";
import ProveedoresItem from "../Proveedor/ProveedoresItem";
import { useEffect, useState } from "react";
import CustomSpinner from "../CustomSpinner/CustomSpinner";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import React from "react";
import ABMProveedor from "./ABMProveedor";
import useFirestoreCollection from "../../hooks/useFirestoreCollection";

const Proveedor = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedores_og, setProveedoresOG] = useState([]);

  const { data: proveedoresData, isLoading: isLoadingProveedores } =
    useFirestoreCollection("proveedores", [["Activo", "==", true]]);

  useEffect(() => {
    if (!isLoadingProveedores) {
      setProveedores(proveedoresData);
      setProveedoresOG(proveedoresData);
    }
  }, [proveedoresData, isLoadingProveedores]);

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (value == "") {
      setProveedores(proveedores_og);
    } else {
      setProveedores(
        proveedores.filter((proveedor) =>
          proveedor[name].toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <section>
      {isLoadingProveedores ? (
        <CustomSpinner></CustomSpinner>
      ) : (
        <>
          <div className="mx-auto w-100 m-1 p-3" style={{ marginTop: "20px" }}>
            <h1 className="mb-4" style={{ color: "white" }}>
              Proveedores
            </h1>
            <div className="row align-items-center justify-content-center">
              <div className="col d-flex align-items-center justify-content-start">
                <div className="mb-3">
                  <label className="me-2" style={{ color: "white" }}>
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
                  <label className="me-2" style={{ color: "white" }}>
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
                <label className="me-2" style={{ color: "white" }}>
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
              <ProveedoresItem proveedores={proveedores} />
            </MDBListGroup>
          </div>
        </>
      )}
    </section>
  );
};

export default Proveedor;
