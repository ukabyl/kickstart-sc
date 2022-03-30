import web3 from './web3';
import compiledCompaign from './build/Campaign.json';

export default (address) => {
    return new web3.eth.Contract(
        compiledCompaign.abi,
        address
    );
}