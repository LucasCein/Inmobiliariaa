import { useState } from "react";

export const useUpdateContext = () => {
    const [value, setValue] = useState({nomProv:"",idProv:""});
    console.log(value)
    const updateValue = ({newValue}) => {
      setValue(newValue);
    };
    return ([value, updateValue] );
  };