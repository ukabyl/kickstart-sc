const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

fs.removeSync(buildPath);

const sourceCode = fs.readFileSync(campaignPath, 'utf-8');

const CampaignConractPattern = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: sourceCode
        }
    },
    settings: {
        outputSelection: {
        '*': {
            '*': ['*']
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(CampaignConractPattern))).contracts['Campaign.sol'];
fs.ensureDirSync(buildPath);

for (let contractName in output) {
    fs.outputJSONSync(
        path.resolve(buildPath, contractName + '.json'),
        output[contractName]
    );
}
