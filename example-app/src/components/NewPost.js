import React from "react"
import uuid from 'uuid'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import contracts from './contracts'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    // If Public network, required donation for posting is 25
    this.state = {
      text: '',
      network: 'public',
      required: 25,
    }
    this.update = this.updateField.bind(this)
  }
  updateField(event) {
    var value = event.target.value
    var name = event.target.name
    this.setState({ [name]: value })
    if (name === 'network') {
      this.setState({
        required: value === 'public' ? '25' : '0'
      })
    }
  }
  /**
   * Call the transfer transaction for public network so a fee can be collected
   * Create the post data, send it back to the main posts.
   */
  async submitPost() {
    let amount = 0
    let receipt = {}
    if (this.state.network === 'public') {
      amount = 25
      receipt = await contracts.transfer(
        this.props.network,
        this.state.network, // contractType
        this.props.userObj.address,  // sender
        'network',  // recipient
        amount
      )
    }
    let post = {
      network: this.state.network,
      id: uuid.v4(),
      address: this.props.userObj.address,
      username: this.props.userObj.username,
      text: this.state.text,
      likes: 0,
      donations: 0,
    }
    await this.props.submit(post, amount, receipt)
    this.props.close()
    this.setState({
      text: '',
    })
  }
  render = () => (
<Modal show={this.props.show} onHide={() => this.props.close()}>
<Modal.Header closeButton>
  <Modal.Title>Create a Post</Modal.Title>
</Modal.Header>
<Modal.Body>
  <Form.Group controlId="text">
    <Form.Label>
      Share information to the community. Or request donations for a cause.
    </Form.Label>
    <Form.Control as="textarea" size="md" rows="4"
      name="text"
      placeholder="Start typing"
      onChange={this.update}
    />
  </Form.Group>
  <Form.Group controlId="network">
    <Form.Label style={{width: '100%'}}>
      Choose the Network to Post to
    </Form.Label>
    <Form.Check type="radio" inline name="network" id="net1"
      label="Public (All Nodes)"
      value="public"
      onClick={this.update}
      defaultChecked
    />
    <Form.Check type="radio" inline name="network" id="net2"
      label="East Coast (Node 1)"
      value="east"
      onClick={this.update}
      disabled={!this.props.userObj.east} // Registered east ndoe
    />
    <Form.Label className="text-muted">
      Posting to public network costs a fee of 25 EQP.<br/>
      Posting to East Coast Node (Node1) is free for registered East users.
    </Form.Label>
  </Form.Group>
    <Form.Group controlId="spend">
      <Form.Label>Amount to Spend on Post</Form.Label>
      <Row className="justify-content-md-center">
        <Col sm={4}>
        <Form.Control type="number" name="required"
          label="Fee"
          value={this.state.required.toString()}
          disabled
          style={{ textAlign: 'right' }}
        />
        </Col>
      </Row>
      </Form.Group>
</Modal.Body>
<Modal.Footer>
  <Button onClick={() => this.submitPost()}>
    Submit
  </Button>
</Modal.Footer>
</Modal>
  )
}
