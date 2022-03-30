import web3 from './web3';
import compiledFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(compiledFactory.abi, '0x9BDc6Eb714f5dbC6376F30E82D0c719c32C5e3bc');

export default instance;