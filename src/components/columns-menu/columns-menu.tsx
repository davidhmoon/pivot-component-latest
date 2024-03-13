import { XMarkIcon, EyeIcon, Bars2Icon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ReactSortable } from 'react-sortablejs';
import { Column } from '../../utils/interfaces';
import { useEffect, useState } from 'react';
import styles from './columns-menu.module.scss';

export interface ColumnsMenuProps {
    className?: string;
    columns: Column[];
    label: string;
    onClose: () => void;

    updateColumns: (newColumns: Column[]) => void;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */

export const ColumnsMenu = ({ columns, label, onClose, updateColumns }: ColumnsMenuProps) => {
    const [columns_, setColumns] = useState(columns);
    const [refreshData, setRefreshData] = useState(false);
    const [showAll, setShowAll] = useState(true);

    const ChangeAllShowColumns = () => {
        const updatedArr = columns_.map((c: any) => {
            return { ...c, show: showAll };
        });
        setColumns(updatedArr);
        updateColumns(updatedArr);
    };

    const ChangeShowColumns = (item: any) => {
        const updatedArr = columns_.map((c: any) => {
            if (item.name === c.name) {
                return { ...c, show: !item.show };
            }
            return c;
        });

        setColumns(updatedArr);
        updateColumns(updatedArr);
    };

    useEffect(() => {
        if (refreshData) {
            updateColumns(columns_);
            setRefreshData(false);
        }
        setShowAll(!columns_.every((i: Column) => i.show));
    }, [columns_]);

    return (
        <div
            className={
                'p-1 drop-shadow-lg rounded-md bg-white min-w-[280px] overflow-y-auto absolute  h-[28.5vh] overflow-y-auto top-10 right-0 ' +
                styles.menuColumns
            }
            id="columnsTools"
        >
            <div className="flex justify-between font-semibold text-dark-gray py-2 px-2">
                <p className="text-base">Customize {label}</p>
                <div style={{ cursor: 'pointer' }} onClick={onClose}>
                    <XMarkIcon className="h-6 w-6 text-red-900" />
                </div>
            </div>
            <hr />
            <div key={'all-01'} className="p-2 text-xs flex justify-between">
                <div className="flex justify-center gap-1">All</div>
                <div onClick={() => ChangeAllShowColumns()}>
                    {!showAll ? (
                        <EyeIcon style={{ cursor: 'pointer' }} className="h-4" />
                    ) : (
                        <EyeSlashIcon style={{ cursor: 'pointer' }} className="h-4" />
                    )}
                </div>
            </div>
            <ReactSortable
                list={columns_}
                setList={setColumns}
                onStart={() => {
                    setRefreshData(false);
                }}
                onEnd={() => {
                    setRefreshData(true);
                }}
            >
                {columns_.map((item: any) => (
                    item.name !== "checkbox" ? (
                        <div key={item.id} className="p-2 text-xs flex justify-between">
                            <div className="flex justify-center gap-1">
                                <Bars2Icon className="h-4" /> {item.name}
                            </div>
                            <div onClick={() => ChangeShowColumns(item)}>
                                {item.show ? (
                                    <EyeIcon style={{ cursor: 'pointer' }} className="h-4" />
                                ) : (
                                    <EyeSlashIcon style={{ cursor: 'pointer' }} className="h-4" />
                                )}
                            </div>
                        </div>
                    ) : <div></div>
                ))}
            </ReactSortable>
        </div>
    );
};
