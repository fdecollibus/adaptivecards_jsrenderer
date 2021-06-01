import * as React from 'react';
import './LabelValue.scss';
import cx from 'classnames';
import { LVItem } from './LVItem';

export type LabelValueItemType = {
  /**
   * Unique item identification for rendering purposes
   */
  key: string;
  label?: string | JSX.Element;
  /**
   * Value is not mandatory, because it might be unknown/unset
   */
  value?: string | JSX.Element;
  className?: string;
};

type Props = {
  className?: string;
  items?: LabelValueItemType[];
  /**
   * columns (default) - label is above the value, two l-v pairs are shown side by side
   * rows - one l-v pair per row
   */
  mode?: 'columns' | 'rows';
  /**
   * colsSize 46by54 is used in Form
   */
  colsSize?: '50by50';
  /**
   * Child component to render one LVItem.
   * It's possible to pass it here LVItem or HyphenatedLVItem.
   * By default value is LVItem.
   */
  ItemComponent?: React.FC<React.ComponentProps<typeof LVItem>>;
};

/**
 * LabelValue
 *
 * Renders label-value pairs that come either as items prop, or children (LVItem components), or both.
 *
 * @link https://www.w3schools.com/tags/tag_dl.asp
 */
export const LabelValue: React.FC<Props> = ({ className, children, items, mode = 'columns', colsSize, ItemComponent = LVItem }) => {
  return (
    <dl className={cx('LabelValue', `LabelValue--${mode}`, className, colsSize && `LabelValue--colsSize-${colsSize}`)}>
      {items && items.map(item => (
        <ItemComponent key={item.key} label={item.label} className={cx(item.className)}>
          {item.value}
        </ItemComponent>
      ))}
      {children}
    </dl>
  );
};
