import { TABLE, TABLE_DICO } from "./table";

describe("Period table definition", () => {
  it('should have n elements', () => {
    expect(TABLE.length).toBe(114);
    expect(Object.keys(TABLE_DICO).length).toBe(114);
  });

  it('should return the correct element', () => {
    expect(TABLE_DICO).toHaveProperty('H', {symbol:'H', "elementNumber": "1", class: 'element-non-metal'});
  });
});
