import React from "react"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { FaHeart } from 'react-icons/fa'
import { GiReceiveMoney } from 'react-icons/gi'
import contracts from './contracts'

export default class Post extends React.Component {
  constructor(props) {
    super(props)
    // If Public network, required donation for posting is 25
    this.state = {
      currency: 'public',
      amount: 10,
      modalShow: false,
    }
    this.account = this.props.userObj
    this.post = this.props.post
    this.update = this.updateField.bind(this)
  }
  modalShow(show) {
    this.setState({
      modalShow: show
    })
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
    let amount = this.state.amount
    let receipt = {}
    if (amount > 0) {
      receipt = await contracts.transfer(
        this.props.network,  // network
        this.state.currency, // contractType
        this.account.address,  // sender
        this.post.address,  // recipient
        amount
      )
    }
    this.props.donate(this.state.currency, amount, receipt)
    this.post.likes += 1
    this.post.donations += amount
    this.modalShow(false)
  }

  render() {
    let post = this.post
    return (
<Col sm={12} md={6} lg={4} style={{padding: '10px'}}>
<Card style={{ 
  border: '5px solid ' + (post.network === 'public' ? 'lightblue' : 'orange')
}}>
<Card.Header>Post from user: {post.username}</Card.Header>
<Card.Body>
  <Row>
    <Col sm={12}>
      <h4>Network: {post.network}</h4>
      {post.text}
    </Col>
  </Row>
  { post.img && 
  <Row>
    <Col sm={12} style={{display: 'flex', justifyContent: 'center'}}>
      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/00/The_Child_aka_Baby_Yoda_%28Star_Wars%29.jpg/220px-The_Child_aka_Baby_Yoda_%28Star_Wars%29.jpg"
        alt="Post" style={{maxWidth: '100%'}} />
    </Col>
  </Row>
  }
  <Row>
    <Col sm={6}>
      <FaHeart /> {post.likes} Donations
    </Col>
    <Col sm={6}>
      <GiReceiveMoney style={{fontSize: '2em'}}/>{post.donations} Donated
    </Col>
  </Row>
</Card.Body>
<Card.Footer style={{display: 'flex', justifyContent: 'flex-end'}}>
  <Button variant="primary" onClick={() => this.modalShow(true)}>
    <FaHeart /> Donate
  </Button>
</Card.Footer>
</Card>
<Modal show={this.state.modalShow}
  onHide={() => this.modalShow(false)}
>
<Modal.Header closeButton />
<Modal.Body>
  <Form.Group controlId="network">
    <Form.Label style={{width: '100%'}}>
      Choose the Type of Donation:
    </Form.Label>
    <Form.Check type="radio" inline name="currency" id="net1"
      label="EQP (Public ERC20 - All Nodes)"
      value="public"
      onClick={this.update}
      defaultChecked
    />
    <Form.Check type="radio" inline name="currency" id="net2"
      label="EQE (East Coast ERC20)"
      value="east"
      onClick={this.update}
      disabled={!this.props.userObj.east}
    />
  </Form.Group>
  <Form.Group controlId="spend">
    <Form.Label>Amount to Donate</Form.Label>
    <Row className="justify-content-md-center">
      <Col sm={4}>
      <Form.Control type="number" name="amount"
        label="Amount"
        value={this.state.amount.toString()}
        onChange={this.update}
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
</Col>
    )
  }
}
