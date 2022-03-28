import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';

export default (props) => {
    return (
        <Container>
            <Header />
            <div>{props.children}</div>
            {/* <footer>Footer</footer> */}
        </Container>
    );
}