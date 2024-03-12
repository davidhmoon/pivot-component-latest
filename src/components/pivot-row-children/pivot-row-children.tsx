import styles from './pivot-row-children.module.scss';
import classNames from 'classnames';
import { PivotRow } from '../pivot-row/pivot-row';

export interface PivotRowChildrenProps {
    childOrder: any
    className?: string;
    rows: any
    columns: any;
    groups: any;
    toggleArrow: any;
    setRow: any
    groupsAccumulator: any
    colorAccumulator: any
    PivotService: any
    filters: any
    sort_by: any;
    isExpanded?: boolean;
    // handleClick?:any;
}


export const PivotRowChildren = ({ className, rows, columns, groups, toggleArrow, groupsAccumulator, colorAccumulator, childOrder, PivotService, filters, sort_by
    , isExpanded, }: PivotRowChildrenProps) => {

    function computeFields(rows: any) {
        // select only columns which have computed function
        let computedColumns = columns.filter((c: any) => c.computed);

        // for each computed column...
        computedColumns.forEach((column: any) => {
            // compute each row...
            rows.map((row: any) => {
                row[column.key] = column.computed(row);
                if (column.key === "wow_gr") {
                }
                return row;
            });
        });

    }

    computeFields(rows)

    return (
        <div className={classNames(styles.root, className)}>
            {rows.map((child: any, index: number) => (
                <PivotRow
                    key={index}
                    row={child}
                    columns={columns}
                    groups={groups}
                    toggleArrow={toggleArrow}
                    groupsAccumulator={groupsAccumulator + 1}
                    colorAccumulator={colorAccumulator + 1}
                    childOrder={childOrder}
                    PivotService={PivotService}
                    filters={filters}
                    sort_by={sort_by}
                    isExpanded={isExpanded}
                />
            ))}
        </div>
    );
};


