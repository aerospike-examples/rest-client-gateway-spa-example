export class Recipe {
    constructor (
    public name?: string,
    public description?: string,
    public ingredients?: Ingredient[]
    ){}
}
export interface Ingredient {
    amount: string;
    name: string;
}
