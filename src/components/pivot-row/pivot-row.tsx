import styles from './pivot-row.module.scss';
import classNames from 'classnames';
import { PivotCellContainer } from '../pivot-cell-container/pivot-cell-container';
import { PivotRowChildren } from '../pivot-row-children/pivot-row-children';
import { useEffect, useState } from 'react';
import { Spinner } from 'flowbite-react';

export interface PivotRowProps {
    className?: string;
    row: any;
    columns: object[];
    groups: any;
    toggleArrow: any;
    groupsAccumulator: any;
    colorAccumulator: any;
    childOrder: any;
    PivotService: any;
    filters: any;
    sort_by: any;
    isExpanded?: boolean;
}

export const PivotRow = ({
    className,
    row,
    columns,
    groups,
    toggleArrow,
    groupsAccumulator,
    childOrder,
    colorAccumulator,
    PivotService,
    filters,
    sort_by,
    isExpanded = false,
}: PivotRowProps) => {
    const [showChildren, setShowChildren] = useState(false);
    const alpha_shift = 1.8;
    const [red, setRed] = useState(6.222 * (colorAccumulator * alpha_shift + alpha_shift) + 187.8);
    const [green, setGreen] = useState(
        4.556 * (colorAccumulator * alpha_shift + alpha_shift) + 204.4
    );
    const [blue, setBlue] = useState(
        2.667 * (colorAccumulator * alpha_shift + alpha_shift) + 223.3
    );
    const [newRows, setNewRows] = useState('');
    const [loadingData, setLoadingData] = useState(false);
    //const [nextFilters, setNextFilters] = useState(filters)
    useEffect(() => {
        setRed(6.222 * (colorAccumulator * alpha_shift + alpha_shift) + 187.8);
        setGreen(4.556 * (colorAccumulator * alpha_shift + alpha_shift) + 204.4);
        setBlue(2.667 * (colorAccumulator * alpha_shift + alpha_shift) + 223.3);
    }, []);

    const collapseAll = async () => {
        if (isExpanded) {
            await handleClick(row, true);
        }
    };
    useEffect(() => {
        collapseAll();
    }, [isExpanded]);
    const [nextFilters, setNextFilters] = useState({ ...filters });
    const handleClick = async (row: any, eventType: any = 0) => {
        setLoadingData(true);
        //don't call the services when is the last level
        if (groupsAccumulator + 1 < groups.length) {
            //call the services only when are trying to open the next level
            if (!row.arrowToggle) {
                nextFilters[groups[groupsAccumulator].filter] = row.aggrupation.split('$$')[0];
                setNextFilters((prevFilters: object) => ({ ...prevFilters, ...nextFilters }));
                const group =
                    groups[colorAccumulator].group === ''
                        ? `groups:${groups[colorAccumulator].id}`
                        : `groups:${groups[colorAccumulator].id}$${groups[colorAccumulator].group}`;
                const response = await PivotService(group, nextFilters);
                const modifiedResponse = response.data.map((i: any) => {
                    let split;
                    if (typeof i.aggrupation === 'string') {
                        split = i.aggrupation?.split('$$');
                        i.group__ = split.length > 1 ? i.aggrupation?.split('$$')[1] : split[0];
                    } else {
                        if (i.sku) {
                            i.group__ = i.sku;
                        } else {
                            i.group__ = i.aggrupation;
                        }
                    }

                    return i;
                });
                setNewRows(modifiedResponse);
            }

            setShowChildren(!showChildren);

            toggleArrow(row, eventType);
            if (eventType === 0) {
                if (row.arrowToggle) {
                    const updatedChildren = row.childrensArray?.map((child: any) => ({
                        ...child,
                        arrowToggle: false,
                    }));
                    row.childrensArray = updatedChildren;
                }
            }
        }
        setLoadingData(false);
    };

    const sortNewRows = () => {
        const [f, asc]: any = [...sort_by];
        let rowsHolder: any = [...newRows];
        rowsHolder.sort(function s(a: any, b: any, field = f, ascending = asc) {
            if (ascending) {
                if (a[field] < b[field]) {
                    return -1;
                }
                if (a[field] > b[field]) {
                    return 1;
                }
                return 0;
            } else {
                if (a[field] < b[field]) {
                    return 1;
                }
                if (a[field] > b[field]) {
                    return -1;
                }
                return 0;
            }
        });
        setNewRows(rowsHolder);
    };

    useEffect(() => {
        sortNewRows();
    }, [sort_by]);

    const showLoader = () => {
        return (
            loadingData && (
                <div className={styles.loaderSpinner}>
                    <Spinner
                        className={' ' + styles.loaderSpinner}
                        aria-label="Spinner button example"
                    />
                </div>
            )
        );
    };

    return (
        <div className={classNames(styles.root, className, styles.flex)}>
            <div
                style={{ backgroundColor: `rgba(${red}, ${green}, ${blue}, 1)` }}
                className={classNames(styles.cellContainerBlock)}
            >
                <PivotCellContainer
                    className="flex"
                    row={row}
                    columns={columns}
                    handleClick={handleClick}
                    groups={groups}
                    groupsAccumulator={groupsAccumulator}
                    colorAccumulator={colorAccumulator}
                    rgb={`rgba(${red}, ${green}, ${blue}, 1)`}
                />
            </div>
            {showLoader()}
            {showChildren && (
                <PivotRowChildren
                    childOrder={childOrder}
                    rows={newRows}
                    columns={columns}
                    groups={groups}
                    toggleArrow={toggleArrow}
                    setRow={undefined}
                    groupsAccumulator={groupsAccumulator}
                    colorAccumulator={colorAccumulator}
                    PivotService={PivotService}
                    filters={nextFilters}
                    sort_by={sort_by}
                    isExpanded={isExpanded}
                />
            )}
        </div>
    );
};
