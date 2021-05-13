import React, { useState, useEffect } from "react";
import {
  Card,
  Item,
  Panel,
  Radio,
  Content,
  Label,
  Image,
  ActionBar,
  BackLink,
  Button,
  Spacer,
  currencyFormat
} from "rsi-react-components";

const GCASH_FEE = 10.0;
const RAMESES_FEE = 20.0;

const GCashCheckout = ({ po, onCancel, onCheckout }) => {
  const [payType, setPayType] = useState("wallet");
  const [txnFee, setTxnFee] = useState(GCASH_FEE + RAMESES_FEE);

  const handleCheckout = () => {
      onCheckout({type: payType, fee: txnFee})
  }

  return (
    <Card style={{minWidth: "400px"}}>
      <Content center>
        <Image
          src={`/assets/gcash.png`}
          width="150"
          style={{ cursor: "pointer" }}
        />
      </Content>
      <div style={styles.paymentTypeContainer}>
        <h3 labelStyle={styles.label}>Payment Details</h3>
      </div>
      <Spacer />
    <Panel row style={styles.row}>
        <Label labelStyle={styles.label}>Amount</Label>
        <Label labelStyle={styles.label}>{`PHP ${currencyFormat(po.amount)}`}</Label>
      </Panel>
      <Panel row style={styles.row}>
        <Label labelStyle={styles.label}>Convenience Fee</Label>
        <Label labelStyle={styles.label}>{`PHP ${currencyFormat(GCASH_FEE)}`}</Label>
      </Panel>
      <Panel row style={styles.row}>
        <Label labelStyle={styles.label}>Web Service Fee</Label>
        <Label labelStyle={styles.label}>{`PHP ${currencyFormat(RAMESES_FEE)}`}</Label>
      </Panel>
      <Panel row style={styles.row}>
        <Label labelStyle={styles.label}>Sub-Total</Label>
        <Label labelStyle={styles.label}>{`PHP ${currencyFormat(po.amount + txnFee)}`}</Label>
      </Panel>
      <ActionBar>
        <BackLink caption="Cancel" action={onCancel} />
        <Button caption="Proceed Payment" action={handleCheckout} />
      </ActionBar>
    </Card>
  );
};

const styles = {
    paymentTypeContainer: {
        display: "flex",
        justifyContent: "center",
        width: "400px",
    },
    paymentType: {
        paddingLeft: 20,
    },
    label: {
        fontWeight: "bold",
        textAlign: "right"
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
}

export default GCashCheckout;
