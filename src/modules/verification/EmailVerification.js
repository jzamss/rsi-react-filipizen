import React from "react";
import ContactVerification from "./ContactVerification";

const EmailVerification = ({
  page,
  title,
  subtitle = "Contact Verification",
  onVerifyContact,
  onCancel,
  connection = "epayment",
  visible = true,
  emailRequired = true,
  moveNextStep
}) => {
  return (
    <ContactVerification
      page={page}
      title="Email Verification"
      subtitle={subtitle}
      onVerifyContact={onVerifyContact}
      onCancel={onCancel}
      connection={connection}
      visible={visible}
      showName={false}
      emailRequired={emailRequired}
      moveNextStep={moveNextStep}
    />
  );
};

export default EmailVerification;
