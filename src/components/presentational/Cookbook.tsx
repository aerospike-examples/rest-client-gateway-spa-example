import { Button, createStyles, Grid, ListItem, Paper, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import ListContainer from '@material-ui/core/List';
import { List } from 'immutable';
import * as React from 'react';
import { TypedMap } from '../../core/types/TypedMap';
import { Recipe } from './Recipe';

const styles = (materialTheme: Theme) =>
    createStyles({
        cookbookPaper: {
            background: 'rgba(111,77,0,0.3)',
            marginTop: materialTheme.spacing.unit * 6,
            marginBottom: materialTheme.spacing.unit * 6,
            padding: materialTheme.spacing.unit * 2
        },
        recipePaper: {
            overflow: "hidden",
            background: 'rgba(255,255,255,0.4)',
            marginTop: materialTheme.spacing.unit * 6,
            marginBottom: materialTheme.spacing.unit * 6,
            padding: materialTheme.spacing.unit * 2
        }
    });

interface CookbookProps {
    cookbook?: List<TypedMap<Recipe>>;
    removeRecipe: (index: number) => void | any;
}

interface RecipeItemProps extends Pick<CookbookProps, 'removeRecipe'> {
    recipe: TypedMap<Recipe>;
    index: number;
}

const RecipeItem = (props: RecipeItemProps) => {
    if (!props.recipe) {
        return null;
    }

    return (
        <Grid container zeroMinWidth direction="row" alignItems="center">
            <Grid item lg={9} xs={12}>
                <Typography variant="h4">{props.recipe.get('name')}</Typography>
                <Typography variant="body1">{props.recipe.get('description')}</Typography>
                <ListContainer>
                    {props.recipe.has('ingredients')
                        ? props.recipe.get('ingredients')!.map((ingredient, ii) => (
                              <ListItem key={ii}>
                                  {ingredient!.get('amount')} {ingredient!.get('name')}
                              </ListItem>
                          ))
                        : ''}
                </ListContainer>
            </Grid>
            <Grid item xs={3}>
                <Button
                    variant="outlined"
                    color="primary"
                    mini={true}
                    onClick={() => {
                        props.removeRecipe(props.index);
                    }}
                >
                    Remove Recipe
                </Button>
            </Grid>
        </Grid>
    );
};

const CookbookComponent: React.FunctionComponent<WithStyles<typeof styles> & CookbookProps> = ({
    cookbook,
    removeRecipe,
    classes
}) => {
    let recipeList: JSX.Element[] = [];
    if (cookbook) {
        cookbook.forEach((recipe, index) => {
            if (recipe) {
                recipeList.push(
                    <Paper className={classes.recipePaper} key={`recipe-${index}`}>
                        <RecipeItem
                            recipe={recipe}
                            removeRecipe={removeRecipe}
                            index={index || 0}
                        />
                    </Paper>
                );
            }
        });
    } else {
        recipeList = [];
    }
    return (
        <Paper className={classes.cookbookPaper}>
            <Typography align="center" variant="h3" gutterBottom>
                Cookbook
            </Typography>
            {recipeList}
        </Paper>
    );
};
export const Cookbook = withStyles(styles)(CookbookComponent);
