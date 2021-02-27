import { useContext } from "react";
import PartnerContext from "./PartnerContext";

const usePartner = () => {
  return useContext(PartnerContext);
};

export default usePartner;
