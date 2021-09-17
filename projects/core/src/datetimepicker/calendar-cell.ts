/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
export class MatDatetimepickerCalendarCell {
  constructor(
    public value: number,
    public displayValue: string,
    public ariaLabel: string,
    public enabled: boolean,
  ) {}
}
