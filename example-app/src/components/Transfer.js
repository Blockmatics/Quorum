
import React from "react"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
// import contracts from './contracts'

export default class Transfer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 50,
    }
    this.account = this.props.userObj
  }
  updateField(event) {
    var name = event.target.name
    var value = event.target.value
    if (name === 'amount') {
      value = Number(value)
    } 
    this.setState({ [name]: value })
  }
  async donate() {
    let account = this.props.userObj
    let amount = this.state.amount
    let receipt = {}
    if (amount > 0) {
      receipt = await this.props.contracts.transfer(
        'east',  // network
        'east',  // contractType
        account.address,  // sender
        '0xae9bc6cd5145e67fbd1887a5145271fd182f0ee7',  // recipient
        amount
      )
    }
    this.props.transfer('east', amount, receipt)
    this.props.close()
  }
  render = () => (
<Modal show={this.props.show}
  onHide={() => this.props.close()}
>
<Modal.Header closeButton />
<Modal.Body>
  <Form.Group controlId="network">
    <Form.Label style={{width: '100%'}}>
      Choose the Contact You want to Send To:
    </Form.Label>
    <Form.Check type="radio" name="currency" id="net1"
      label="Bradley"
      value="bradley"
      defaultChecked
    />
    <Form.Check type="radio" name="currency" id="net2"
      label="Add New"
      value="new"
      disabled={true}
    />
  </Form.Group>
  <Form.Group controlId="spend">
    <Form.Label>Amount to Send</Form.Label>
    <Row className="justify-content-md-center">
      <Col sm={4}>
      <Form.Control type="number" name="amount"
        label="Amount"
        value={this.state.amount.toString()}
        onChange={this.updateField.bind(this)}
        style={{ textAlign: 'right' }}
      />
      </Col>
    </Row>
  </Form.Group>
</Modal.Body>
<Modal.Footer>
  <Button onClick={() => this.donate()}>
    Submit
  </Button>
</Modal.Footer>
</Modal>

  )  
}