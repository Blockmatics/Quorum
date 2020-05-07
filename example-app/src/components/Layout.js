import React from "react"
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { GiCroissant } from 'react-icons/gi'
import LoginModal from './login'
import wallet from './wallet'

/**
 * Layout will be the central state for this simple demo app.
 * So addresses will be stored here, and web3 utilties will 
 * be initiated here.
 */
export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      user: '',
      address: '',
      network: '',
    }
  }

  modalOpenLogin() {
    this.setState({ loggedIn: false })
  }
  modalCloseLogin() {
    this.setState({loggedIn: true})
  }
  login(user, network) {
    let address = wallet[user].address
    this.setState({
      loggedIn: true,
      user,
      network,
      address,
      username: user === 'east' ? 'East Coast User' : 'West Coast User'
    })
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
  }
  render() { 
    return (
<>
<Navbar bg="dark" fixed="top" expand='md'>
  <Navbar.Brand style={{
    color: 'white',
    display: 'flex',
    alignItems: 'center',
  }} >
    <GiCroissant style={{
      fontSize: '2em',
      marginRight: '10px',
    }}/>
    <h5 style={{ marginBottom: 'unset' }}>Ethique</h5>
  </Navbar.Brand>
  <Navbar.Collapse className="justify-content-end">
    {/* {
      this.state.loggedIn && (
        <h5 style={{ marginBottom: 'unset' }}>
          Ethique {this.state.balance}
        </h5>
      )
    } */}
    <Button variant="primary"
      onClick={() => this.modalOpenLogin()}
    >
    { this.state.loggedIn ? 'Change Accounts' : 'Log In' }
    </Button>
  </Navbar.Collapse>
</Navbar>
<Container style={{ marginTop: '80px' }}>
{
  this.state.loggedIn ? (
    <h4>Welcome {this.state.username}</h4>
    <Body />
  ) : (
    <h3>Log In to View Your ERC20 Tokens & Content.</h3>
  )
}
</Container>
<LoginModal show={!this.state.loggedIn} 
  close={this.modalCloseLogin.bind(this)}
  login={this.login.bind(this)}
/>
</>
    )
  }
}

