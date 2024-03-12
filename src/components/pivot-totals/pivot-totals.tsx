import styles from './pivot-totals.module.scss';
import classNames from 'classnames';

export interface PivotTotalsProps {
    className?: string;
    children:any
    column:any
}




export const PivotTotals = ({ className, children }: PivotTotalsProps) => {
    return <div className={classNames(styles.root, className, styles.flex, styles.pivotTotal)}><span>{children}</span></div>;

   /*  (column.style) ? 
    <div className={classNames(styles.root, className, styles.flex, styles.pivotTotal)} style={column.style(children)}>{children}</div> :
    <div className={classNames(styles.root, className, styles.flex, styles.pivotTotal)}>{children}</div> */

};
