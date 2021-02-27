import React from "react";
import {
  Card,
  Text,
  Mobileno,
  Email,
  Title,
  Subtitle,
  Service,
  Wizard,
  FormButton
} from "rsi-react-components";

import { usePartner } from "../../hooks";

const ContactVerification = ({
  page,
  title,
  subtitle = "Contact Verification",
  onVerifyContact: onVerify,
  onCancel,
  connection = "epayment",
  visible = true,
  showName = true,
  emailRequired = true,
  moveNextStep
}) => {
  const [partner] = usePartner();

  if (!visible) return null;
  
  const verifyEmail = async (contact) => {
    const emailSvc = Service.lookupAsync(
      `${partner.id}:VerifyEmailService`,
      connection
    );
    return emailSvc.invoke("verifyEmail", contact);
  };

  const submitInfo = (data, onError, form) => {
    verifyEmail(data.contact)
      .then((data) => {
        form.change("hiddenCode", data.key);
        onError(false);
      })
      .catch((err) => {
        onError(err);
      });
  };

  const verifyCode = (data, onError) => {
    const { hiddenCode, keycode } = data;
    if (hiddenCode !== keycode) {
      onError("Code is incorrect");
    } else {
      onError(false);
    }
  };

  const handleSubmit = (data) => {
    data.contact.verified = true;
    if (onVerify) {
      onVerify(data.contact);
    }
    moveNextStep();
  };

  const setIsResendCode = (args) => {
    const { data, form } = args;
    const callback = (error) => {
      if (!error) {
        window.alert("New verification code sent");
      }
    }
    submitInfo(data, callback, form)
  }

  return (
    <Card>
      <Title>{title}</Title>
      <Subtitle>{subtitle || page && page.caption}</Subtitle>
      <Wizard
        initialData={{
          contact: {},
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
            <FormButton
              caption="Resend Code"
              action={(args) => setIsResendCode(args)}
              variant="text"
            />
          </div>
        </Wizard.Page>
      </Wizard>
    </Card>
  );
};

export default ContactVerification;
