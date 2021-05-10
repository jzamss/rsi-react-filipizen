import React from "react";
import ContactVerification from "./ContactVerification";

const EmailVerification = ({
  page,
  title,
  subtitle,
  onCancel,
  connection,
  visible,
  emailRequired,
  moveNextStep
}) => {
  return (
    <ContactVerification
      page={page}
      title={title}
      subtitle={subtitle}
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
