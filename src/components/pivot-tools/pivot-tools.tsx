import styles from './pivot-tools.module.scss';
import classNames from 'classnames';
import { ColumnsMenu } from '../columns-menu/columns-menu';
import { useState } from 'react';
import { Button } from '../button/button';
import { Column } from '../../utils/interfaces';
import {
    ViewColumnsIcon,
    ArrowsUpDownIcon,
    ArrowDownTrayIcon,
    ArrowDownIcon,
    ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { Spinner } from 'flowbite-react';
import ClickAwayListener from 'react-click-away-listener';
export interface PivotToolsProps {
    className?: string;
    title?: string;
    groups: any[];
    columns: Column[];
    onChangeColumns?: (newColumns: Column[]) => void | undefined;
    onChangeHierachy?: (newItems: any[]) => void | undefined;
    exportLoader?: boolean;
    onExportData?: any;
    isExport?: boolean;
    setColumns: any;
    isExpanded?: boolean;
    setIsExpanded?: any;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PivotTools = ({
    className,
    columns,
    groups,
    onChangeColumns,
    onChangeHierachy,
    title = '',
    exportLoader = false,
    onExportData = {},
    isExport = false,
    setColumns,
    isExpanded = false,
    setIsExpanded = {},
}: PivotToolsProps) => {
    const [columnEditor, setColumnEditor] = useState(false);
    const [hierarchyEditor, setHierarchyEditor] = useState(false);

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles['tools-wrapper']}>{title}</div>
            <div className={styles['tools-wrapper']}>
                <div className="relative h-auto">
                    <Button
                        click={() => {
                            setIsExpanded(!isExpanded);
                        }}
                        styleProp="inline-block rounded border px-2 py-1 text-sm font-medium focus:outline-none focus:ring border-light-gray bg-white text-dark-gray flex gap-1 items-center h-full"
                    >
                        {!isExpanded ? (
                            <ArrowDownIcon className="h-4 w-4" />
                        ) : (
                            <ArrowUpIcon className="h-4 w-4" />
                        )}
                        {!isExpanded ? 'Expand' : 'Collapse'}
                    </Button>
                </div>
                <div className="relative h-auto">
                    <Button
                        click={() => setColumnEditor(!columnEditor)}
                        styleProp="inline-block rounded border px-2 py-1 text-sm font-medium focus:outline-none focus:ring border-light-gray bg-white text-dark-gray flex gap-1 items-center h-full"
                    >
                        <ViewColumnsIcon className="h-4 w-4" /> Columns
                    </Button>
                    {columnEditor && onChangeColumns && (
                        <ClickAwayListener
                            onClickAway={(event: any) => {
                                if (columnEditor && event.target?.id !== 'menuToolsBar')
                                    setColumnEditor(false);
                            }}
                            className={styles.menuInTools}
                        >
                            <ColumnsMenu
                                className="menuToolsBar"
                                columns={columns.slice(1)}
                                label={'Columns'}
                                onClose={() => setColumnEditor(false)}
                                updateColumns={(newColumns: Column[]) => {
                                    setColumns(newColumns);
                                    onChangeColumns(newColumns);
                                }}
                            />
                        </ClickAwayListener>
                    )}
                </div>

                <div className="relative h-auto">
                    <Button
                        click={() => setHierarchyEditor(!hierarchyEditor)}
                        styleProp="inline-block rounded border px-2 py-1 text-sm font-medium focus:outline-none focus:ring border-light-gray bg-white text-dark-gray flex gap-1 items-center h-full"
                    >
                        <ArrowsUpDownIcon className="h-4 w-4" /> Hierarchy
                    </Button>
                    {hierarchyEditor && onChangeHierachy && (
                        <ClickAwayListener
                            onClickAway={(event: any) => {
                                if (hierarchyEditor && event.target?.id !== 'menuToolsBar')
                                    setHierarchyEditor(false);
                            }}
                            className={styles.menuInTools}
                        >
                            <ColumnsMenu
                                columns={groups}
                                className="menuToolsBar"
                                label={'Hierarchy'}
                                onClose={() => setHierarchyEditor(false)}
                                updateColumns={(newItems: any[]) => onChangeHierachy(newItems)}
                            />
                        </ClickAwayListener>
                    )}
                </div>
                {isExport && (
                    <div className={styles['tools-wrapper']}>
                        <Button
                            click={onExportData}
                            styleProp="inline-block rounded border px-2 py-1 text-sm font-medium focus:outline-none focus:ring border-light-gray bg-white text-dark-gray flex gap-1 items-center h-full"
                        >
                            {exportLoader ? (
                                <Spinner size="sm" />
                            ) : (
                                <ArrowDownTrayIcon className="h-4 w-4" />
                            )}
                            Export
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
