import styles from './pivot-contents.module.scss';
import classNames from 'classnames';
import { PivotRow } from '../pivot-row/pivot-row';


export interface PivotContentsProps {
  className?: string;
  columns: object[];
  groups: any;
  rows: any;
  setRows: any;
  childOrder: any
  PivotService: any
  filters: any
  sort_by: any;
  isExpanded?: boolean;
}

export const PivotContents = ({ className, columns, groups, rows, setRows, childOrder, PivotService, filters, sort_by, isExpanded = false }: PivotContentsProps) => {


  /*   const [colorAccumulator] = useState(1)
    const [groupsAccumulator] = useState(0) */

  const toggleArrow = (row: any, eventType: any = 0) => {

    const updatedRows = [...rows];
    if (eventType === 1) {
      setRows(updatedRows);
    } else {
      row.arrowToggle = !row.arrowToggle;
    }

  };


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
        return parseFloat(row);
      });
    });


  }
  computeFields(rows)



  /* function computeFields(rows:any) {
    // select only columns which have computed function
    let computedColumns = columns.filter((c:any) => c.computed);
    let rowsHolder=[...rows]
 
    // for each computed column...
    computedColumns.forEach((column:any) => {
      // compute each row...
      rowsHolder.map((row:any) => {
        rowsHolder[column.key] = column.computed(row);
        if (column.key === "wow_gr") {
        }
        return row;
      });
    });
    console.log("rowsHOlder", rowsHolder)
    setRows(rowsHolder)
    console.log("rows", rows)

  }
  useEffect(() => {
    // Call computeFields when totalsArray changes
    computeFields(rows);
  }, []); */

  return (

    <div className={classNames(styles.root, className)}>
      {rows.map((row: any, index: any) => (
        <PivotRow
          key={index}
          row={row}
          columns={columns}
          groups={groups}
          toggleArrow={toggleArrow}
          groupsAccumulator={0}
          childOrder={childOrder}
          colorAccumulator={1}
          PivotService={PivotService}
          filters={filters}
          sort_by={sort_by}
          isExpanded={isExpanded}
        />
      ))}
    </div>



  );
};