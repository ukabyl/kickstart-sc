import React from 'react';
import { withRouter } from 'next/router';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributionForm extends React.Component {
    state = {value: '', errorMessage: '', contributing: false}

    onSubmit = async (e) => {
        e.preventDefault();
        const { address } = this.props.router.query;
        const { value } = this.state;
        const accounts = await web3.eth.getAccounts();
        const campaign = Campaign(address);
        this.setState({ contributing: true, errorMessage: '' });
        try {
            const result = await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei(value, 'ether') });
            this.props.router.replace(`/campaigns/${address}`);
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ contributing: false });
    }
    
    render() {
        const { value, errorMessage, contributing } = this.state;

        return (
            <Form onSubmit={this.onSubmit} error={!!errorMessage}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input
                        label='ether'
                        labelPosition='right'
                        value={value}
                        onChange={(e) => this.setState({ value: e.target.value })}
                    />
                </Form.Field>
                <Message error header='Ooops!' content={errorMessage} />
                <Button loading={contributing} type='submit' primary>Contribute!</Button>
            </Form>
        )
    }
}

export default withRouter(ContributionForm);