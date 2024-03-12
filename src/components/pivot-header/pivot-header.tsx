import styles from './pivot-header.module.scss';
import classNames from 'classnames';
import { PivotHead } from '../pivot-head/pivot-head';
import { Column } from '../../utils/interfaces';

export interface PivotHeaderProps {
    className?: string;
    columns: object[];
    selectSortKey: any;
    sort_by: [string, boolean];
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */

export const PivotHeader = ({ className, columns, selectSortKey, sort_by }: PivotHeaderProps) => {
    return (
        <div className={classNames(styles.root, className, styles.flex)}>
            {columns.map((c: object, index) => {
                const column = c as Column;
                return (
                    column.show && (
                        <PivotHead
                            column={column}
                            selectSortKey={selectSortKey}
                            key={index}
                            index={index}
                            sort_by={sort_by}
                        >
                            {column.name}
                            
                        </PivotHead>

                    )
                );
            })}
        </div>
    );
};
