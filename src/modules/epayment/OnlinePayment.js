import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Error,
  Panel,
  Modal,
  Title,
  Label,
  Spacer,
  Checkbox,
  Group,
  MsgBox,
  Image,
  currencyFormat,
  Service,
  Loading
} from "rsi-react-components";

const OnlinePayment = ({po, error: externalError, payOptions, partner}) => {
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState();
  const [agreed, setAgreed] = useState(false);
  const [openAgreeMsg, setOpenAgreeMsg] = useState(false);
  const [paypartner, setPaypartner] = useState({});

  const postForm = useRef(null);

  useEffect(() => {
    const postForm = document.getElementById("postform");
    if (postForm && paypartner.formaction) {
      postForm.submit();
    }
  }, [paypartner])

  const onSelectPartner = (option) => {
    if (!agreed) {
      setOpenAgreeMsg(true);
    } else {
      setError(null)
      setProcessingPayment(true)
      const svc = Service.lookup("CloudPaymentService", "epayment")
      svc.invoke("getPayPartner", {objid: po.objid, payoption: option.objid}, (err, paypartner) => {
        if (err) {
          if (/syntax/ig.test(err)) {
            setError("Could not contact payment partner. Please try again.");
          } else {
            setError(err)
          }
          setProcessingPayment(false);
        } else {
          setPaypartner(paypartner);
        }
      })
    }
  };

  let fields = [];
  if (paypartner.params) {
    Object.keys(paypartner.params).forEach(key => {
      fields.push([key, paypartner.params[key]]);
    })
  }

  return (
    <React.Fragment>
      <MsgBox
        title="Acknowledgement"
        msg="Kindly acknowledge and confirm with the Terms and Conditions before proceeding."
        open={openAgreeMsg}
        onAccept={() => setOpenAgreeMsg(false)}
      />
      <Modal open={processingPayment} showActions={false}>
        <Panel center={true}>
          <Spacer />
          <label style={{fontSize: 20, fontWeight: 800}}>Contacting Partner</label>
          <label style={{fontSize: 14, opacity: 0.75}}>Kindly wait while we send your payment request to our partner.</label>
          <Loading showMessage={false}/>
          <Spacer />
        </Panel>
      </Modal>
      <Spacer />
      <Panel center={true}>
          <Panel style={styles.poContainer}>
            <Panel center={true}>
              <Title color="green">Your Order</Title>
            </Panel>
            <Spacer />
            <Panel>
              <Label context={partner} caption="Agency" name="title" />
              <Label context={po} caption="Reference No." name="objid" />
              <Label
                context={po}
                caption="Transaction Type"
                name="txntypename"
              />
              <Label context={po} caption="Particulars" name="particulars" />
              <Label context={po} caption="Paid By" name="paidby" />
              <Spacer height={10} />
              <Label caption="Amount">{po && currencyFormat(po.amount)}</Label>
              <Label caption="Web Service Fee">
                {po && currencyFormat(po.webfee)}
              </Label>
              <Label caption="Total">{po && currencyFormat(po.total)}</Label>
            </Panel>
            <Group row style={{ marginTop: 10 }}>
              <Label style={{ color: "blue", paddingRight: 5 }}>Note:</Label>
              <Label style={{ color: "red" }}>
                {po && `Pay on or before ${po.expirydate}`}
              </Label>
            </Group>
            <Checkbox
              checked={agreed}
              onChange={setAgreed}
              style={{ marginRight: 5 }}
              caption={
                <span style={{ fontSize: 14, paddingTop: 8 }}>
                  I acknowledge and agree to the Terms and Conditions of this
                  e-payment facility.
                </span>
              }
            />
            <Spacer height={10} />
          </Panel>
          {!loading && agreed &&
            <React.Fragment>
              <Error msg={error || externalError} />
              <Spacer />
              <Label>Click to choose Type of Payment:</Label>
              <Group row>
                {payOptions &&
                  payOptions.map((option) => {
                    return (
                      <button key={option.paypartnerid} type="submit" style={styles.payButton} onClick={() => onSelectPartner(option)}>
                        <input type="hidden" name="refno" value={po.objid} />
                        <input type="hidden" name="payoption" value={option.objid} />
                        <Image
                          src={`/assets/${option.paypartnerid.toLowerCase()}.png`}
                          width="150"
                          style={{ cursor: "pointer" }}
                        />
                      </button>
                    );
                  })}
              </Group>
            </React.Fragment>
          }
      </Panel>
      {paypartner.isredirect === true ? (
        <form id="postform" method="GET" action={paypartner.formaction} ref={postForm}>
          <input type="hidden" name="id" value={paypartner.id} />
        </form>
      ) : (
        <form id="postform" method="POST" action={paypartner.formaction} ref={postForm}>
            <React.Fragment>
              {fields.map(field => {
                return <input key={field[0]} type="hidden" name={field[0]} value={field[1]} />
              })}
              <input type="hidden" name="orgcode" value="${po.orgcode}" />
            </React.Fragment>
        </form>
      )}
    </React.Fragment>
  );
};

const styles = {
  poContainer: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #aaa",
    borderRadius: 5,
    padding: 15,
    maxWidth: 450,
  },
  payButton: {
    border: "none",
    background: "none"
  },
};

export default OnlinePayment;
