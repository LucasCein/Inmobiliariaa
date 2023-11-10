import { useEffect, useMemo, useState } from "react";
import { app, storage } from "../../FireBase/config";
import {
  getDownloadURL,
  ref,
  updateMetadata,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const ABMProveedor = () => {
  const [proveedor, setProveedor] = useState({});
  const location = useLocation();
  const { detailData } = location.state;
  console.log(detailData);
  const db = getFirestore(app);
  const navigate = useNavigate();
  let empty = {
    value: 0,
  };
  const handleChange = (event) => {
    let { name, value, type } = event.target;
    if (value == "") {
      empty = {
        value: 1,
        nombre: name,
      };
    } else {
      empty = {
        value: 0,
      };
      if ([name] == "CUIT") {
        const formattedNumber = `${value.slice(0, 2)}-${value.slice(
          2,
          10
        )}-${value.slice(10, 11)}`;
        setProveedor((proveedor) => {
          return { ...proveedor, CUIT: formattedNumber };
        });
      } else {
        setProveedor((proveedor) => {
          return { ...proveedor, [name]: value };
        });
      }
    }
  };

  const editDoc = () => {
    if (empty.value == 0) {
      const examcollref = doc(db, "proveedores", detailData.id);
      updateDoc(examcollref, proveedor)
        .then(() => {
          const MySwal = withReactContent(Swal);

          MySwal.fire({
            title: <strong>Se ha modificado con Exito!</strong>,
            icon: "success",
            preConfirm: () => {
              navigate("/proveedores");
            },
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      alert("Completar datos de " + empty.nombre);
    }
  };

  const createDoc = () => {
    const prov = { ...proveedor, Activo: true };
    const dbRef = collection(db, "proveedores");
    addDoc(dbRef, prov)
      .then((savedDoc) => {
        const MySwal = withReactContent(Swal);

        MySwal.fire({
          title: <strong>Se ha agregado con Exito!</strong>,
          icon: "success",
          preConfirm: () => {
            navigate("/proveedores");
          },
        });
        updateDoc(doc(db, "proveedores", savedDoc.id), { id: savedDoc.id });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h2 className="mt-5 mb-5 text-light fw-bold">
        {detailData.nombre !== "" ? "Editar" : "Agregar"} Proveedor
      </h2>
      <div className="container mt-3">
        <form name="form">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Nombre:</label>
              <input
                type="text"
                className="form-control"
                defaultValue={detailData.nombre}
                name="nombre"
                onChange={handleChange}
              ></input>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Descripción:</label>
              <input
                defaultValue={detailData.descripcion}
                type="text"
                className="form-control"
                id="descripcion"
                name="descripcion"
                onChange={handleChange}
              ></input>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Telefono:</label>
              <input
                defaultValue={detailData.telefono}
                type="text"
                className="form-control"
                name="telefono"
                onChange={handleChange}
              ></input>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Email:</label>
              <input
                defaultValue={detailData.email}
                type="email"
                className="form-control"
                name="email"
                onChange={handleChange}
              ></input>
            </div>
            <div className="col mb-3">
              <label className="form-label text-light">CUIT:</label>
              <input
                defaultValue={detailData.CUIT}
                type="text"
                className="form-control"
                name="CUIT"
                placeholder="Solo números"
                onChange={handleChange}
              ></input>
            </div>
          </div>
        </form>
      </div>
      <div className="d-flex gap-4 mt-2 mb-2 ">
        <button
          className="btn btn-success"
          onClick={detailData.nombre != "" ? editDoc : createDoc}
        >
          {detailData.nombre != "" ? "Editar" : "Agregar"}
        </button>
        <button
          className="btn btn-danger"
          onClick={() => navigate("/proveedores")}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ABMProveedor;
