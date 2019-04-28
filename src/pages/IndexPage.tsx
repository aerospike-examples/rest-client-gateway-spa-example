import { Button, Grid, Link, Paper, Typography } from '@material-ui/core';
import { css } from 'emotion';
import { List } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Cookbook } from '../components/presentational/Cookbook';
import { Recipe } from '../components/presentational/Recipe';
import { Auth, auth } from '../core/Auth';
import { history } from '../core/store';
import { StoreState } from '../core/types/StoreState';
import { createTypedMap, TypedMap } from '../core/types/TypedMap';
import { doGetRecordNamespaceKey } from '../generated/core/actions/keyValueOperationsActionCreators';
import { doOperateNamespaceKey } from '../generated/core/actions/operateOperationsActionCreators';
import { LastApiCall } from '../generated/core/state/ApiState';
import Page from './Page';

interface IndexProps {
    getRecipes: () => void;
    removeRecipe: (index: number) => void;
    lastResponse?: TypedMap<LastApiCall>;
    cookbook?: List<TypedMap<Recipe>>;
    auth: Auth;
}
const AboutLink = (props: any) => <RouterLink to="/about" {...props} />;

export class IndexComponent extends React.PureComponent<IndexProps> {
    constructor(props: IndexProps) {
        super(props);
    }
    public componentDidMount() {
        if (auth.isAuthenticated()) {
            this.props.getRecipes();
        }
    }

    public render() {
        let content: JSX.Element | null = null;
        if (auth.isAuthenticated()) {
            if (this.props.cookbook) {
                content = (
                    <>
                        <Cookbook
                            removeRecipe={this.props.removeRecipe}
                            cookbook={this.props.cookbook}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            mini={true}
                            onClick={e => {
                                history.push('/addrecipe');
                            }}
                        >
                            Add New Recipe
                        </Button>
                    </>
                );
            }
        } else {
            content = (
                <Grid container direction="column" justify="space-between">
                    <Grid item>
                        <Typography variant="h4">Welcome to your personal cookbook!</Typography>
                        <p />
                        <Typography variant="h6">
                            Keep a cookbook of recipes saved to your personal account. Login to try
                            it out!
                        </Typography>
                    </Grid>{' '}
                    <Grid item >
                        <Paper className={css({marginTop: "10vh", backgroundColor: 'darkgray' })}>
                        <Typography
                            
                            variant="h6"
                        >
                            This simple app allows creation of a collection of recipes in a cookbook
                            personal to a logged in user. It showcases using the Aerospike database
                            along with the Aerospike REST client gateway in a Single Page
                            Application setting without a custom server.{' '}
                            <Link component={AboutLink}>See our about page for more info.</Link>
                        </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            );
        }

        return (
            <Page lastResponse={this.props.lastResponse}>
                {content}
            </Page>
        );
    }
}

function stateToProps(state: StoreState) {
    let cookbook;

    if (state.api.getIn(['keyValueOperations', 'getRecordNamespaceKey', 'errorValue']) != null) {
        cookbook = createTypedMap();
    } else {
        const bins = state.api.getIn([
            'keyValueOperations',
            'getRecordNamespaceKey',
            'successValue',
            'bins'
        ]);
        if (bins) {
            cookbook = bins.get('recipeList');
        }
    }
    return {
        lastResponse: state.api.get('last'),
        cookbook
    };
}

function dispatchToProps(dispatch: ThunkDispatch<StoreState, void, Action>) {
    const getRecipes = () => {
        dispatch(
            doGetRecordNamespaceKey({
                key: 'recipes',
                namespace: 'cookbook',
                onError: () => {
                    //auth.renewSession()
                }
            })
        );
    };

    return {
        getRecipes,
        removeRecipe: (index: number) => {
            dispatch(
                doOperateNamespaceKey({
                    key: 'recipes',
                    namespace: 'cookbook',
                    operations: [
                        {
                            opValues: {
                                bin: 'recipeList',
                                index: index
                            },
                            operation: 'LIST_REMOVE'
                        }
                    ],
                    onError: () => {
                        //auth.renewSession()
                    },
                    onSuccess: () => {
                        getRecipes();
                    }
                })
            );
        }
    };
}

const IndexPage = connect(
    stateToProps,
    dispatchToProps
)(IndexComponent);

export default IndexPage;
