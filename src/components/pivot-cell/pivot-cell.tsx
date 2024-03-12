import styles from './pivot-cell.module.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { Column } from '../../utils/interfaces'
export interface PivotCellProps {
    className?: any;
    children: any;
    column: Column;
    groups: any;
    leftMost: boolean;
    groupsAccumulator: any;
    row: any;
    width: any;
    onColumnResize: any;
    rgb: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PivotCell = ({
    className,
    children,
    column,
    groups,
    groupsAccumulator,
    row,
    rgb,
}: //  width, onColumnResize
PivotCellProps) => {
    // console.log(width)
    // console.log(onColumnResize)
    const [clicked, setClicked] = useState(false);
    function clickSet() {
        setClicked(!clicked);
    }
    /* function columnOnClick () {
        column.onClick()
    }
 */
    function allFunctions() {
        /* columnOnClick() */
        clickSet();
    }

    function conditionals() {
        if (column.formatter && column.style) {
            return (
                <>
                    <div
                        className={classNames(styles.root, className, styles.pivotCell)}
                        style={  typeof column.style =='function' ? { ...column.style(row), ...{ backgroundColor: rgb } } : {...column.style,...{ backgroundColor: rgb }}}
                        onClick={allFunctions}
                    >
                        {column.formatter(children)}
                    </div>
                </>
            );
        } else if (column.formatter) {
            return (
                <>
                    <div
                        className={classNames(styles.root, className, styles.pivotCell)}
                        onClick={allFunctions}
                        style={{ backgroundColor: rgb }}
                    >
                        {column.formatter(children)}
                    </div>
                </>
            );
        } else if (column.style) {
            return (
                <>
                    <div
                        className={classNames(styles.root, className, styles.pivotCell)}
                        onClick={allFunctions}
                        style={ typeof column.style =='function' ? { ...column.style(row), ...{ backgroundColor: rgb } } : {...column.style,...{ backgroundColor: rgb }}}
                    >
                        {children}
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div
                        className={classNames(styles.root, className, styles.pivotCell)}
                        onClick={allFunctions}
                        style={{ backgroundColor: rgb }}
                    >
                        {children}
                    </div>
                </>
            );
        }
    }

    return groupsAccumulator > groups.length ? null : conditionals();
    /* (column.formatter && typeof(children)==="number") ?
          <div className={classNames(styles.root, className, styles.pivotCell)} onClick={allFunctions}>{column.formatter(children)}</div> : 

        <div className={classNames(styles.root, className, styles.pivotCell)} onClick={allFunctions}>{children}</div> */
};
