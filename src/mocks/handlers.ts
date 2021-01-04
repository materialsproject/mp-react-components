import { rest } from 'msw';
import { autocompleteResponse } from './data/autocomplete'

export const handlers = [
  rest.get('https://api.materialsproject.org/materials/formula_autocomplete/?text=GaN', (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.json(autocompleteResponse));
  })
];