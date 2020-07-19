import React, {Component} from 'react';
import { Container } from 'react-bootstrap';
import UserForm from './user/UserForm.js';
import './App.css';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <Container>
                <Router>
                    <Switch>
                        <Route exact path={["/","/:id"]} component={UserForm} />
                    </Switch>
                </Router>
            </Container>
        )
    }
}

export default App;
