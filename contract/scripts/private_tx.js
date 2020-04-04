var nodePublicKey = 'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo='
var sender = await web3.eth.getCoinbase()
var recipient = ''
var amount = 5

const east = await East.deployed()

// Instantiate the contract from ABI artifact and the deployed address.
const contractInst = new web3.eth.Contract(east.abi, east.address)

/* 
var res = await contractInst.methods
  .transfer(recipient, amount)
  .send({
    from: sender,
    privateFor: [nodePublicKey],
  })
*/
var res = await contractInst.methods.transfer(recipient, amount).send({ from: sender, privateFor: [nodePublicKey], })
