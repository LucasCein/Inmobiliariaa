import { MDBBadge, MDBListGroupItem } from "mdb-react-ui-kit";
import { useState } from "react";
import Popup from "reactjs-popup";
import AbmPropiedades from "../AbmPropiedades/AbmPropiedades";
import { useNavigate } from "react-router-dom";
import { BsPencil } from "react-icons/bs";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../FireBase/config";
import { BsTrash } from "react-icons/bs";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const PropertiesItems = ({
  propiedades,
  forSelect,
  setNomProp,
  setModalProp,
  close,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentItems = propiedades.slice(startIndex, endIndex);

  const navigate = useNavigate();
  const db = getFirestore(app);

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(propiedades.length / itemsPerPage);
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  };

  const deleteDoc = (id) => {
    console.log(id)
    const examcollref = doc(db, 'propiedades', id)
    updateDoc(examcollref, { visible: false }).then(() => {
      const MySwal = withReactContent(Swal)

      MySwal.fire({
        title: <strong>Se ha eliminado con Exito!</strong>,
        icon: 'success',
        preConfirm: () => {
          navigate(0)
        }
      })
    }).catch(error => {
      console.log(error.message)
    })
  }
  const nav = useNavigate()
  return (
    <>
      {currentItems.map(
        ({
          id,
          nombre,
          descripcion,
          estado,
          tipo,
          pais,
          region,
          cp,
          calle,
          altura,
          piso,
          dpto,
          cantBaños,
          cantCuarto,
          area,
          wifi,
          aire,
          estacionamiento,
          lavarropa,
          imagen,
          precio
        }) => (
          <MDBListGroupItem
            key={id}
            className="container align-items-center justify-content-center"
          >
            <div className="row ">
              <div className="col">
                <img
                  src={imagen || "https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg"}
                  alt={imagen}
                  style={{ width: "80px", height: "80px", marginLeft: "10px" }}
                  className="rounded-circle"
                />
              </div>
              <div className="col ms-4">
                <p className="mb-0 text-dark">{nombre}</p>
              </div>
              <div className="col ms-5">
                <p className="mb-0 text-dark">{descripcion}</p>
              </div>
              <div className="col ms-5">
                <p className="mb-0 text-dark">{tipo}</p>
              </div>
              <div className="col ms-5">
                <p className="mb-0 text-dark">{precio.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}</p>
              </div>
              <div className="col ms-5">
                <p className="mb-0 text-dark">{estado}</p>
              </div>

              {forSelect == "" ? (
                <div className="col d-flex align-items-center">
                  <button className="btn btn-warning ms-5" onClick={() => nav("/AbmPropiedades", { state: { detailData: { id, nombre, descripcion, estado, tipo, pais, region, cp, calle, altura, piso, dpto, cantBaños, cantCuarto, area, wifi, aire, estacionamiento, lavarropa, imagen, precio } } })}>
                    <BsPencil></BsPencil>
                  </button>
                  {/* <Popup
                    trigger={
                      <button className="btn btn-warning ms-5">
                        <BsPencil></BsPencil>
                      </button>
                    }
                    modal
                  >
                    <AbmPropiedades
                      propiedad={{
                        id,
                        nombre,
                        descripcion,
                        estado,
                        tipo,
                        pais,
                        region,
                        cp,
                        calle,
                        altura,
                        piso,
                        dpto,
                        cantBaños,
                        cantCuarto,
                        area,
                        wifi,
                        aire,
                        estacionamiento,
                        lavarropa,
                        imagen,
                        precio
                      }}
                      status={"edit"}
                    ></AbmPropiedades>
                  </Popup> */}
                  <button className="btn btn-danger ms-2" onClick={() => deleteDoc(id)}>
                    <BsTrash></BsTrash>
                  </button>
                </div>
              ) : (<div className="col d-flex align-items-center justify-content-end me-5">
                <button
                  onClick={() => {
                    setNomProp({ nomProp: nombre, idProp: id }), close();
                  }}
                  className="btn btn-success"
                >
                  Seleccionar
                </button>
              </div>)}

            </div>

            {/* <div className="d-flex flex-row align-items-center gap-5">
              <img
                src={imagen}
                alt={imagen}
                style={{ width: "80px", height: "80px", marginLeft: "10px" }}
                className="rounded-circle"
              />
              <div className="ms-3 d-flex flex-row gap-3">
                <p className="fw-bold mb-1">{nombre}</p>
                <p className="text-muted mb-0">{descripcion}</p>
              </div>
            </div>
            {forSelect == "" ? (
              <div className="d-flex align-items-center gap-3">
                <Popup
                  className="w-100"
                  trigger={
                    <button className="btn btn-warning ">
                      <BsPencil></BsPencil>
                    </button>
                  }
                  modal
                >
                  <AbmPropiedades
                    propiedad={{
                      id,
                      nombre,
                      descripcion,
                      estado,
                      tipo,
                      pais,
                      region,
                      cp,
                      calle,
                      altura,
                      piso,
                      dpto,
                      cantBaños,
                      cantCuarto,
                      area,
                      wifi,
                      aire,
                      estacionamiento,
                      lavarropa,
                      imagen,
                    }}
                    status={"edit"}
                  ></AbmPropiedades>
                </Popup>

                <MDBBadge
                  pill
                  light
                  color={estado == "ocupado" ? "danger" : "success"}
                  className="me-5"
                >
                  {estado}
                </MDBBadge>
              </div>
            ) : (
              <div className="col d-flex align-items-center justify-content-end me-5">
                <button
                  onClick={() => {
                    setNomProp({ nomProp: nombre, idProp: id }), close();
                  }}
                  className="btn btn-success"
                >
                  Seleccionar
                </button>
              </div> 
            )}*/}
          </MDBListGroupItem>
        )
      )}
      <div className="d-flex flex-column align-items-center">
        <p>
          <button
            style={{ margin: "5px" }}
            className="btn btn-secondary"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            style={{ margin: "5px" }}
            className="btn btn-secondary"
            onClick={handleNextPage}
            disabled={endIndex >= propiedades.length}
          >
            Next
          </button>
        </p>
      </div>
    </>
  );
};

export default PropertiesItems;
