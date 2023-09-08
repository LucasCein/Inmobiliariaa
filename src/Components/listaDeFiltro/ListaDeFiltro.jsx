import React from "react";
import "../../App.css";
import ElementoListaFiltro from "./ElementoListaFiltro";

const ListaDeFiltro = () => {
  return (
    <div className="d-flex justify-content-start">
      <ElementoListaFiltro text={"uno"} />
      <ElementoListaFiltro text={"dos"} />
      <ElementoListaFiltro text={"tres"} />
      <ElementoListaFiltro text={"cuatro"} />
      <ElementoListaFiltro text={"cinco"} />
    </div>
  );
};

export default ListaDeFiltro;
