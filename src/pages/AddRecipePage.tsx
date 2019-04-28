import { Typography } from '@material-ui/core';
import { List } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteChildrenProps } from 'react-router';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AddRecipeForm } from '../components/presentational/AddRecipeForm';
import { ContentBox } from '../components/presentational/ContentBox';
import { Recipe } from '../components/presentational/Recipe';
import { Auth, auth } from '../core/Auth';
import { history } from '../core/store';
import { StoreState } from '../core/types/StoreState';
import { createTypedMap, TypedMap } from '../core/types/TypedMap';
import { doCreateRecordNamespaceKey, doGetRecordNamespaceKey } from '../generated/core/actions/keyValueOperationsActionCreators';
import { doOperateNamespaceKey } from '../generated/core/actions/operateOperationsActionCreators';
import { LastApiCall } from '../generated/core/state/ApiState';
import Page from './Page';

 
interface AddRecipeProps extends RouteChildrenProps {
    getRecipes: () => void;
    addRecipe: (recipe: Recipe, empty?: boolean) => void;

    lastResponse?: TypedMap<LastApiCall>;
    cookbook?: List<TypedMap<Recipe>>;
    auth: Auth;
}



export class AddRecipeComponent extends React.PureComponent<AddRecipeProps> {
    public componentDidMount() {
    }

    public render() {
        let content: JSX.Element | null =  null;
        if (this.props.cookbook && auth.isAuthenticated()) {
            content = (
                <>
                    <Typography align="center" component="h2" variant="h2" gutterBottom>
                        Add Recipe
                    </Typography>

                    <AddRecipeForm empty={!this.props.cookbook || this.props.cookbook.size === 0} addRecipe={this.props.addRecipe} />
                </>
            );
        } else {
            history.replace("/");
        }
        return (
            <Page lastResponse={this.props.lastResponse}>
                <ContentBox>{content}</ContentBox>
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
            cookbook = bins.get("recipeList");
        }
    }
    return {
        lastResponse: state.api.get('last'),
        cookbook
    };
}

function dispatchToProps(dispatch: ThunkDispatch<StoreState, void, Action>) {
    return {
        getRecipes: () => {
            dispatch(
                doGetRecordNamespaceKey({
                    key: 'recipes',
                    namespace: 'cookbook',
                    onError: () => {
                        //auth.renewSession()
                    }
                })
            );
        },
        addRecipe: (recipe: Recipe, empty = false) => {
            if (empty) {
                dispatch(
                    doCreateRecordNamespaceKey({
                        key: 'recipes',
                        namespace: 'cookbook',
                        bins: { recipeList: [recipe] },
                        recordExistsAction: "REPLACE",
                        onError: () => {
                            //auth.renewSession()
                        },
                        onSuccess: () => {
                            history.push("/");
                        }
                    })
                );
            } else {
                dispatch(
                    doOperateNamespaceKey({
                        key: 'recipes',
                        namespace: 'cookbook',
                        operations: [
                            {
                                opValues: {
                                    bin: 'recipeList',
                                    value: recipe
                                },
                                operation: 'LIST_APPEND'
                            }
                        ],
                        onError: () => {
                            //auth.renewSession()
                        },
                        onSuccess: () => {
                            history.push("/");
                        }
                    })
                );
            }
        }
    };
}

const AddRecipePage = connect(
    stateToProps,
    dispatchToProps
)(AddRecipeComponent);

export default AddRecipePage;
