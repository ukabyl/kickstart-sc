const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts, factory, campaign, campaignAddress;

beforeEach( async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[1], gas: '2000000' });

    await factory.methods.createCampaign('10').send({
        from: accounts[1],
        gas: '2000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(manager, accounts[1]);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: '11'
        });
        const isContributor = await campaign.methods.approvers(accounts[0]).call();
        assert(isContributor);
    });

    it('requires a minimum contributuion', async () => {
        try {
            await campaign.methods.contribute().send({
                value: 5,
                from: accounts[0] 
            });
        } catch (error) {
            return assert(error);
        }

        assert(false);
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest('Buy batteries', '100', accounts[0])
            .send({
                from: accounts[1],
                gas: '1000000'
            });

        const request = await campaign.methods.requests(0).call();

        assert.strictEqual(request.description, 'Buy batteries');
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[2],
            value: web3.utils.toWei('10', 'ether')
        });
        
        await campaign.methods.createRequest('Buy cars', web3.utils.toWei('5', 'ether'), accounts[3])
            .send({ from: accounts[1], gas: '1000000' });
        await campaign.methods.approveRequest(0).send({
            from: accounts[2],
            gas: '1000000'
        });
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[3]);
        console.log(balance)
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance > 104);

        const request = await campaign.methods.requests(0).call();
        assert.ok(request.complete);
    });
});