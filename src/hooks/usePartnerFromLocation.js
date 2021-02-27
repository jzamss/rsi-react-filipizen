import { useState, useEffect } from "react";
import { getPartnerFromLocation } from "./util";

/* Returns partner from a location */
const usePartnerFromLocation = (location) => {
  const [partner, setPartner] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    let partner = location && location.state ? location.state.partner : null;
    if (partner) {
      setPartner(partner);
    } else {
      setError(null);
      getPartnerFromLocation(location)
        .then((partner) => {
          setPartner(partner);
        })
        .catch((err) => setError(err));
    }
  }, [location]);

  return [partner, setPartner, error];
};

export default usePartnerFromLocation;
