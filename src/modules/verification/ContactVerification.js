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
  FormButton,
  useDataContext
} from "rsi-react-components";

import { usePartner } from "../../hooks";

const ContactVerification = ({
  page,
  title = "Contact Verification",
  subtitle = "Email Verification",
  onCancel,
  connection = "epayment",
  visible = true,
  showName = true,
  emailRequired = true,
  moveNextStep
}) => {
  const [ctx, updateCtx] = useDataContext();
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
    updateCtx({ contact: data.contact });
    moveNextStep();
  };

  const setIsResendCode = (args) => {
    const { data, form } = args;
    const callback = (error) => {
      if (!error) {
        window.alert("New verification code sent");
      }
    };
    submitInfo(data, callback, form);
  };

  return (
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
      title={title}
      subtitle={subtitle || (page && page.caption)}
    >
      <Wizard.Page onSubmit={submitInfo} onCancel={onCancel}>
        {showName && (
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
  );
};

export default ContactVerification;
