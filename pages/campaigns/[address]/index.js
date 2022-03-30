import React from 'react';
import web3 from '../../../ethereum/web3';
import { Button, Card, Grid } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import ContributionForm from '../../../components/ContributionForm';
import Link from 'next/link';

class CampaignShow extends React.Component {
    static async getInitialProps(props) {
        const campaign = await Campaign(props.query.address).methods.getSummary().call();

        return {
            minimumContribution: campaign[0],
            balance: campaign[1],
            requestsCount: campaign[2],
            approversCount: campaign[3],
            manager: campaign[4],
        }
    }

    renderCards = () => {
        const {
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager,
        } = this.props;

        return [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to become an approver',
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers',
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already donated to the campaign',
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money this campaign has left to spend',
            },
        ]
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            <Card.Group items={this.renderCards()} />
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributionForm />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Link href={`/campaigns/${this.props.router.query.address}/requests`}>
                            <a>
                                <Button primary>Requests</Button>
                            </a>
                        </Link>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    }
}

export default withRouter(CampaignShow);