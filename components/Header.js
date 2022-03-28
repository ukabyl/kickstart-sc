import React from 'react';
import { Header, Menu } from 'semantic-ui-react';

export default () => {
    return (
        <Header style={{ marginTop: '10px' }}>
            <Menu>
                <Menu.Item name='Crowcoin'>
                    Crowcoin
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item name='Campaigns'>
                        Crowcoin
                    </Menu.Item>
                    <Menu.Item name='Add campaign'>
                        +
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        </Header>
    )
}