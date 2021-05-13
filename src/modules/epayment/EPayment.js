import React from "react";
import { PageFlow, Service, useDataContext } from "rsi-react-components";

import EmailVerification from "../verification/EmailVerification";
import ContactVerification from '../verification/ContactVerification';
import CheckoutOrder from "./CheckoutOrder";
import OnlinePayment from "./OnlinePayment";

const pages = [
  // { name: "verifyemail", caption: "Email Verification", component: EmailVerification },
  // { name: "verification", caption: "Contact Verification", component: ContactVerification },
  { name: "checkout", caption: "Checkout Order", Component: CheckoutOrder },
  { name: "payment", caption: "Online Payment", Component: OnlinePayment }
];


const EPayment =  ({ title, partner, moveNextStep, movePrevStep }) => {
  const [ctx] = useDataContext();
  
  return (
    <PageFlow
      title={title}
      initialData={ctx}
      partner={partner}
      pages={pages}
    />
  );
};

export default EPayment;
