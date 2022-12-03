import { parseRestriction, Restriction } from './Restriction.js';

export class Pattern {
  restrictions: Restriction[][];

  constructor(restrictions: string) {
    this.restrictions = [];

    const rows = restrictions
      .split('\n')
      .map((row) => row.trim())
      .filter(Boolean);

    rows.forEach((row) => {
      const rowRestrictions = row
        .split('')
        .filter(Boolean)
        .map(parseRestriction);
      this.restrictions.push(rowRestrictions);
    });
  }

  get = (row: number, column: number) => {
    return this.restrictions[row][column];
  };
}
