import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import NotFoundPage from '../404/404';
import Main from '../Main/Main';

import { Loader } from 'semantic-ui-react';

import './App.sass';


const mapState = state => {
    return {
        loading: state.loading
    }
};

@connect(mapState)
class App extends React.Component {
    render() {
        return (
            <div className="App">
                {this.props.loading && <Loader active>Загрузка...</Loader>}
                <Switch>
                    <Route exact path="/" component={Main}/>
                    <Route component={NotFoundPage} />
                </Switch>
            </div>
        );
    }
}

export default App;

