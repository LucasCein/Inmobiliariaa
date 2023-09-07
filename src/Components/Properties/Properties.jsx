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

const Properties = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
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
  return (
    <section>
      {isLoading ? (
        <CustomSpinner></CustomSpinner>
      ) : (
        <>
          <div className="mx-auto w-75 " style={{ marginTop: "200px" }}>
            <div className="w-100 h-100">
              <input
                type="text"
                id="buscador"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrar"
                className="w-100 h-200"
              />
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
                    cantBaños: 0,
                    cantCuarto: 0,
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
            <MDBListGroup style={{ minWidth: "22rem" }} light>
              <PropertiesItems
                propiedades={propiedades.filter((propiedad) =>
                  propiedad.nombre.toLowerCase().includes(search.toLowerCase())
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
