import { MDBListGroupItem } from "mdb-react-ui-kit";
import Popup from "reactjs-popup";
import { CloseButton } from "react-bootstrap";

const DetalleComp = ({ productos, handleDeleteProduct, handlePriceChange }) => {
  console.log(productos);
  return (
    <>
      {
        /*                 <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Precio</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody><tr>{}</tr></tbody>
                </table> */

        productos?.map(({ id, nombre, descripcion, precio }) => (
          <MDBListGroupItem key={id} className="d-flex justify-content-between">
            <div className="d-flex align-items-center ">
              <div className="d-flex gap-4">
                <div className="ms-3 " style={{ width: "150px" }}>
                  <p className="fw-bold mb-1">Nombre</p>
                  <p className="text-muted mb-0">{nombre}</p>
                </div>
                <div className="ms-3">
                  <p className="fw-bold mb-1" style={{ width: "150px" }}>
                    Descripcion
                  </p>
                  <p className="text-muted mb-0">{descripcion}</p>
                </div>
                <div className="ms-3">
                  <p className="fw-bold mb-1">Precio</p>
                  <input type="number" value={precio} disabled></input>
                  {/* <p className='text-muted mb-0'>${precio}</p> */}
                </div>
                <div className="ms-3">
                  <p className="fw-bold mb-1">Eliminar</p>
                  <CloseButton
                    onClick={() => {
                      handleDeleteProduct(id);
                    }}
                  />
                </div>
              </div>
            </div>
          </MDBListGroupItem>
        ))
      }
    </>
  );
};

export default DetalleComp;
