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
  currencyFormat,
  Form,
  OnFieldChange
} from "rsi-react-components";

const MDR = 0.015;
const WALLET_FEE = 10.0;
const RAMESES_FEE = 20.0;

const payTypeList = [
  { label: "Wallet", value: "wallet" },
  { label: "Credit/Debit Card", value: "card" },
];


const PaymayaCheckout = ({ po, onCancel, onCheckout }) => {
  const [payType, setPayType] = useState("wallet");
  const [txnFee, setTxnFee] = useState(0.0);

  useEffect(() => {
    if (payType === "wallet") {
      setTxnFee(WALLET_FEE + RAMESES_FEE);
    } else {
      const paymayaFee = Math.round((po.amount / (1 - MDR) - po.amount) * 100) / 100;
      setTxnFee(paymayaFee + RAMESES_FEE);
    }
  }, [payType]);

  const handleCheckout = () => {
      onCheckout({type: payType, fee: txnFee})
  }

  const onChangePayType = (payType) => {
    setPayType(payType);
  }

  return (
    <Form initialData={{payType: "wallet"}}>
      <Card style={{minWidth: "400px"}}>
        <Content center>
          <Image
            src={`/assets/paymaya.png`}
            width="150"
            style={{ cursor: "pointer" }}
          />
        </Content>
        <Spacer />
        <div style={styles.paymentTypeContainer}>
          <Label labelStyle={styles.label}>Select Type of Payment</Label>
          <div style={styles.paymentType}>
            <Radio
                name="payType"
                caption=""
                data={payTypeList}
                listener={onChangePayType}
              />
              {/* <Radio name="payType" value={payType} onChange={setPayType}>
                  <Item caption="Wallet" value="wallet" />
                  <Item caption="Credit/Debit Card" value="card" />
              </Radio> */}
          </div>
        </div>

        <Spacer />
        <Panel row style={styles.row}>
          <Label labelStyle={styles.label}>Amount</Label>
          <Label labelStyle={styles.label}>{`PHP ${currencyFormat(po.amount)}`}</Label>
        </Panel>
        <Panel row style={styles.row}>
          <Label labelStyle={styles.label}>Convenience Fee</Label>
          <Label labelStyle={styles.label}>{`PHP ${currencyFormat(txnFee)}`}</Label>
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
      <OnFieldChange name="payType" onChange={(value, previous) => console.log("PAYTYPE", value) } />
    </Form>
  );
};

const styles = {
    paymentTypeContainer: {
        display: "flex",
        flexDirection: "column",
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

export default PaymayaCheckout;
