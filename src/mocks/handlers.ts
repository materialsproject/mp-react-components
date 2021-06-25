import { rest } from 'msw';
import { autocompleteQuery, autocompleteResponse } from './constants/autocomplete';
import { materialsByIdQuery, materialsByIdResponse } from './constants/materialsById';
import {
  materialsByStabilityQuery,
  materialsByStabilityResponse
} from './constants/materialsByStability';
import { materialsByVolumeQuery, materialsByVolumeResponse } from './constants/materialsByVolume';
import { materialsUnfilteredResponse } from './constants/materialsUnfiltered';

export const handlers = [
  /**
   * Formula autocomplete mock request
   */
  rest.get(process.env.REACT_APP_AUTOCOMPLETE_URL || '', (req, res, ctx) => {
    const autocompleteText = req.url.searchParams.get('formula');
    if (autocompleteText === autocompleteQuery) {
      return res(ctx.json(autocompleteResponse));
    } else {
      return res(ctx.json({ message: 'The supplied query Query does not have a mocked response' }));
    }
  }),
  /**
   * Material search mock request
   */
  rest.get(process.env.REACT_APP_BASE_URL + 'search', (req, res, ctx) => {
    const materialId = req.url.searchParams.get('material_ids');
    const volumeMax = req.url.searchParams.get('volume_max');
    const isStable = req.url.searchParams.get('is_stable');
    if (materialId === materialsByIdQuery) {
      return res(ctx.json(materialsByIdResponse));
    } else if (volumeMax && parseFloat(volumeMax) === materialsByVolumeQuery[1]) {
      return res(ctx.json(materialsByVolumeResponse));
    } else if (isStable === materialsByStabilityQuery) {
      return res(ctx.json(materialsByStabilityResponse));
    } else {
      return res(ctx.json(materialsUnfilteredResponse));
    }
  })
];
