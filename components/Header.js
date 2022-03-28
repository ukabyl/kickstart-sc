import React from 'react';
import Link from 'next/link';
import { Header, Menu } from 'semantic-ui-react';

export default () => {
    return (
        <Header style={{ marginTop: '10px' }}>
            <Menu>
                <Link href='/'>
                    <a className='item'>Crowcoin</a>
                </Link>
                <Menu.Menu position='right'>
                    <Link href='/'>
                        <a className='item'>Campaigns</a>
                    </Link>
                    <Link href='/campaigns/new'>
                        <a className='item'>+</a>
                    </Link>
                </Menu.Menu>
            </Menu>
        </Header>
    )
}