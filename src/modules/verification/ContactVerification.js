import React, { useState, useContext } from "react";
import {
  Wizard,
  Text,
  Mobileno,
  Email,
  Button,
  Spacer,
  Subtitle,
  Service
} from "rsi-react-components";

import { PartnerContext, ContactContext } from "../../contexts";

const ContactVerification = ({
  title = "Contact Verification",
  onVerify,
  onCancel,
  connection = "epayment",
  visible = true,
  showName = true,
  emailRequired = true
}) => {
  const [partner] = useContext(PartnerContext);
  const [contact, setContact] = useContext(ContactContext);

  if (!visible) return null;

  const verifyEmail = async (contact) => {
    const emailSvc = Service.lookupAsync(
      `${partner.id}:VerifyEmailService`,
      connection
    );
    return emailSvc.invoke("verifyEmail", contact);
  };

  const submitInfo = ({ values, form }, onSuccess) => {
    verifyEmail(values.contact)
      .then((data) => {
        form.change("hiddenCode", data.key);
        onSuccess();
      })
      .catch((err) => {
        onSuccess(false, err);
      });
  };

  const verifyCode = ({ values }, onSuccess) => {
    const { hiddenCode, keycode } = values;
    if (hiddenCode !== keycode) {
      onSuccess(false, "Code is incorrect");
    } else {
      onSuccess();
    }
  };

  const handleSubmit = (values) => {
    values.contact.verified = true;
    setContact(values.contact);
    onVerify(values.contact);
  };

  return (
    <React.Fragment>
      <Subtitle>{title}</Subtitle>
      <Spacer />
      <Wizard
        initialValues={{
          contact: contact,
          hiddenCode: null,
          keycode: null,
          error: null,
          isResendCode: false
        }}
        onSubmit={handleSubmit}
        showErrorDialog={true}
      >
        <Wizard.Page onSubmit={submitInfo} onCancel={onCancel}>
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

        <Wizard.Page onSubmit={verifyCode}>
          <Text
            caption="Email Code"
            placeholder="Enter code sent to your email"
            name="keycode"
            maxLength={6}
            autoFocus={true}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <Button
              caption="Resend Code"
              action={() => setIsResendCode(true)}
              variant="text"
            />
          </div>
        </Wizard.Page>
      </Wizard>
    </React.Fragment>
  );
};

export default ContactVerification;
