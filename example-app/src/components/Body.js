/**
 * Show a wallet card w/ token balacnes at the top of all content.
 * Show "Posts/shares" cards as the main body content.
 */
import React from "react"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

export default class Body extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount() {
    if (db.account.public) {
      this.setState({
        registeredPublic: true,
        balancePublic: db.account.public.balance,
      })
    }
    if (db.account.east) {
      this.setState({
        registeredEast: true,
        balanceEast: db.account.east.balance,
      })
    }
  }
  render() {
    return (
<Row>
<Col md={12}>
  <Card>
    <Card.Header>Your ERC20 Balances</Card.Header>
    <Card.Body>
    {
      this.props.networks.public ? (
        <div>
          <h6>Balance for Public</h6>
          <p>
            EQP: {this.props.}
          </p>
        </div>
      ) : (
        <Button></Button>
      )
    }
    </Card.Body>
  </Card>
</Col>
</Row>
<Row>
<Col md={12}>
  <Card>
    <Card.Header>Your ERC20 Balances</Card.Header>
    <Card.Body>
    {
      this.props.
    }
    </Card.Body>
  </Card>
</Col>
</Row>
  }
}
