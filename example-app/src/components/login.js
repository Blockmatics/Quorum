import React from "react"
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: 'east',
      network: 'east',
    }
    this.update = this.updateField.bind(this)
  }
  updateField(event) {
    var value = event.target.value
    var name = event.target.name
    this.setState({ [name]: value })
  }
  async login() {
    // console.log(this.state.user)
    // return
    await this.props.login(this.state.user, this.state.network)
    this.props.close()
    this.setState({
      user: 'east',
      network: 'east',
    })
  }
  render = () => (
<Modal show={this.props.show} onHide={() => this.props.close()}>
<Modal.Header closeButton>
  <Modal.Title>Log In</Modal.Title>
</Modal.Header>
<Modal.Body>
  <Form.Group controlId="user">
    <Form.Label>Choose a User to log in.</Form.Label>
    <Form.Check type="radio" name="user" id="user1"
      label="East Coast User"
      value="east"
      onClick={this.update}
      defaultChecked
    />
    <Form.Check type="radio" name="user" id="user2"
      label="West Coast User"
      value="west"
      onClick={this.update}
    />
  </Form.Group>
  <Form.Group controlId="network">
    <Form.Label>Choose the Local Network to Use</Form.Label>
    <Form.Label className="text-muted">
      (You can access Public Contract from any Node.)
    </Form.Label>
    <Form.Check type="radio" name="network" id="net2"
      label="East Coast (Node 1)"
      value="east"
      onClick={this.update}
      defaultChecked
    />
    <Form.Check type="radio" name="network" id="net1"
      label="West Coast (Node 2)"
      value="west"
      onClick={this.update}
    />
  </Form.Group>
</Modal.Body>
<Modal.Footer>
  <Button onClick={() => {this.login()}}>
    Log In
  </Button>
</Modal.Footer>
</Modal>      
  )
}
