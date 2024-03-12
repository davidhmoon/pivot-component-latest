import styles from './pivot-table.module.scss';
import classNames from 'classnames';
import { PivotHeader } from '../pivot-header/pivot-header';
import { PivotContents } from '../pivot-contents/pivot-contents';
import { useEffect, useState } from 'react';
import { PivotTotals } from '../pivot-totals/pivot-totals';
import { boardRows, boardTotals } from '../../utils/constants';
import { PivotTools } from '../pivot-tools/pivot-tools';
import {
    Column,
    GroupDataProps,
    Query,
    //    , QueryV1Response
} from '../../utils/interfaces';
import {
    //exportData,
    groupData,
} from '../../services/python-services';
import { Loader } from '../loader/loader';
export interface PivotTableProps {
    className?: string;
    PivotService: any;
    initialGroups: any[];
    filters?: object;
    columns: Column[];
    isStatic?: boolean;
    title?: string;
    isExport?: boolean;
    queries_to_export?: Query[];
}

export const PivotTable = ({
    className,
    PivotService,
    initialGroups,
    filters = {},
    columns,
    title,
    isStatic = false,
    isExport = false,
    queries_to_export,
}: PivotTableProps) => {
    //let groups = initialGroups;
    const [rows, setRows] = useState([] as any);
    const [childOrder] = useState('');
    const [totalsArray, setTotalsArray] = useState([] as any);

    //expand all items
    const [isExpanded, setIsExpanded] = useState(false);

    // customizations
    const [columns_, setColumns] = useState(columns);
    const [groups, setGroups] = useState(initialGroups);
    //export excel
    const [loadingExcel, setLoadingExcel] = useState(false);
    const [sort_by, setSortBy] = useState<[string, boolean]>([
        columns_[0].key ? columns_[0].key : '',
        true,
    ]);
    const [loadData, setLoadData] = useState(false);
    const [isInitCallDone, setIsInitCallDone] = useState(false);

    const dataCall = async () => {
        if (!isStatic) {
            setLoadData(true);
            const resData = await PivotService(`groups:${groups[0].id}$${groups[0].group}`, {
                ...filters,
            });
            setRows(
                resData?.data?.map((i: any) => {
                    //i.group__ = i[this.groups[0].group];
                    //delete i[this.groups[0].group];
                    let split = i.aggrupation.split('$$');
                    i.group__ = split.length > 1 ? i.aggrupation.split('$$')[1] : split[0];
                    // i.group__ = i.aggrupation.split("$$")[1];

                    return i;
                })
            );
            setTotalsArray(resData.totals);
            setLoadData(false);
        } else {
            setRows(boardRows);
            setTotalsArray(boardTotals);
        }
    };

    function computeFields() {
        // select only columns which have computed function
        let computedTotals = columns_.filter((c: any) => c.computedTotals);
        computedTotals.forEach((column: any) => {
            if (totalsArray.length > 0) {
                let totalsArrayHolder = [...totalsArray];
                totalsArrayHolder[0][column.key] = column.computedTotals(
                    totalsArrayHolder[0],
                    rows
                );
                setTotalsArray(totalsArrayHolder);
            }
        });
    }

    function selectSortKey(key: any) {
        setSortBy([key, !sort_by[1]]);
    }

    const sortRows = () => {
        const [f, asc] = sort_by;
        let rowsHolder = [...rows];
        rowsHolder.sort(function s(a, b, field = f, ascending = asc) {
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

        setRows(rowsHolder);
    };
    useEffect(() => {
        sortRows();
    }, [sort_by]);

    useEffect(() => {
        if (!isInitCallDone) {
            console.log(1);
            setIsInitCallDone(true);
        } else {
            console.log(2);
            dataCall();
        }
    }, [filters]);

    useEffect(() => {
        if (!isInitCallDone) {
            setIsInitCallDone(true);
        } else {
            dataCall();
            // setIsInitCallDone(false);
        }
    }, [groups]);

    useEffect(() => {
        // Call computeFields when totalsArray changes
        computeFields();
    }, [rows]);
    /*  for children rows */
    const updateColumns = (newColumns: Column[]) => {
        setColumns(newColumns);
    };
    const reduceColumns = () => {
        const res = columns_.reduce((result: any, column: any) => {
            if (column.show === true) {
                result[column.key] = column.name;
            }
            return result;
        }, {});
        const modifiedObject = Object.fromEntries(
            Object.entries(res).filter(([key]) => key !== 'group__')
        );
        const res2 = groups.reduce((result: any, column: any) => {
            result[column.group] = column.name;
            return result;
        }, {});
        return { ...res2, ...modifiedObject };
    };
   
    const exportExcel = async () => {
        const col = reduceColumns();

        const payloadGroupData: GroupDataProps = {
            queries: queries_to_export!,
            export: {
                columns: col,
                format: 'xlsx',
            },
        };
        const res = await groupData(payloadGroupData, filters);
        window.open(res['url']);
        setLoadingExcel(false);
    };
   
    useEffect(() => {
        // Call computeFields when totalsArray changes
        if (!isExpanded) dataCall();
    }, [isExpanded]);
    return (
        <>
            <div className={classNames(styles.root, className)}>
                <div className={styles['pivot-top-container']}>
                    <PivotTools
                        onChangeColumns={updateColumns}
                        onChangeHierachy={(h: any[]) => setGroups(h)}
                        groups={groups}
                        title={title}
                        columns={columns_}
                        setColumns={setColumns}
                        exportLoader={loadingExcel}
                        onExportData={exportExcel}
                        isExport={isExport}
                        // isExpanded={isExpanded}
                        setIsExpanded={setIsExpanded}
                    />
                    <PivotHeader
                        columns={columns_}
                        selectSortKey={selectSortKey}
                        sort_by={sort_by}
                    />
                </div>
                {loadData ? (
                    <div style={{ height: '300px' }}>
                        <Loader />
                    </div>
                ) : (
                    <>
                        <PivotContents
                            childOrder={childOrder}
                            setRows={setRows}
                            rows={rows}
                            groups={groups}
                            columns={columns_}
                            PivotService={PivotService}
                            filters={filters}
                            sort_by={sort_by}
                            isExpanded={isExpanded}
                            // setIsExpanded={setIsExpanded}
                        />

                        <div className={classNames(styles.flex, className)}>
                            {columns_.map((c: object, index: any) => {
                                const column = c as Column;
                                if (!column.show) return;
                                return (
                                    <PivotTotals column={column} key={index} className="flex">
                                        {totalsArray.map((object: any) =>
                                            column.formatter && object[column.key ? column.key : '']
                                                ? column.formatter(
                                                      object[column.key ? column.key : '']
                                                  )
                                                : object[column.key ? column.key : '']
                                        )}
                                    </PivotTotals>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* {columns.map((column:any)=>{return <PivotTotals> {column.formatter ? column.formatter(totalsArray[column.key]) : totalsArray[column.key]} </PivotTotals>})} */}
        </>
    );
};
