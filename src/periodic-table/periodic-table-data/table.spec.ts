import { TABLE, TABLE_DICO_CLASS} from "./table";
import { TABLE_V2 } from "./table-v2";

describe("Period table definition", () => {
  it('should have n elements', () => {
    expect(TABLE.length).toBe(114);
    expect(TABLE_V2.length).toBe(120);
    expect(Object.keys(TABLE_DICO_CLASS).length).toBe(114);
  });

  it('should return the correct element', () => {
    expect(TABLE_DICO_CLASS).toHaveProperty('H', 'element-non-metal');
  });
});
