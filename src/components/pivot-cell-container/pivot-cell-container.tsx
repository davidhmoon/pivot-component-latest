import { useState } from 'react';
import styles from './pivot-cell-container.module.scss';
import classNames from 'classnames';
import { PivotCell } from '../pivot-cell/pivot-cell';
import {Column } from '../../utils/interfaces'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
export interface PivotCellContainerProps {
    className?: string;
    row: object | any;
    columns: object[];
    groups: any;
    handleClick?: any; // Add the handleClick prop
    groupsAccumulator?: any;
    colorAccumulator?: any;
    rgb: string;
}

export const PivotCellContainer = ({
    className,
    row,
    columns,
    groups,
    handleClick,
    groupsAccumulator,
    colorAccumulator,
    rgb,
}: PivotCellContainerProps) => {
    const [columnWidths, setColumnWidths] = useState<number[]>(Array(columns.length).fill(150));
    const handleColumnResize = (index: number, newWidth: number) => {
        const newColumnWidths = [...columnWidths];
        newColumnWidths[index] = newWidth;
        setColumnWidths(newColumnWidths);
    };

    return (
        <div
            onClick={(event) => {
                if (event.currentTarget.classList.contains('pindex2') === true) {
                    handleClick(row, 1);
                } else {
                    handleClick(row);
                }
                //console.log({ ...row, arrowToggle: !row?.arrowToggle }, "123");

                // clickSet(row);
            }}
            //onMouseLeave={()=>{ setHoverEffect(false)}}
            className={classNames(styles.root, className, styles.block)}
        >
            {columns.map((c: object , index) => {
                const column : Column =  c as Column
                return index === 0 ? (
                    <PivotCell
                        key={index}
                        leftMost={true}
                        groups={groups}
                        className="pivotCell"
                        column={column }
                        groupsAccumulator={groupsAccumulator}
                        row={row}
                        rgb={rgb}
                        width={columnWidths[index]} // Pass the width as a prop to the PivotCell
                        onColumnResize={(newWidth: any) => handleColumnResize(index, newWidth)}
                    >
                        <span
                            className={classNames(styles.innerSpan)}
                            style={{
                                marginLeft: groupsAccumulator * 12 + 17 + 'px',
                                background: ``,
                            }}
                        >
                            <div>
                                {groups.length !== colorAccumulator ? (
                                    row.arrowToggle ? (
                                        <ChevronDownIcon className="h-5 w-5" />
                                    ) : (
                                        <ChevronRightIcon className="h-5 w-5" />
                                    )
                                ) : (
                                    '-'
                                )}
                            </div>
                            <span className={classNames(styles.innerInnerSpan)}>
                                {row[column.key ? column.key  : ''] || row['country__name'] || ''} 
                            </span>
                        </span>
                    </PivotCell>
                ) : ( column.show &&
                    <PivotCell
                        key={index}
                        leftMost={false}
                        groups={groups}
                        className="pivotCell"
                        column={column}
                        groupsAccumulator={groupsAccumulator}
                        row={row}
                        width={columnWidths[index]} // Pass the width as a prop to the PivotCell
                        onColumnResize={(newWidth: any) => handleColumnResize(index, newWidth)}
                        rgb={rgb}
                    >
                        {row[column.key ? column.key : '']}
                    </PivotCell>
                );
            })}
        </div>
    );
};
