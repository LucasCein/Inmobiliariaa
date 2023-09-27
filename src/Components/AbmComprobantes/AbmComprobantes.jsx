import { Autocomplete, TextField } from "@mui/material";
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../../FireBase/config";
import "@reach/combobox/styles.css";
import Popup from "reactjs-popup";
import { MDBListGroup } from "mdb-react-ui-kit";
import DetalleComp from "../DetalleComp/DetalleComp";
import AbmProds from "../AbmProds/AbmProds";
import "./abmcomprobantes.css";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Table } from "react-bootstrap";
import { CloseButton } from "react-bootstrap";
const AbmComprobantes = () => {
  const db = getFirestore(app);
  const navigate = useNavigate();
  const [comprobante, setComprobante] = useState({
    Fecha: "",
    numSuc: "",
    Tipo: "",
    idProv: "",
    idProp: "",
    pTotal: "",
    idDetalle: "",
    nombrePropiedad: "",
    nombreProveedor: "",
  });
  const [proveedores, setProveedores] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [prods, setProds] = useState([]);
  const [orginialDate, setOriginalDate] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const proveedorCollection = collection(db, "proveedores");
      const proveedorSnapshot = await getDocs(proveedorCollection);
      const proveedorList = proveedorSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProveedores(proveedorList);
      const propiedadCollection = collection(db, "propiedades");
      const propiedadSnapshot = await getDocs(propiedadCollection);
      const propiedadList = propiedadSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPropiedades(propiedadList);
      const prodsCollection = collection(db, "productos");
      const prodsSnapshot = await getDocs(prodsCollection);
      const prodsList = prodsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProds(prodsList);
    };
    fetch();
  }, [db]);

  const handleChangeTipo = (prop) => {
    if (prop.value == "") {
      console.log("Completar datos");
    }
    setComprobante({ ...comprobante, Tipo: prop.value });
  };

  const editDoc = () => {
    const examcollref = doc(db, "comprobantes", comprobante.id);
    updateDoc(examcollref, comprobante)
      .then(() => {
        alert("Updated");
        navigate(0);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const deleteDoc = () => {
    const examcollref = doc(db, "comprobantes", comprobante.id);
    updateDoc(examcollref, { visible: false })
      .then(() => {
        alert("Deleted");
        navigate(0);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const createDetComp = () => {
    const prop = { productos };
    const dbRef = collection(db, "detalleComprobante");
    addDoc(dbRef, prop).then((docRef) => {
      console.log("detalle has been added successfully");
      setComprobante({ ...comprobante, idDetalle: docRef.id });
      createDoc(docRef);
    });
  };

  const createDoc = (idDet) => {
    const prop = {
      ...comprobante,
      visible: true,
      idDetalle: idDet,
      pTotal: precioF,
      pagada: false,
    };
    const dbRef = collection(db, "comprobantes");
    addDoc(dbRef, prop)
      .then(() => {
        console.log("Document has been added successfully");
        navigate(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const optionsType = [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
    { value: "c", label: "C" },
  ];
  const handleChangeProv = async (e) => {
    console.log(e);
    setComprobante({ ...comprobante, idProv: e.id });
  };
  const handleChangeProp = async (e) => {
    console.log(e);
    setComprobante({ ...comprobante, idProp: e.id });
  };

  const handleChangeFecha = async (e) => {
    const partes = e.target.value.split("-");

    const fechaComoTimestamp = Timestamp.fromDate(
      new Date(partes[0], partes[1], partes[2])
    );

    setComprobante({ ...comprobante, Fecha: fechaComoTimestamp });
    setOriginalDate(e.target.value);
  };
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [precioF, setprecioF] = useState(0);
  const handleChangeProducto = (producto) => {
    if (!productos.includes(producto)) {
      setprecioF(precioF + producto.precio);
      setProductoSeleccionado(producto);
      setProductos([...productos, producto]);
      setComprobante({ ...comprobante, pTotal: comprobante.pTotal + precioF });
    }
    console.log("producto", productos);
  };
  const handleChangeSuc = (e) => {
    setComprobante({ ...comprobante, numSuc: e.target.value });
  };

  const handleDeleteProduct = (idProduct) => {
    const newProducts = [...productos];
    const indiceObjetoModificar = newProducts.findIndex(
      (product) => product.id === idProduct
    );
    const newPrice = precioF - productos[indiceObjetoModificar].precio;
    newProducts.splice(indiceObjetoModificar, 1);
    setProductos(newProducts);

    setprecioF(newPrice);
  };

  const handlePriceChange = (idProduct, newPrice) => {
    console.log("entro", idProduct);

    const newProducts = [...productos];
    const indiceObjetoModificar = newProducts.findIndex(
      (product) => product.id === idProduct
    );
    newProducts[indiceObjetoModificar].precio = newPrice;

    setProductos(newProducts);

    console.log("newProducts", newProducts);

    const newFinalPrice = newProducts.reduce(
      (acc, product) => parseInt(acc) + parseInt(product.precio),
      0
    );

    console.log("newFinalPrice", newFinalPrice);

    setprecioF(newFinalPrice);
  };

  console.log(orginialDate);
  return (
    <Container className="containerAbm">
      <div className="containerTitulo">
        <h2>Comprobantes</h2>
      </div>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter email"
              name="Fecha"
              defaultValue={""}
              value={orginialDate}
              onChange={handleChangeFecha}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>N° Sucursal</Form.Label>
            <Form.Control
              placeholder="N° Sucursal"
              value={comprobante.numSuc}
              onChange={handleChangeSuc}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group>
            <div className="d-flex flex-row">
              <div className="me-3 flex-grow-1">
                <Form.Label>Letra</Form.Label>
                <Autocomplete
                  disablePortal={true}
                  defaultValue={""}
                  value={
                    comprobante?.Tipo === "a"
                      ? optionsType[0]
                      : comprobante?.Tipo === "b"
                      ? optionsType[1]
                      : comprobante?.Tipo === "c"
                      ? optionsType[2]
                      : ""
                  }
                  onChange={(event, newValue) => handleChangeTipo(newValue)}
                  options={optionsType}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} sx={{ width: 200 }} />
                  )}
                />
              </div>
              <div className="me-3 flex-grow-1">
                <Form.Label>Proveedor</Form.Label>
                <Autocomplete
                  className="provInp"
                  defaultValue={""}
                  disablePortal={true}
                  value={proveedores.nombre}
                  onChange={(event, newValue) => handleChangeProv(newValue)}
                  options={proveedores}
                  getOptionLabel={(option) => option.nombre || ""}
                  renderInput={(params) => (
                    <TextField {...params} sx={{ width: 200 }} />
                  )}
                />
              </div>
              <div className="me-3 flex-grow-1">
                <Form.Label>Propiedad</Form.Label>
                <Autocomplete
                  className="propInp"
                  defaultValue={""}
                  disablePortal={true}
                  value={propiedades.nombre}
                  onChange={(event, newValue) => handleChangeProp(newValue)}
                  options={propiedades}
                  getOptionLabel={(option) => option.nombre || ""}
                  renderInput={(params) => (
                    <TextField {...params} sx={{ width: 200 }} />
                  )}
                />
              </div>
            </div>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group>
            <Form.Label>Producto</Form.Label>
            <Autocomplete
              id="elemento"
              disablePortal={true}
              defaultValue={""}
              value={productoSeleccionado}
              onChange={(event, newValue) => handleChangeProducto(newValue)}
              options={prods}
              getOptionLabel={(option) => option.nombre || ""}
              renderInput={(params) => (
                <TextField {...params} sx={{ width: 200 }} />
              )}
            />
          </Form.Group>
        </Row>
      </Form>
      <Table striped>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Precio</th>
            <th className="text-center">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>
                <input
                  type="number"
                  value={producto.precio}
                  onChange={(e) =>
                    handlePriceChange(producto.id, e.target.value)
                  }
                ></input>
              </td>
              <td className="text-center">
                {" "}
                <CloseButton
                  onClick={() => {
                    handleDeleteProduct(producto.id);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/*       <MDBListGroup style={{ minWidth: "22rem" }} light>
        <DetalleComp
          productos={productos}
          handleDeleteProduct={handleDeleteProduct}
          handlePriceChange={handlePriceChange}
        />
      </MDBListGroup> */}
      <div className="ms-3">
        <p className="fw-bold mb-1">Precio Total</p>
        <p className="text-muted mb-0">${precioF}</p>
      </div>
      <div className="d-flex justify-content-center gap-4 mt-3 ">
        <button className="btn btn-success" onClick={createDetComp}>
          Agregar
        </button>
        <button className="btn btn-danger" onClick={() => navigate(0)}>
          Cancelar
        </button>
      </div>
      {/* <div className="gridColumn1"></div>
      <div className="gridColumn2"></div>
      <div className="gridColumn3"></div>
      <div className="gridColumn4"></div>
      <div className="gridColumn5"></div>
      <div className="gridColumn6"></div>
      <div className="gridDetalle"></div> */}
    </Container>
  );
};

export default AbmComprobantes;
