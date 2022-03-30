import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import Link from 'next/link';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';

class Requests extends React.Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestsCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        const requests = await Promise.all(
            Array(Number(requestsCount))
            .fill()
            .map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );

        return {
            address,
            requests,
            requestsCount,
            approversCount,
        }
    }

    renderBodyRow = (requests) => {
        return requests.map(({
            amount,
            approvalCount,
            complete,
            description,
            recipient,
        }, i) => (
            <Table.Row key={i} positive={(approvalCount > this.props.approversCount / 2)} disabled={complete}>
                <Table.Cell>{i}</Table.Cell>
                <Table.Cell>{description}</Table.Cell>
                <Table.Cell>{amount}</Table.Cell>
                <Table.Cell>{recipient}</Table.Cell>
                <Table.Cell>{`${approvalCount}/${this.props.approversCount}`}</Table.Cell>
                <Table.Cell><Button onClick={this.onApprove(i)} basic color='green'>Approve</Button></Table.Cell>
                <Table.Cell><Button onClick={this.onFinalize(i)} basic color='blue'>Finalize</Button></Table.Cell>
            </Table.Row>
        ))
    }

    onApprove = (id) => async () => {
        const { router, address } = this.props;
        const accounts = await web3.eth.getAccounts();
        const campaign = Campaign(address);

        try {
            await campaign.methods.approveRequest(id).send({
                from: accounts[0],
            });
            router.replace(`/campaigns/${address}/requests`);
        } catch (error) {
        alert(error.message);
        }
      }

      onFinalize = (id) => async () => {
          const { router, address } = this.props;
          const accounts = await web3.eth.getAccounts();
          const campaign = Campaign(address);

        try {
            await campaign.methods.finalizeRequest(`${id}`).send({
                from: accounts[0],
                gas: '1000000'
            });
            router.replace(`/campaigns/${address}/requests`);
        } catch (error) {
          alert(error.message);
        }
    }

    render() {
        const { requests, requestsCount } = this.props;
        const headerRow = ['ID', 'Description', 'Amount', 'Recipient', 'Approval Count', 'Approve', 'Finalize'];

        return (
            <Layout>
                <h3>Requests</h3>
                <Link href={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary>Add Request</Button>
                    </a>
                </Link>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Recipient</Table.HeaderCell>
                            <Table.HeaderCell>Approval Count</Table.HeaderCell>
                            <Table.HeaderCell>Approve</Table.HeaderCell>
                            <Table.HeaderCell>Finalize</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderBodyRow(requests)}
                    </Table.Body>
                </Table>
                <p>Found {Number(requestsCount).toString()} requests.</p>
            </Layout>
        )
    }
}

export default withRouter(Requests);