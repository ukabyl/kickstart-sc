import web3 from './web3';
import compiledFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(compiledFactory.abi, '0xEe19172f1ac1Cd4d25Ca5ceD304783769Bdd4495');

export default instance;