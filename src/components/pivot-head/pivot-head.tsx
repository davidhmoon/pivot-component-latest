import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import styles from './pivot-head.module.scss';
import classNames from 'classnames';


export interface PivotHeadProps {
  className?: string;
  children: string
  selectSortKey: any
  column: any
  index: any;
  sort_by: [string, boolean];
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PivotHead = ({ className, children, selectSortKey, column, index, sort_by }: PivotHeadProps) => {
  return (
    <div
      onClick={() => {
        selectSortKey(column.key);
      }}
      className={classNames(styles.root, className, styles.pivotHead)}
    >
      <span
        className={classNames(styles.chicken, {
          [styles.firstSpan]: index === 0, // Apply the firstSpan style if it's the first index
        }) + " mr-1"}
      >
        {children}
      </span>
      {sort_by[0] === column.key  &&
        <span className={styles.iconsSort}>
          <ArrowsUpDownIcon className={styles.iconSort} />
        </span>
      }
    </div>
  );
};

