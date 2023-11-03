import Select from "react-select";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import "./AbmPropiedades.css";
import { useEffect, useState } from "react";
import { app, storage } from "../../FireBase/config";
import { NumericFormat } from 'react-number-format';
import {
  getDownloadURL,
  ref,
  updateMetadata,
  uploadBytes,
} from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const AbmPropiedades = () => {
  /* const [currentPage, setCurrentPage] = useState(1); */
  const location=useLocation()
  const {detailData}=location.state
  console.log(detailData)
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState({
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
    precio: ""
  });
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (detailData.nombre !== "") {
      console.log("detailData", detailData);
      setPropiedad(detailData);
    }
  }, []);

  /*   if (detailData.propiedad.nombre !== "") {
    console.log("detailData", detailData.propiedad);
    setPropiedad(detailData.propiedad);
  } */

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

    console.log("propiedad", propiedad);
  };

  const handlePaisChange = (valor) => {
    setPropiedad((propiedad) => {
      return { ...propiedad, ["pais"]: valor };
    });
  };

  const handleRegionChange = (valor) => {
    setPropiedad((propiedad) => {
      return { ...propiedad, ["region"]: valor };
    });
  };

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
      const prop = {
        ...propiedad,
        visible: true,
        vendido: false
      };
      console.log("prop", prop);
      const dbRef = collection(db, "propiedades");
      addDoc(dbRef, prop)
        .then((savedDoc) => {
          const MySwal = withReactContent(Swal)

            MySwal.fire({
                title: <strong>Se ha agregado con Exito!</strong>,
                icon: 'success',
                preConfirm: () => {
                    navigate("/properties")
                }
            })
          updateDoc(doc(db, "propiedades", savedDoc.id), { id: savedDoc.id });
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
        const MySwal = withReactContent(Swal)

            MySwal.fire({
                title: <strong>Se ha editado con Exito!</strong>,
                icon: 'success',
                preConfirm: () => {
                    navigate("/properties")
                }
            })
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
          <p className="my-0 mb-3 text-light">Nombre</p>
        </div>
        <p className="my-0 mb-3 text-light">Descripcion</p>
        <p className="my-0 mb-4 text-light">Estado</p>
        <p className="my-0 mb-4 text-light">Tipo</p>
        <p className="my-0 mb-10 text-light">Precio</p>
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
          value={
            propiedad.estado != ""
              ? propiedad.estado == "ocupado"
                ? optionsStatus[0]
                : optionsStatus[1]
              : ""
          }
          defaultValue={""}
          onChange={(e) => setPropiedad({ ...propiedad, estado: e.value })}
        ></Select>
        <Select
          className="comboCss mb-2"
          options={optionsType}
          value={
            propiedad.tipo != ""
              ? propiedad.tipo == "venta"
                ? optionsType[0]
                : optionsType[1]
              : ""
          }
          defaultValue={""}
          onChange={(e) => setPropiedad({ ...propiedad, tipo: e.value })}
        ></Select>{" "}
        <NumericFormat
          value={parseFloat(propiedad.precio)}
          thousandSeparator={true}
          prefix={'$'}
          decimalScale={2}
          fixedDecimalScale={true}
          onValueChange={(values) => {
            const { formattedValue, value } = values;
            setPropiedad({ ...propiedad, precio: parseInt(value) }) // 1234.56
          }}
          style={{ textAlign: 'right' }}
        />
      </div>
      <div className="col-1">
        <p className=" my-0 mb-3 text-light">País</p>
        <p className=" my-0 mb-2 text-light">Región</p>
        <p className=" my-0 mb-3 text-light">CP</p>
        <p className=" my-0 mb-3 text-light">Calle</p>
        <p className=" my-0 mb-3 text-light">Altura</p>
        <p className=" my-0 mb-3 text-light">Piso</p>
        <p className=" my-0 mb-3 text-light">Dpto.</p>
        <p className="my-0 text-light">Imagen</p>
      </div>
      <div className="col-2">
        <CountryDropdown
          className="comboCss  mb-3"
          value={propiedad.pais}
          onChange={(val) => handlePaisChange(val)}
          name="pais"
        />
        <RegionDropdown
          disableWhenEmpty={true}
          value={propiedad.region}
          country={propiedad.pais}
          name="region"
          onChange={(val) => handleRegionChange(val)}
          className="comboCss mb-2"
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
        <div className="d-flex gap-4 mt-5 ">
          <button
            className="btn btn-success"
            onClick={detailData.nombre != "" ? editDoc : createDoc}
          >
            {detailData.nombre != "" ? "Editar" : "Agregar"}
          </button>
          <button className="btn btn-danger" onClick={() => navigate("/properties")}>
            Cancelar
          </button>
        </div>
      </div>
      <div className="col-2">
        <p className="my-0 mb-4 text-light">Baños:</p>
        <p className="my-0 mb-3 text-light">Cuartos:</p>
        <p className=" my-0 mb-4 text-light">Area cubierta</p>
        <p className="my-0 mb-2 text-light">WiFi:</p>
        <p className="my-0 mb-2 text-light">Aire Acondicionado:</p>
        <p className="my-0 mb-2 text-light">Estacionamiento:</p>
        <p className="my-0 mb-2 text-light">Lavarropas:</p>
      </div>
      <div className="col-2">
        {/*         <Select
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
        ></Select> */}
        {console.log("roomQty", roomQty)}
        {console.log("propiedad.cantBaños", propiedad.cantBaños)}
        {console.log(
          "roomQty[propiedad.cantBaños]",
          roomQty[propiedad.cantBaños]
        )}
        {/* <Select
          className="comboCss basic-single select mb-2"
          options={optionsStatus}
          value={
            propiedad.estado != -1
              ? propiedad.estado == "ocupado"
                ? optionsStatus[0]
                : optionsStatus[1]
              : ""
          }
          defaultValue={""}
          onChange={(e) => setPropiedad({ ...propiedad, estado: e.value })}
        /> */}
        <Select
          className="comboCss mb-2"
          options={roomQty}
          value={
            propiedad.cantBaños != -1 ? roomQty[propiedad.cantBaños - 1] : ""
          }
          defaultValue={""}
          onChange={(e) => setPropiedad({ ...propiedad, cantBaños: e.value })}
        ></Select>
        {console.log("propiedad.cantCuarto", propiedad.cantCuarto)}
        <Select
          className="comboCss mb-2"
          options={roomQty}
          value={
            propiedad.cantCuarto != -1 ? roomQty[propiedad.cantCuarto - 1] : ""
          }
          defaultValue={""}
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
        {/*         <Form>
          <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="Check this switch"
            checked={propiedad.wifi || false}
            onChange={handleChange}
          />
        </Form> */}
        <input
          name="wifi"
          className="custom-checkbox mb-3"
          type="checkbox"
          checked={propiedad.wifi || false}
          onChange={handleChange}
        />
        <br />
        <input
          name="aire"
          className="custom-checkbox mb-3"
          type="checkbox"
          checked={propiedad.aire || false}
          onChange={handleChange}
        />
        <br />
        <input
          name="estacionamiento"
          className="custom-checkbox mb-3"
          type="checkbox"
          checked={propiedad.estacionamiento || false}
          onChange={handleChange}
        />
        <br />
        <input
          name="lavarropa"
          className="custom-checkbox"
          type="checkbox"
          checked={propiedad.lavarropa || false}
          onChange={handleChange}
        />
      </div>

    </div>
  );

  console.log(detailData);

  return (
    <div className="d-flex flex-column align-items-center ">
      <h2 className="mt-5 mb-5 text-light fw-bold">
        {detailData?.nombre != ""
          ? "Editar Propiedad"
          : "Agregar Propiedad"}
      </h2>
      {renderPageFour()}
    </div>
  );
};

export default AbmPropiedades;
