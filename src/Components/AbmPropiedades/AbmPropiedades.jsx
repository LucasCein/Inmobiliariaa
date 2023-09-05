import Select from "react-select";

import "./AbmPropiedades.css";
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
import { useNavigate } from "react-router-dom";

const AbmPropiedades = (detailData) => {
  const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la página actual
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState({});

  useEffect(() => {
    return () => {
      if (detailData.propiedades !== "") {
        setPropiedad(detailData.propiedad);
      } else {
        setPropiedad({
          id: "",
          nombre: "",
          estado: "",
          descripcion: "",
          imagen: "",
          tipo: "",
          ciudad: "",
          barrio: "",
          calle: "",
          altura: "",
          cp: "",
          piso: "",
          depto: "",
          cantBaños: "",
          cantCuarto: "",
          wifi: false,
          aire: false,
          estacionamiento: false,
          lavarropa: false,
          area: "0",
        });
      }
    };
  }, [detailData]);

  const optionsStatus = [
    { value: "ocupado", label: "Ocupado" },
    { value: "disponible", label: "Disponible" },
  ];
  const optionsType = [
    { value: "venta", label: "Venta" },
    { value: "alquiler", label: "Alquiler" },
  ];
  const roomQty = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
  ];

  const handleChange = (event) => {
    let { name, value, type } = event.target;
    console.dir(event.target);
    if (value == "") {
      console.log("Completar datos");
    }

    if (type === "checkbox") {
      value = event.target.checked;
    }

    setPropiedad((propiedad) => {
      return { ...propiedad, [name]: value };
    });

    console.log(propiedad);
  };

  const [image, setImage] = useState("");
  const upload = async () => {
    if (image == null) return;
    const imageref = ref(storage, `/image/${image.name}`);
    const uploadImage = await uploadBytes(imageref, image).then(
      alert("Se ha subido con exito")
    );
    const newMetadata = {
      cacheControl: "public,max-age=2629800000",
      contentType: uploadImage.metadata.contentType,
    };
    await updateMetadata(imageref, newMetadata);
    const publicImageUrl = await getDownloadURL(imageref);
    setPropiedad({ ...propiedad, imagen: publicImageUrl });
  };
  const db = getFirestore(app);
  const createDoc = () => {
    console.log("nombre: ", propiedad.nombre);
    if (propiedad.nombre != "") {
      const prop = { ...propiedad, visible: true };
      const dbRef = collection(db, "propiedades");
      addDoc(dbRef, prop)
        .then((savedDoc) => {
          console.log("Document has been added successfully");
          alert(`Documento creado: ${savedDoc.id}`);
          navigate(0);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Se debe ingresar un nombre de propiedad");
    }
  };
  const editDoc = () => {
    const examcollref = doc(db, "propiedades", propiedad.id);
    updateDoc(examcollref, propiedad)
      .then(() => {
        alert("Updated");
        navigate(0);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const deleteDoc = () => {
    const examcollref = doc(db, "propiedades", propiedad.id);
    updateDoc(examcollref, { visible: false })
      .then(() => {
        alert("Deleted");
        navigate(0);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const renderPageFour = () => (
    <div className="d-flex flex-wrap w-100 justify-content-center">
      <div className="col-1 w-5">
        <div className="row">
          <p className="my-0 mb-3">Nombre</p>
        </div>
        <p className="my-0 mb-3">Descripcion</p>
        <p className="my-0 mb-4">Estado</p>
        <p className="my-0 mb-10">Tipo</p>
      </div>
      <div className="col-2">
        <input
          className="mb-2"
          type="text"
          name="nombre"
          value={propiedad.nombre}
          onChange={handleChange}
        />
        <input
          className="mb-2"
          type="text"
          name="descripcion"
          value={propiedad.descripcion}
          onChange={handleChange}
        />
        <Select
          className="comboCss basic-single select mb-2"
          options={optionsStatus}
          defaultValue={
            propiedad.estado != ""
              ? propiedad.estado == "ocupado"
                ? optionsStatus[0]
                : optionsStatus[1]
              : ""
          }
          onChange={(e) => setPropiedad({ ...propiedad, estado: e.value })}
          name="estado"
        ></Select>
        <Select
          className="comboCss mb-10"
          options={optionsType}
          defaultValue={
            propiedad.tipo != ""
              ? propiedad.tipo == "venta"
                ? optionsType[0]
                : optionsType[1]
              : ""
          }
          onChange={(e) => setPropiedad({ ...propiedad, tipo: e.value })}
        ></Select>
      </div>
      <div className="col-1">
        <p className=" my-0 mb-3">País</p>
        <p className=" my-0 mb-2">Región</p>
        <p className=" my-0 mb-3">Barrio</p>
        <p className=" my-0 mb-3">Calle</p>
        <p className=" my-0 mb-3">Altura</p>
        <p className=" my-0 mb-3">Piso</p>
        <p className=" my-0 mb-3">Dpto.</p>
        <p className="my-0">Imagen</p>
      </div>
      <div className="col-2">
        <input
          className="mb-2"
          type="text"
          value={propiedad.ciudad}
          name="ciudad"
          onChange={handleChange}
        />
        <input
          className="mb-2"
          type="text"
          value={propiedad.cp}
          name="cp"
          onChange={handleChange}
        />
        <input
          className="mb-2"
          type="text"
          value={propiedad.barrio}
          name="barrio"
          onChange={handleChange}
        />
        <input
          className="mb-2"
          type="text"
          value={propiedad.calle}
          name="calle"
          onChange={handleChange}
        />
        <input
          className="mb-2"
          type="text"
          value={propiedad.altura}
          name="altura"
          onChange={handleChange}
        />
        <input
          className="mb-2"
          type="text"
          value={propiedad.piso}
          name="piso"
          onChange={handleChange}
        />
        <input
          className="mb-3"
          type="text"
          value={propiedad.dpto}
          name="dpto"
          onChange={handleChange}
        />
        <input
          type="file"
          name=""
          id=""
          className="mb-2"
          accept="image/*"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
        <button onClick={upload} className="btn btn-success mt-3">
          Subir
        </button>
      </div>
      <div className="col-2">
        <p className="my-0 mb-4">Baños:</p>
        <p className="my-0 mb-3">Cuartos:</p>
        <p className=" my-0 mb-4">Area cubierta</p>
        <p className="my-0 mb-2">WiFi:</p>
        <p className="my-0 mb-2">Aire Acondicionado:</p>
        <p className="my-0 mb-2">Estacionamiento:</p>
        <p className="my-0 mb-2">Lavarropas:</p>
      </div>
      <div className="col-2">
        <Select
          className="comboCss mb-2"
          options={roomQty}
          defaultValue={
            propiedad.cantBaños != ""
              ? roomQty.find((opcion) => opcion.label === propiedad.cantBaños)
              : ""
          }
          onChange={(e) => setPropiedad({ ...propiedad, cantBaños: e.value })}
        ></Select>
        <Select
          className="comboCss mb-2"
          options={roomQty}
          defaultValue={
            propiedad.cantCuarto != ""
              ? roomQty.find((opcion) => opcion.label === propiedad.cantCuarto)
              : ""
          }
          onChange={(e) => setPropiedad({ ...propiedad, cantCuarto: e.value })}
        ></Select>
        <input
          type="text"
          className="mb-3"
          value={propiedad.area}
          name="area"
          onChange={handleChange}
        />
        <br />
        <input
          name="wifi"
          className="custom-checkbox mb-3"
          type="checkbox"
          checked={propiedad.wifi}
          onChange={handleChange}
        />
        <br />
        <input
          name="aire"
          className="custom-checkbox mb-3"
          type="checkbox"
          checked={propiedad.aire}
          onChange={handleChange}
        />
        <br />
        <input
          name="estacionamiento"
          className="custom-checkbox mb-3"
          type="checkbox"
          checked={propiedad.estacionamiento}
          onChange={handleChange}
        />
        <br />
        <input
          name="lavarropa"
          className="custom-checkbox"
          type="checkbox"
          checked={propiedad.lavarropa}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  return (
    <div className="d-flex flex-column align-items-center containerAbm">
      <h2 className="m-auto pb-5">
        {detailData.propiedad.nombre != ""
          ? "Editar Propiedad"
          : "Agregar Propiedad"}
      </h2>
      {renderPageFour()}
    </div>
  );
};

export default AbmPropiedades;
