import Web3 from 'web3'
// import quorumjs from "quorum-js"
import artifactPublic from '../../../contract/build/contracts/Public.json'
import artifactEast from '../../../contract/build/contracts/East.json'
// import artifactWest from '../../../contract/build/contracts/West.json'
import data from './data'

export default {
  setWeb3Connection,
  register,
  getBalance,
  getTotalSupply,
  transfer,
  unregister,
}

const nodesInfo = {
  node1: {
    uri: "http://localhost:22000",
    // Coinbase wallet for node1:
    address: '0xed9d02e382b34818e88B88a309c7fe71E65f419d',
    // TX Manager Public Key for Node 1
    publicKey: 'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=',
  },
  node2: {
    uri: "http://localhost:22001",
    address: '0xca843569e3427144cead5e4d5999a3d0ccf92b8e',
    publicKey: 'QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=',
  }
}

// let node1Private = 'e6181caaffff94a09d7e332fc8da9884d99902c7874eb74354bdcadf411929f1'
let contractAddressPublic = artifactPublic.networks[10].address
let contractAddressEast =   artifactEast.networks[10].address
// let contractAddressWest =   artifactWest.networks[10].address

let contracts = {
  public: {},
  east:   {},
}

/**
 * Triggered by Login - because login specifies which node needs to have a network
 * connection set up.
 * @param {*} network 
 * @param {*} user 
 */
async function setWeb3Connection(network, user) {
  // console.log('setWeb3Connec', network, user)
  let networkNode = network === 'east' ? nodesInfo.node1 : nodesInfo.node2
  // console.log(networkNode)
  let provider = new Web3.providers.HttpProvider(networkNode.uri)
  let web3 = new Web3(provider)
  
  contracts = {
    public: new web3.eth.Contract(artifactPublic.abi, contractAddressPublic),
    east:   new web3.eth.Contract(artifactEast.abi, contractAddressEast),
    // west:   new web3.eth.Contract(artifactWest.abi, contractAddressWest),
  }

  /* Add the secret key to the wallet for signing transactions */
  let account = data.db.accounts[user]
  web3.eth.accounts.wallet.add(account.key)
  /* This is not really necessary: */
  // web3.eth.getCoinbase().then(res => {
  //   console.log(res)
  // })
}


async function getBalance(address, network) {
  // console.log('getBalance', address, network)
  let contract = contracts[network]
  let res
  try {
    res = await contract.methods
    .balanceOf(address)
    .call()
  } catch (err) {
    console.log(err)
    throw err
  }
  console.log("Call Res:", res)
  return Number(res)
}

async function getTotalSupply(network) {
  let contract = contracts[network]
  let res
  try {
    res = await contract.methods
    .totalSupply()
    .call()
  } catch (err) {
    console.log(err)
    throw err
  }
  console.log("Call Res:", res)
  return res
}

async function register(network, contractType, recipient) {
  let networkNode = network === 'east' ? nodesInfo.node1 : nodesInfo.node2
  let sender = networkNode.address
  let publicKey = networkNode.publicKey
  let amount = 0
  let amountPublic = 500
  let amountEast = 750
  let contract = contracts[contractType]

  /* Set up the method parameters: */

  let receipt = {}
  try {
    if (contractType === 'public') {
      amount = amountPublic
      receipt = await contract.methods
      .transfer(recipient, amountPublic)
      .send({
        from: sender,
      })
    } else {  // It's a private contract:
      amount = amountEast
      receipt = await contract.methods
      .transfer(recipient, amountEast)
      .send({
        from: sender,
        privateFor: [publicKey],
      })
    }
  } catch (err) {
    console.log(err)
    throw err
  }
  console.log("Transaction Receipt:", receipt)
  return {
    balance: amount,
    receipt,
  }
}

async function transfer(network, contractType, sender, recipient, amount) {
  let networkNode = network === 'east' ? nodesInfo.node1 : nodesInfo.node2
  let bankWallet = networkNode.address
  let publicKey = networkNode.publicKey
  let contract = contracts[contractType]
  let receipt = {}
  /**
   * If the recipient is "network", it means that user is posting a public post
   * and needs to pay the fee to the public smart contract.
   * So change "Recipient" to 
   */
  if (recipient === 'network') {
    recipient = bankWallet
  }

  try {
    if (contractType === 'public') {
      receipt = await contract.methods
        .transfer(recipient, amount)
        .send({
          from: sender,
          gasPrice: 0,
          gas: 100000,
        })
    } else {  // It's a private contract:
      receipt = await contract.methods
        .transferFrom(sender, recipient, amount)
        .send({
          from: bankWallet,
          gasPrice: 0,
          gas: 100000,
          privateFor: [publicKey],
        })
    }
  } catch (err) {
    console.log(err)
    throw err
  }
  console.log("Transaction Receipt:", receipt)
  return receipt
}

/**
 * Send the ERC20 tokens back to the bank so user can restart the demo from scratch.
 * @param {*} network 
 * @param {*} contractType 
 * @param {*} sender 
 */
async function unregister(network, contractType, sender) {
  // console.log(network, contractType, sender)
  let networkNode = network === 'east' ? nodesInfo.node1 : nodesInfo.node2
  let bankWallet = networkNode.address
  let publicKey = networkNode.publicKey
  let contract = contracts[contractType]
  let receipt = {}
  try {
    let amount = await getBalance(sender, contractType)

    if (contractType === 'public') {
      receipt = await contract.methods
        .transfer(bankWallet, amount)
        .send({
          from: sender,
          gasPrice: 0,
          gas: 100000,
        })
    } else {  // It's a private contract:
      receipt = await contract.methods
        .transferFrom(sender, bankWallet, amount)
        .send({
          from: bankWallet,
          gasPrice: 0,
          gas: 100000,
          privateFor: [publicKey],
        })
    }
  } catch (err) {
    console.log(err)
    throw err
  }
  console.log("Transaction Receipt:", receipt)
  return receipt
}

// contractInst.methods.transfer(recipient, amount)
//   .send({
//     from: sender,
//     privateFor: [node1PublicKey],
//   })
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => {
//     console.log(err)
//   })

  /* This is a way to connect Metamask to the app */
  // if (window.ethereum) {
  //   window.web3 = new Web3(window.ethereum);
  //   window.ethereum.enable();
  // }