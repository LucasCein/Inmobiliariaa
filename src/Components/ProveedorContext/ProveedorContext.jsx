import { createContext, useRef, useState } from "react";
import { useUpdateContext } from "../../Context/updateContext";



export const ProvContext= createContext()
export const MyProvider = ({ children }) => {
  const [value, setValue] = useState()
  const ref =useRef(value)
    return (
        <ProvContext.Provider value={{ref,setValue}}>
          {children}
        </ProvContext.Provider>)
}