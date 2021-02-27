import React, { useState, useEffect } from "react";
import {
  Form,
  Card,
  Panel,
  Spacer,
  Button,
  Title,
  Content,
  Submit,
  Text,
  ActionBar,
  currencyFormat,
  MsgBox,
} from "rsi-react-components";

const CheckoutOrder = ({ onCancel, onSubmit, bill }) => {
  const [error, setError] = useState();
  const [showMsg, setShowMsg] = useState(false);

  const confirmCallback = (error) => {
    if (error) {
      setError(error);
      setShowMsg(true);
    }
  }

  const confirmOrder = (bill) => {
    setShowMsg(false);
    setError(null);
    const payee = {paidby: bill.paidby, paidbyaddress: bill.paidbyaddress}
    onSubmit(payee, confirmCallback);
  }

  return (
    <Form initialData={bill} onSubmit={confirmOrder}>
      <Card>
        <Panel style={{maxWidth: 400}}>
          <Content center>
            <Title>Confirm Transaction</Title>
            <Spacer />
            <label style={{ ...styles.text }}>
              Please confirm and fill up name and address of the payer for your
              electronic official receipt and click Continue to proceed for payment.
            </label>
            <Spacer />
          </Content>
          <Panel>
            <Text name="paidby" caption="Paid By Name" required={true} autoFocus={true} />
            <Text name="paidbyaddress" caption="Paid By Address" required={true} />
          </Panel>
          <Spacer />
          <Panel style={styles.infoContainer}>
            <div style={{...styles.infoContainer, ...{alignItems: "center"}}}>
              <label>Payment Details</label>
              <h4>{bill.paymentdetails}</h4>
            </div>
            <div style={styles.amountContainer}>
              <label style={styles.amount}>Php {currencyFormat(bill.amount)}</label>
            </div>
          </Panel>
          <Spacer />
          <MsgBox
            open={showMsg}
            title="Error"
            onAccept={() => setShowMsg(false)}
            msg={`An error was encountered when processing your order. Please try again later or contact LGU for assistance.`} />
          <ActionBar>
            <Button variant="text" caption="Back" action={onCancel} />
            <Submit caption="Continue" />
          </ActionBar>
        </Panel>
      </Card>
    </Form>
  )
};

const styles ={
text: {
  display: "block",
  textAlign: "center"
},
infoContainer: {
  display: "flex",
  flexDirection: "column",
},
amountContainer: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid #aaa",
},
amount: {
  fontSize: 24,
  fontWeight: 800,
  padding: 10,
}
}

export default CheckoutOrder;
