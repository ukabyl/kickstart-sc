import React from 'react';
import Link from 'next/link';
import { Card, Button, Icon } from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory';

class Index extends React.Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns };
    }

    renderCampaigns() {
        return this.props.campaigns.map((campaign) => {
            return {
                header: campaign,
                description: (
                    <Link href={`campaigns/${campaign}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true,
            }
        });
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Open Campaigns</h3>
                    <Link href='campaigns/new'>
                        <a>
                            <Button primary floated='right'><Icon name='plus circle' /> Create Campaign</Button>
                        </a>
                    </Link>
                    <Card.Group items={this.renderCampaigns()} />
                </div>
            </Layout>
        )
    }
}

export default Index;