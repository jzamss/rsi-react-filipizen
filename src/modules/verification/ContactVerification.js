import React, { useState, useRef, useContext } from "react";
import {
  Wizard,
  Card,
  Panel,
  Text,
  Mobileno,
  Email,
  ActionBar,
  Button,
  Error,
  Spacer,
  Subtitle,
  BackLink,
  Title,
  MsgBox,
  Service
} from "rsi-react-components";

import { PartnerContext, UserContext } from "../../contexts";

const ContactVerification = ({
  module,
  title,
  subtitle = "Contact Verification",
  onVerify,
  onCancel,
  connection = "epayment",
  visibleWhen = true,
  showName = true,
  emailRequired = true
}) => {
  const [partner] = useContext(PartnerContext);
  const [contact, setContact] = useContext(UserContext);
  const [error, setError] = useState();
  const formRef = useRef();

  if (!visibleWhen) return null;

  const verifyEmail = async () => {
    const emailSvc = Service.lookupAsync(
      `${partner.id}:VerifyEmailService`,
      connection
    );
    return emailSvc.invoke("verifyEmail", {
      email: contact.email,
      mobileno: contact.mobileno
    });
  };

  const submitInfo = ({ form, values }) => {
    console.log("PASS");
    return true;
    // if (!formRef.current.reportValidity()) return;
    // if (!contact.email && !contact.mobileno) {
    //   setError("Please specify email or Mobile No.");
    //   return;
    // }
    // setError(null);
    // setVerifying(true);
    // verifyEmail()
    //   .then((data) => {
    //     setHiddenCode(data.key);
    //     setVerifying(false);
    //   })
    //   .catch((err) => {
    //     setError(err);
    //     setVerifying(false);
    //   });
  };
  const handleSubmit = (values) => {
    console.log("submit ", values);
  };

  const moduleTitle = (module && module.title) || title || null;

  return (
    <Card>
      {moduleTitle && <Title>{moduleTitle}</Title>}
      <Subtitle>{subtitle}</Subtitle>
      <Spacer />
      <Error msg={error} />
      <Wizard
        initialValues={{
          contact: contact,
          hiddenCode: null,
          keCcode: null,
          error: null,
          isResendCode: false
        }}
        onSubmit={handleSubmit}
      >
        <Wizard.Page
          validate={({ contact }) => {
            const errors = { contact: {} };
            if (!contact.name) errors.contact.name = "Required";
            if (!contact.address) errors.contact.address = "Required";
            return errors;
          }}
          onSubmit={submitInfo}
        >
          {showName === true && (
            <React.Fragment>
              <Text
                caption="Full Name"
                name="contact.name"
                autoFocus={true}
                required={true}
              />
              <Text caption="Address" name="contact.address" required={true} />
            </React.Fragment>
          )}
          <Email
            name="contact.email"
            required={emailRequired}
            autoFocus={!showName}
          />
          <Mobileno name="contact.mobileno" />
        </Wizard.Page>
        <Wizard.Page>
          <h1>Validation</h1>
        </Wizard.Page>
        <Wizard.Page>
          <h1>Confirmation</h1>
        </Wizard.Page>
      </Wizard>
    </Card>
  );
};

export default ContactVerification;
