import React from 'react';
import { withRouter } from 'next/router';

class CampaignShow extends React.Component {
    render() {
        return (
            <div>Campaign {this.props.router.query.address}</div>
        )
    }
}

export default withRouter(CampaignShow);