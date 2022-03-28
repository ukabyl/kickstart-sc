import React from 'react';
import { withRouter } from 'next/router';
import { Button, Form, Message, Input } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class NewCampaign extends React.Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        contributing: false,
    }

    onSubmit = async () => {
        this.setState({ contributing: true });
        this.setState({ errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            const result = await factory.methods.createCampaign(this.state.minimumContribution).send({
                from: accounts[0],
            });
            this.props.router.push('/');
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ contributing: false });
    }

    render() {
        const { minimumContribution, contributing, errorMessage } = this.state;

        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            label='wei'
                            labelPosition='right'
                            value={minimumContribution}
                            onChange={(e) => this.setState({ minimumContribution: e.target.value })}
                        />
                    </Form.Field>
                    <Message error header='Ooops!' content={errorMessage} />
                    <Button type='submit' loading={contributing} primary>Create!</Button>
                </Form>
            </Layout>
        )
    }
}

export default withRouter(NewCampaign)