import { connect } from 'react-redux';

import { setLoading } from '../../actions/loading';
import { getCategories, fetchCategories } from '../../actions/categories';

import { Button, Loader } from 'semantic-ui-react';
import Option from '../../common/Option/Option';


const mapState = state => {
    return {
        loading: state.loading,
        categories: state.categories
    }
};

@connect(mapState, { setLoading, getCategories, fetchCategories })
export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            optionValue: '--Выберите категорию--',
            error: ''
        };
    };

    componentWillMount() {
        this.props.setLoading(true);
        this.props.getCategories()
            .then(() => this.props.setLoading(false))
            .catch(err => {
                this.setState({
                    error: err.response ? err.response.data.error : err.message
                });
                this.props.setLoading(false);

            });
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.props.categories !== prevProps.categories) {
            this.setState({
                categories: this.props.categories.map(item => {
                    return {
                        name: item.name,
                        title: item.name,
                        count: item.cnt
                    }
                })
            });
        };
    };

    parseCategories = () => {
        this.props.setLoading(true);
        this.props.fetchCategories()
            .then(() => this.props.loading(false))
            .catch((err) => {
                this.setState({
                    error: err.response ? err.response.data.error : err.message
                });
                this.props.setLoading(false);
            })
    };

    optionClick = value => {
        this.setState({
            optionValue: value
        });
    };


    render() {
        return (
            <div>
                <h1>Main</h1>

                <Button
                    primary
                    onClick={this.parseCategories}
                    disabled={this.props.loading}
                >
                    Fetch Categories
                </Button>

                <Option
                    value={this.state.optionValue}
                    items={this.state.categories}
                    onClick={this.optionClick}
                    label='Выбор категории'
                    emptyValue='Нет выбора'
                    loading={this.props.loading}
                    loadingValue='Загрузка...'
                />
            </div>
        )
    };
};