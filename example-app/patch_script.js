/**
 * Two tasks are needed for the app to work conveniently:
 * 1. The unlocked admin geth accounts for Node 1 & Node 2 need half of the totalSupply
 *    (Because they need to transfer to registering users.)
 * 2. In order for the app to work w/o coding in too much private transaction code:
 * User needs to approve the admin wallet to send a lot of their tokens
 * on their behalf.
 * This script calls quorumjs RawTransactionManager service:
    txnMngr.sendRawTransaction(txParams).then(receipt => {...

  which does /storeraw , setPrivate etc.
 */
const Web3 = require('web3')
const quorumjs = require("quorum-js")
const eastJson = require('../contract/build/contracts/East.json')
const publicJson = require('../contract/build/contracts/Public.json')

const NODE1 = "http://localhost:22000"

var nodePublicKey = 'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo='
// var sender = await web3.eth.getCoinbase()
let admin1 = '0xed9d02e382b34818e88B88a309c7fe71E65f419d'
let sender = "0x9186eb3d20cbd1f5f992a950d808c4495153abd5"
let privateKey = "794392ba288a24092030badaadfee71e3fa55ccef1d70c708baf55c07ed538a8"
var amount = 1000000
let admin2 = '0xca843569e3427144cead5e4d5999a3d0ccf92b8e'

// Instantiate the contract from ABI artifact and the deployed address.
let abi = eastJson.abi
let networkId = 10
let contractAddress = eastJson.networks[networkId].address
let web3 = new Web3(new Web3.providers.HttpProvider(NODE1))
quorumjs.extend(web3);
console.log(Object.keys(web3.quorum))
const enclaveOptions = {
  privateUrl: 'http://localhost:9081'
}
const txnMngr = quorumjs.RawTransactionManager(web3, enclaveOptions);
let contractInst = new web3.eth.Contract(abi, contractAddress)

let abiPublic = publicJson.abi
let contractAddressPublic = publicJson.networks[networkId].address
let contractInstPublic = new web3.eth.Contract(abiPublic, contractAddressPublic)

let transaction = contractInst.methods.approve(admin1, amount)
let encodedTrans = transaction.encodeABI();


// contractInst.methods
//   .allowance(sender, admin)
//   .call().then( res => {
//     console.log(res)
//   })
// contractInst.methods
//   .balanceOf(sender)
//   .call().then( res => {
//     console.log(res)
//   })

web3.eth.getTransactionCount(sender).then(count => {
  console.log(count)
  const txParams = {
    // from: sender,
    from: {
      address: sender,
      privateKey: '0x' + privateKey,
    },
    nonce: count, //web3.utils.toHex(count),
    gasPrice: 0, //web3.utils.toHex(0), 
    gasLimit: 8000000, //web3.utils.toHex(8000000),
    to: contractAddress, 
    data: encodedTrans,
    value: 0,
    chainId: web3.utils.toHex(10),
    isPrivate: true,
    privateFrom: nodePublicKey,
    privateFor: [nodePublicKey],
  }
  console.log(txParams)
  txnMngr.sendRawTransaction(txParams).then(receipt => {
    console.log(receipt)
    /* Transfer half of totalSupply to Node 2 admin */
    contractInstPublic.methods
      .transfer(admin2, amount / 2)
      .send({
        from: admin1
      })
      .then(receipt2 => {
        console.log(receipt2)
      })
  })
  return

});
