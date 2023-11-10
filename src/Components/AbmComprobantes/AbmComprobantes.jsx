import { Autocomplete, TextField } from "@mui/material";
import {

  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../../FireBase/config";
import "@reach/combobox/styles.css";
import Popup from "reactjs-popup";
import "./abmcomprobantes.css";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Table } from "react-bootstrap";
import { CloseButton } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import Proveedor from "../Proveedor/Proveedor";
import { ProvContext } from "../ProveedorContext/ProveedorContext";
import { useUpdateContext } from "../../Context/updateContext";
import Properties from "../Properties/Properties";
import Productos from "../Productos/Productos"
import AbmProds from "../AbmProds/AbmProds";
import { NumericFormat } from "react-number-format";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const AbmComprobantes = () => {

  const db = getFirestore(app);
  const navigate = useNavigate();
  const [comprobante, setComprobante] = useState({
    Fecha: "",
    Suc: "",
    numComp: "",
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
    const prop = { prodsSelec };
    const dbRef = collection(db, "detalleComprobante");
    addDoc(dbRef, prop).then((docRef) => {
      setComprobante({ ...comprobante, idDetalle: docRef.id });
      createDoc(docRef);

    });

  };

  const createDoc = (idDet) => {
    const prop = {
      ...comprobante,
      idProv: nomProv.idProv,
      idProp: nomProp.idProp,
      visible: true,
      idDetalle: idDet,
      pTotal: precioF,
      pagada: false,
    };
    const dbRef = collection(db, "comprobantes");
    addDoc(dbRef, prop)
      .then(() => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
          title: <strong>Se ha Agregado con Exito!</strong>,
          icon: 'success',
          preConfirm: () => {
            navigate("/bill")
          }
        })
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


  const handleChangeFecha = async (e) => {
    const partes = e.target.value.split("-");

    const fechaComoTimestamp = Timestamp.fromDate(
      new Date(partes[0], partes[1] - 1, partes[2])
    );

    setComprobante({ ...comprobante, Fecha: fechaComoTimestamp });
    setOriginalDate(e.target.value);
  };
  const [prodsSelec, setprodsSelec] = useState([]);
  const [prodsSelecOr, setprodsSelecOr] = useState([]);
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
    setComprobante({ ...comprobante, Suc: e.target.value });
  };
  const handleChangeNumComp = (e) => {
    setComprobante({ ...comprobante, numComp: e.target.value });
  };
  const handleDeleteProduct = (idProduct) => {
    const newProducts = [...prodsSelec];
    const indiceObjetoModificar = newProducts.findIndex(
      (product) => product.id === idProduct
    );
    const newPrice = precioF - prodsSelec[indiceObjetoModificar].precio;
    newProducts.splice(indiceObjetoModificar, 1);
    setprodsSelec(newProducts);

    setprecioF(newPrice);
  };

  const handlePriceChange = (idProduct, newPrice) => {
    console.log("entro", idProduct);

    const newProducts = [...prodsSelec];
    const indiceObjetoModificar = newProducts.findIndex(
      (product) => product.id === idProduct
    );
    newProducts[indiceObjetoModificar].precio = newPrice;

    setprodsSelec(newProducts);

    console.log("newProducts", newProducts);

    const newFinalPrice = newProducts.reduce(
      (acc, product) => parseInt(acc) + parseInt(product.precio),
      0
    );

    console.log("newFinalPrice", newFinalPrice);

    setprecioF(newFinalPrice);
  };
  useEffect(() => {
    console.log(prodsSelec)
    let aux = 0
    prodsSelec.forEach((p) => {
      aux = parseInt(aux) + parseInt(p.precio)
    })
    setprecioF(aux)
  }, [prodsSelec])
  console.log(orginialDate);
  // const value=useContext(ProvContext)
  // console.log(value)
  const [nomProv, setNomProv] = useState()
  const [nomProp, setNomProp] = useState()
  const [nomProd, setNomProd] = useState()

  const [openModal, setOpenModal] = useState(false)
  const [modalProp, setModalProp] = useState(false)
  console.log(nomProv?.idProv)
  const handleChangeProv = async (e) => {
    console.log(e);
    setComprobante({ ...comprobante, idProv: nomProv.idProv });
  };
  const handleChangeProp = async (e) => {
    console.log(e);
    setComprobante({ ...comprobante, idProp: nomProp.idProp });
  };
  console.log(prodsSelec)

  return (
    <Container className="containerAbm">
      <div className="containerTitulo text-white">
        <h2>Comprobantes</h2>
      </div>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label className="text-white">Fecha</Form.Label>
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
            <Form.Label className="text-white">Sucursal</Form.Label>
            <Form.Control
              placeholder="Sucursal"
              value={comprobante.Suc}
              onChange={handleChangeSuc}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label className="text-white">Numero</Form.Label>
            <Form.Control
              placeholder="Numero"
              value={comprobante.numComp}
              onChange={handleChangeNumComp}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group>
            <div className="d-flex flex-row">
              <div className="me-3 flex-grow-1">
                <Form.Label className="text-white">Letra</Form.Label>
                <Autocomplete
                  style={{ backgroundColor: 'white', width: "200px" }}
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
              <div className="me-3 flex-grow-1 ">
                <Form.Label className="text-white">Proveedor</Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    className="w-50 "
                    placeholder="Nombre Proveedor"
                    value={nomProv?.nomProv}
                    disabled
                    readOnly
                    onChange={handleChangeProv}
                  />
                  <Popup open={openModal} className='popPupCompb' trigger={<button onClick={() => setOpenModal(true)} type="button" className="btn btn-success"><BsSearch></BsSearch></button>} modal>
                    {close => <Proveedor forSelect={"forSelect"} setNomProv={setNomProv} close={close}></Proveedor>}
                  </Popup>
                </div>
                {/* <Autocomplete
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
                /> */}
              </div>
              <div className="me-3 flex-grow-1 overflow-auto">
                <Form.Label className="text-white">Propiedad</Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    className="w-50"
                    placeholder="Nombre Propiedad"
                    value={nomProp?.nomProp}
                    disabled
                    readOnly
                    onChange={handleChangeProp}
                  />
                  <Popup open={modalProp} className='popPupCompb' trigger={<button onClick={() => setOpenModal(true)} type="button" className="btn btn-success" ><BsSearch></BsSearch></button>} modal>
                    {close => <Properties forSelect={"forSelect"} setNomProp={setNomProp} close={close}></Properties>}
                  </Popup>
                </div>
              </div>
            </div>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group>
            <Form.Label className="text-white mt-2">Producto</Form.Label>
            <div className="d-flex gap-1 w-25">
              <Form.Control
                className=""
                placeholder="Producto"
                value={nomProd?.nomProd}
                disabled
                readOnly
              />
              <Popup open={openModal} className='popPupCompb' trigger={<button onClick={() => setOpenModal(true)} type="button" className="btn btn-success"><BsSearch></BsSearch></button>} modal>
                {close => <Productos forSelect={"forSelect"} setNomProd={setNomProd} setOpenModal={setOpenModal} setprodsSelec={setprodsSelec} prodsSelec={prodsSelec} close={close}></Productos>}
              </Popup>

              <Popup trigger={<button type="button" className="btn btn-success w-75">Add New</button>} modal>
                {close => <AbmProds close={close}></AbmProds>}
              </Popup>

            </div>
          </Form.Group>
        </Row>
      </Form>
      <Table striped className="bg-white">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Precio</th>
            <th className="text-center">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {prodsSelec.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>
                {/* <input
                  type="number"
                  value={producto.precio}
                  onChange={(e) =>
                    handlePriceChange(producto.id, e.target.value)
                  }
                ></input> */}
                <NumericFormat
                  value={parseFloat(producto.precio)}
                  thousandSeparator={true}
                  prefix={"$"}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  onValueChange={(values) => {
                    const { formattedValue, value } = values;
                    handlePriceChange(producto.id, value) // 1234.56
                  }}
                  style={{ textAlign: "right" }}
                />
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
        <p className="fw-bold mb-1 text-white">Precio Total</p>
        <p className="text-white mb-0 ">{precioF.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}</p>
      </div>
      <div className="d-flex justify-content-center gap-4 mt-1 mb-5  ">
        <button className="btn btn-success h-50" onClick={createDetComp}>
          Agregar
        </button>
        <button className="btn btn-danger h-50" onClick={() => navigate('/bill')}>
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
