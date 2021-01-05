import { rest } from 'msw';
import { autocompleteParam, autocompleteResponse } from './data/autocomplete'
import { materialIdParam, materialIdResponse } from './data/materialId';
import { unfilteredMaterialsResponse } from './data/unfilteredMaterials';

export const handlers = [
  /**
   * Formula autocomplete mock request
   */
  rest.get(process.env.REACT_APP_AUTOCOMPLETE_URL || '', (req, res, ctx) => {
    const autocompleteText = req.url.searchParams.get('text');
    if (autocompleteText === autocompleteParam) {
      return res(ctx.json(autocompleteResponse));
    } else {
      return res(ctx.json({message: 'The supplied query param does not have a mocked response'}));
    }
  }),
  /**
   * Material search mock request
   */
  rest.get(process.env.REACT_APP_BASE_URL + 'search', (req, res, ctx) => {
    const materialId = req.url.searchParams.get('task_ids');
    if (materialId === materialIdParam) {
      return res(ctx.json(materialIdResponse));
    } else {
      return res(ctx.json(unfilteredMaterialsResponse));
    }
  })
];