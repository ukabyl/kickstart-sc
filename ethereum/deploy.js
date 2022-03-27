require('dotenv').config();
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');

const provider = new HDWalletProvider(process.env.MnemonicPhrase, process.env.Endpoint);
const web3 = new Web3(provider);

async function deploy() {
    try {
        const accounts = await web3.eth.getAccounts();
        const contract = await new web3.eth.Contract(compiledFactory.abi)
            .deploy({ data: compiledFactory.evm.bytecode.object })
            .send({ from: accounts[0], gas: '3000000' });
        
        console.log('Contract deployed at: ' + contract.options.address);
    } catch (error) {
        console.log(error);
    }
}

deploy();
