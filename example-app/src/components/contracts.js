const Web3 = require('web3')
import artifactPublic from '../../contract/build/contracts/Public.json'
import artifactEast from '../../contract/build/contracts/East.json'

export default {
  setWeb3Connection,
  register,
  getBalance,
}

const NODE1 = "http://localhost:22000"
const NODE2 = "http://localhost:22001"

// TX Manager Public Key for Node 1
var node1PublicKey = 'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo='
// var sender = await web3.eth.getCoinbase()
let node1admin = '0xed9d02e382b34818e88B88a309c7fe71E65f419d'
let node2admin = '0xca843569e3427144cead5e4d5999a3d0ccf92b8e'
let contractAddressPublic = artifactPublic.networks[10].address
let contractAddressEast =   artifactEast.networks[10].address

let contracts = {
  public: {},
  east:   {}
}

function setWeb3Connection(network) {
  let networkNode = network === 'east' ? NODE1 : NODE2
  let provider = new Web3.providers.HttpProvider(networkNode)
  let web3 = new Web3(provider)
  web3Instance.eth.getCoinbase().then(res => {
    console.log(res)
  })
  contracts = {
    public: new web3.eth.Contract(artifactPublic.abi, contractAddressPublic),
    east:   new web3.eth.Contract(artifactEast.abi, contractAddressEast)
  }
}


async function register(network, recipient) {
  let sender = network === 'east' ? node1admin : node2admin
  let amount = 500
  let contract = contracts[network]
  let res
  try {
    res = await contract.methods
    .transfer(recipient, amount)
    .send({
      from: sender,
    })
  } catch (err) {
    console.log(err)
    throw err
  }
  console.log("Transaction Receipt:", res)
  return amount
}

async function getBalance(network, address) {
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
  return res
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
