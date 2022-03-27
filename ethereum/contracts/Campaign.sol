// SPDX-License-Identifier: SPDX-License
pragma solidity ^0.8.13;

contract CampaignFactory {
    address[] deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint amount;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint approversCount;
    Request[] public requests;
    
    constructor(uint minimum, address sender) {
        manager = sender;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint amount, address recipient) 
        public payable restricted 
    {
        Request storage newRequest = requests.push();

        newRequest.description = description;
        newRequest.amount = amount;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {        
        require(approvers[msg.sender]);
        Request storage request = requests[index];

        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);
        payable(request.recipient).transfer(request.amount);
        request.complete = true;
    }
}