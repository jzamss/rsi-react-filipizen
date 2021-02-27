import React, { useState, useEffect } from "react";
import { Service } from "rsi-react-components";

import EmailVerification from "../verification/EmailVerification";
import ContactVerification from '../verification/ContactVerification';
import CheckoutOrder from "./CheckoutOrder";
import OnlinePayment from "./OnlinePayment";

const EPayment = (props) => {
  const { title, component, partner, contact, initialStep=0, cancelPayment } = props;

  const goBack = () => {
    props.history.goBack();
  };

  const updateContact = (contact) => {
    setContact(contact);
    moveNext();
  };

  const moveNext = () => {
    setStep(ps => Math.min(ps + 1, pages.length - 1))
  };

  const movePrevious = () => {
    setStep(ps => Math.max(ps - 1, 0))
  };

  const checkoutOrder = (bill) => {
    setBill(bill);
    if (contact.email) {
      setStep(pages.findIndex(pg => pg.name === "checkout"));
    } else {
      setStep(pages.findIndex(pg => pg.name === "verification"));
    }
  };

  const gotoCheckout = () => {
    setStep(pages.findIndex(pg => pg.name === "checkout"));
  }

  const createPaymentOrder = (payee, onError) => {
    const createPo = async () => {
      const b = { ...bill };
      b.paidby = payee.paidby;
      b.paidbyaddress = payee.paidbyaddress;
      b.email = contact.email;
      b.mobileno = contact.mobileno;
      let svc = Service.lookupAsync(`${partner.id}:EPaymentService`, "epayment");
      let po = await svc.invoke("createPaymentOrder", b);

      const pmtSvc = Service.lookupAsync("CloudPaymentService", "epayment");
      po = await pmtSvc.invoke("getPaymentOrder", { objid: po.objid });
      const payOptions = await pmtSvc.invoke("getPaymentPartnerOptions", {partnerid: po.orgcode});
      return { po, payOptions, partner };
    }

    createPo().then(data => {
      setPo(data.po);
      setPayOptions(data.payOptions);
      moveNext();
    }).catch(err => {
      console.log("ERROR", err)
      onError(err);
    });
  };

  const onCancelBilling = () => {
    if (cancelPayment) {
      cancelPayment();
    } else {
      movePrevious();
    }
  }

  const onCancelEmailVerification = () => {
    setStep(1);
  }

  const onCancelCheckout = () => {
    setStep(1);
  }

  const pages = [
    { name: "verifyemail", title: "Email Verification", component: EmailVerification, actions: {onCancel: goBack, onVerify: updateContact} },
    { name: "billing", title: title, component: component, actions: { onCancel: onCancelBilling, onSubmit: checkoutOrder } },
    { name: "verification", caption: "Email Verification", component: ContactVerification, actions: { movePrevStep: onCancelEmailVerification, moveNextStep: gotoCheckout }},
    { name: "checkout", title: "Checkout Order", component: CheckoutOrder, actions: { onCancel: onCancelCheckout, onSubmit: createPaymentOrder } },
    { name: "payment", title: "Online Payment", component: OnlinePayment, actions: { onCancel: movePrevious, onSubmit: ()=>{} } }
  ];

  const [step, setStep] = useState(initialStep);
  const [page, setPage] = useState(pages[initialStep]);
  const [bill, setBill] = useState();
  const [po, setPo] = useState();
  const [payOptions, setPayOptions] = useState();
  
  useEffect(() => {
    const page = pages[step];
    setPage(page);
  }, [step]);


  const Component = page.component;
  const compProps = { contact, bill, po, payOptions };

  return (
    <Component
      {...props}
      {...compProps}
      {...page.actions}
      page={page}
      initialStep={initialStep}
      emailRequired={true}
    />

  );
};

export default EPayment;
