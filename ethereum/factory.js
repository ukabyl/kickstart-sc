import web3 from './web3';
import compiledFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(compiledFactory.abi, '0x3bc6f0F4C2972d25e728880bd91fd008a7b1dA46');

export default instance;