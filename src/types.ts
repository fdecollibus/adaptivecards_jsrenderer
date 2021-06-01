/**
 * Type helpers
 *
 * @see https://github.com/Hotell/rex-tils/blob/master/src/types.ts
 * @see https://medium.com/@martin_hotell/improved-redux-type-safety-with-typescript-2-8-2c11a8062575
 */
import { JSXElementConstructor } from 'react';

/**
 * Use this type definition instead of `Function` type constructor
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * Simple alias to save you keystrokes when defining JS typed object maps
 */
export type StringMap<T> = { [key: string]: T };

/**
 * DeepPartial
 *
 * @link https://stackoverflow.com/questions/45372227/how-to-implement-typescript-deep-partial-mapped-type-not-breaking-array-properti
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U> // tslint:disable-line
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
};

/**
 * Type of a change handler function, that infers the event type from the provided component's onChanges's first argument
 *
 * Example:
 * ```
 * const onChange: ChangeHandler<typeof Input> = (event) => { console.log(event.target.value) }
 * ```
 */
export type ChangeHandler<TComp extends JSXElementConstructor<any>> =
  (event: Parameters<Required<React.ComponentProps<TComp>>['onChange']>[0]) => void;

/**
 * Produces union of object properties types
 */
export type ValueOf<T> = T[keyof T];

/**
 * Type of function which returns Partial from parameter type
 */
export type Filter<T> = (param: T) => Partial<T>;

/**
 * Returns a T that has props replaced by K
 */
export type ReplaceProps<T, K extends { [key in keyof T]?: any }> = Omit<T, keyof K> & K;
