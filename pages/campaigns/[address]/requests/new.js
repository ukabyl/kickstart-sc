import React from 'react';
import { Button, Input, Form, Message, } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';

class NewRequest extends React.Component {
    state = {
        description: '',
        recipientAddress: '',
        value: '',
        errorMessage: '',
        creating: false
    }

    onSubmit = async () => {
        const { value, description, recipientAddress } = this.state;
        this.setState({ errorMessage: '', creating: true });
        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(this.props.router.query.address);

            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipientAddress,
            ).send({ from: accounts[0] });

            this.props.router.push(`/campaigns/${this.props.router.query.address}/requests`);
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ creating: false });
    }

    render() {
        const { value, errorMessage, creating, description, recipientAddress } = this.state;

        return (
            <Layout>
                <h3>Add Request</h3>
                <Form onSubmit={this.onSubmit} error={!!errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={description}
                            onChange={(e) => this.setState({ description: e.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value</label>
                        <Input
                            label='ether'
                            labelPosition='right'
                            value={value}
                            onChange={(e) => this.setState({ value: e.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={recipientAddress}
                            onChange={(e) => this.setState({ recipientAddress: e.target.value })}
                        />
                    </Form.Field>
                    <Message error header='Ooops!' content={errorMessage} />
                    <Button loading={creating} type='submit' primary>Create!</Button>
                </Form>
            </Layout>
        )
    }
}

export default withRouter(NewRequest);