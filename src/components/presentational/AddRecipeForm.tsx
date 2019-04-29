import { Button, Grid, Typography } from "@material-ui/core";
import { css } from "emotion";
import {
  Field,
  FieldArray,
  Form,
  FormikProps,
  FormikValues,
  withFormik
} from "formik";
import { TextField } from "formik-material-ui";
import * as React from "react";
import { history } from "../../core/store";
import { Recipe } from "./Recipe";

interface AddRecipeProps extends Partial<Recipe> {
  addRecipe: (recipe: Recipe, empty?: boolean) => void;
  empty: boolean;
}

const AddRecipeFormComponent = (
  props: AddRecipeProps & FormikProps<Recipe>
) => (
  <Grid container direction="column">
    <Form>
      <Field
        name="name"
        placeholder="name of recipe ex: boeuf bourguignon"
        label="Recipe Name"
        margin="normal"
        variant="outlined"
        required
        fullWidth
        validate={(val: any) =>
          val === "" ? "Value cannot be empty" : undefined
        }
        component={TextField}
      />
      <Field
        name="description"
        placeholder="Enter your recipe description"
        label="Description"
        margin="normal"
        variant="outlined"
        fullWidth
        multiline
        rows={5}
        component={TextField}
      />

      <Typography variant="subheading">Ingredients:</Typography>

      <Grid item xs>
        <FieldArray
          name="ingredients"
          render={({ push }) => {
            return Array.from(new Array(5)).map((_: any, ii: number) => (
              <Grid
                container
                direction="row"
                key={`ingredient-${ii}`}
                justify="space-between"
                spacing={16}
              >
                <Grid item sm={2} xs={4}>
                  <Field
                    width=""
                    label="Amount"
                    key={`ingredient-${ii}-amount`}
                    name={`ingredients[${ii}].amount`}
                    margin={"normal"}
                    variant="outlined"
                    component={TextField}
                    className={css({ root: { margin: "1em" } })}
                  />
                </Grid>
                <Grid sm={10} xs={12} item>
                  <Field
                    label="Ingredient Name"
                    key={`ingredient-${ii}-name`}
                    name={`ingredients[${ii}].name`}
                    margin="normal"
                    fullWidth={true}
                    variant="outlined"
                    component={TextField}
                  />
                </Grid>
              </Grid>
            ));
          }}
        />
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Button
              type="button"
              color="primary"
              variant="outlined"
              onClick={() => history.replace("/")}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" color="secondary" variant="contained">
              Create Recipe
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Form>
  </Grid>
);

export const AddRecipeForm = withFormik<AddRecipeProps, Recipe>({
  // Transform outer props into form values
  mapPropsToValues: props => {
    return {
      name: props.name || "",
      description: props.description || "",
      ingredients: props.ingredients || []
    };
  },
  // Add a custom validation function (this can be async too!)
  validate: (values: FormikValues) => {
    return {};
  },
  handleSubmit: (values, bag) => {
    console.log(bag);
    bag.props.addRecipe(
      {
        name: values.name,
        description: values.description,
        ingredients: values.ingredients
      },
      bag.props.empty
    );
  }
})(AddRecipeFormComponent);
