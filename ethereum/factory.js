import web3 from './web3';
import compiledFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(compiledFactory.abi, '0xaC6024831a2FF1303b6EB8623739B741409Ba5A4');

export default instance;