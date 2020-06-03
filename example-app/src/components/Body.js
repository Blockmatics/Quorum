/**
 * Show a wallet card w/ token balacnes at the top of all content.
 * Show "Posts/shares" cards as the main body content.
 */
import React from "react"
import uuid from 'uuid'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import contracts from './contracts'
import db from './data'
import Post from './Post'
import NewPost from './NewPost'
import Transfer from './Transfer'

export default class Body extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userObj: {},
      registeredPublic: false,
      registeredEast: false,
      balancePublic: 0,
      balanceEast: 0,
      balanceWest: 0,
      totalSupplyPublic: 0,
      totalSupplyEast: 0,
      totalSupplyWest: 0,
      /* Interactive state: */
      receiptAlert: false,
      receipt: '',
      newPost: false,
      transferModal: false,
    }
    this.unregister = this.unregister.bind(this)
  }
  async componentDidMount() {
    let account = db.db.accounts[this.props.user]
    this.setState({
      userObj: account,
      registeredPublic: !!account.public,
      registeredEast: !!account.east,
    })
    this.account = account
    /* pull contract data for Public */
    let balancePublic = await contracts.getBalance(account.address, 'public')
    let totalSupplyPublic = await contracts.getTotalSupply('public')
    this.setState({ totalSupplyPublic })
    if (account.public || balancePublic) {
      this.setState({
        registeredPublic: true,
        balancePublic,
      })
      db.register(this.props.user, 'public')
    }

    /* pull contract data for East */
    let balanceEast = await contracts.getBalance(account.address, 'east')
    let totalSupplyEast = await contracts.getTotalSupply('east')
    this.setState({ totalSupplyEast })
    if (account.east || balanceEast) {
      let totalSupplyEast = await contracts.getTotalSupply('east')
      this.setState({
        registeredEast: true,
        balanceEast,
        totalSupplyEast,
      })
      db.register(this.props.user, 'east')
    }
  }
  async register(contractType) {
    // console.log(this.account.address)
    // console.log(this.props.user)
    // return
    let address = this.account.address
    let balance = 0
    try {
      /* Call Contract Register method */
      let registerResult = await contracts.register(this.props.network, contractType, address)
      this.showReceipt(true, JSON.stringify(registerResult.receipt, null, 2))
      balance = registerResult.balance
      /* Then save to our local db object */
      db.register(this.props.user, contractType)
    } catch (err) {
      console.log(err)
      throw err
    }
    switch (contractType) {
      case 'public':
        this.setState({
          registeredPublic: true,
          balancePublic: balance,
        })
        break
      case 'east':
        this.setState({
          registeredEast: true,
          balanceEast: balance,
        })
        break
      default: break
    }
  }
  async unregister() {
    let address = this.account.address
    try {
      let receipts = []
      if (this.state.balancePublic) {
        /* Call Contract Unregister method */
        let receipt = await contracts.unregister(this.props.network, 'public', address)
        receipts.push(receipt)
        /* Then save to our local db object */
        db.unregister(this.props.user, 'public')
      }
      if (this.state.balanceEast) {
        let receipt = await contracts.unregister(this.props.network, 'east', address)
        receipts.push(receipt)
        db.unregister(this.props.user, 'east')
      }
      if (receipts.length) {
        this.showReceipt(true, JSON.stringify(receipts, null, 2))
      }
    } catch (err) {
      console.log(err)
      throw err
    }
    this.setState({
      registeredPublic: false,
      balancePublic: 0,
      registeredEast: false,
      balanceEast: 0,
    })
  }

  showReceipt(show, receipt) {
    this.setState({
      receiptAlert: show,
      receipt: receipt || '',
    })
  }
  modalShowNewPost(show) {
    this.setState({ newPost: show })
  }
  modalShowTransfer(show) {
    this.setState({ transferModal: show })
  }
  /**
   * Update balances.
   * Splice the post into the top of list of posts.
   * @param {*} post 
   */
  submitPost(post, amount, receipt) {
    db.db.posts.splice(0, 0, post)
    // db.db.postsLookup[post.id] = post
    if (amount) {
      this.setState({
        balancePublic: this.state.balancePublic - amount
      })
      this.showReceipt(true, JSON.stringify(receipt, null, 2))
    }
  }
  donate(contractType, amount, receipt) {
    if (contractType === 'public') {
      this.setState({
        balancePublic: this.state.balancePublic - amount
      })
    } else {
      this.setState({
        balanceEast: this.state.balanceEast - amount
      })
    }
    this.showReceipt(true, JSON.stringify(receipt, null, 2))
  }
  render() {
    let posts = db.db.posts
    return (
<>
<Row>
<Col md={12}>
  {/* WALLET DATA SECTION */}
  <Card>
    <Card.Header>Your ERC20 Balances</Card.Header>
    <Card.Body>
      <Row>
        <Col md={12}>
          <h6>Balance for Public Network</h6>
          {
            this.state.registeredPublic ? (
              <>
              <p>
                EQP: {this.state.balancePublic}
              </p>
              </>
            ) : (
              <Button onClick={() => this.register('public')}>
                Register for Public Tokens
              </Button>
            )
          }
          <p>
            EQP totalSupply: {this.state.totalSupplyPublic}
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
        {
          this.props.network === 'east' ? (
          <>
            <h6>Balance for East Coast Network</h6>
            {
              this.state.balanceEast ? (
              <p>
                EQE: {this.state.balanceEast}
                <Button variant="secondary"
                  onClick={() => this.modalShowTransfer(true)}
                  style={{ marginLeft: '20px'}}
                >
                  Create a Transfer
                </Button>
              </p>
              ) : (
              <Button onClick={() => this.register('east')}>
                Register for East Tokens
              </Button>
              )
            }
          </>
          ) : this.state.registeredEast && (
          <>
            <h6 style={{color: 'orange'}}>
              You have a balance for East but are 
              not connected to the East network so
              your balance is likely invalid.
            </h6>
            <p className="text-muted">
              EQE: (Unsynced Balance) {this.state.balanceEast}
            </p>
          </>
          )
        }
        {
          (this.props.network === 'east' || this.state.registeredEast) && (
            <p>
              EQE totalSupply: {this.state.totalSupplyEast}
            </p>
          )
        }
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <p className="text-muted">
            You can reset your balances (to restart the demo) by clicking below
          </p>
          <Button variant="warning" onClick={this.unregister}>
            Reset Balances
          </Button>
        </Col>
      </Row>
    </Card.Body>
  </Card>
  {/* END WALLET DATA SECTION */}
</Col>
</Row>
<Row>
<Col sm={12}>
  <h2>Community Posts</h2>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Create a new donation request or share some new info</Form.Label>
    <Form.Control type="text" size="lg"
      placeholder="Create a Post" 
      onClick={() => this.modalShowNewPost(true)}
    />
  </Form.Group>
  <Button variant="primary" onClick={() => this.modalShowNewPost(true)}>
    Create a Post
  </Button>
</Col>
{
  posts.map(post => {
    if (post.network !== "public" && post.network !== this.props.network) {
      return
    }
    return (
      <Post post={post} key={uuid.v4()} 
        userObj={this.state.userObj}
        donate={this.donate.bind(this)}
      />
    )
  })
}
</Row>
<NewPost show={this.state.newPost}
  close={() => this.modalShowNewPost(false)}
  user={this.props.user}
  userObj={this.state.userObj}
  submit={this.submitPost.bind(this)}
/>
<Transfer show={this.state.transferModal}
  close={() => this.modalShowTransfer(false)}
  transfer={this.donate.bind(this)}
  userObj={this.state.userObj}
  contracts={contracts}
/>
<Row>
<Col sm={12}>
{
  this.state.receiptAlert && (
  <Alert variant="primary" dismissible
    onClose={() => this.showReceipt(false)}
    style={{position: "fixed", top: "100px"}}
  >
    <Alert.Heading>Transaction Receipt[s]</Alert.Heading>
    <pre style={{
      whiteSpace: "pre-wrap", wordBreak: "break-word",
      maxHeight: "80vh", maxWidth: "65vw"
    }}>
      {this.state.receipt}
    </pre>
  </Alert>
  )
}
</Col>
</Row>
</>
    )
  }
}
