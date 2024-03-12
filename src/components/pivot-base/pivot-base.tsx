import { getPivotService } from '../../services/python-services';
import { Column } from '../../utils/interfaces';
import { PivotTable } from '../pivot-table/pivot-table';


export interface PivotBaseProps {
  className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */

export const PivotBase = () => {

  const computedRow = (row: any) => {
    return ((row?.cy_so - row?.ly_so) / row?.ly_so) * 100 || 0;
  };
  const initGroupsPivot = [
    {
      name: "Country",
      id: "point_of_sale_country",
      filter: "point_of_sale_country",
      group: "country__name",
    },
    {
      name: "Account",
      id: "point_of_sale_account",
      filter: "point_of_sale_account",
      group: "account__name",
    },

    {
      name: "Point of sale",
      id: "point_of_sale",
      filter: "point_of_sale",
      group: "gscn_site_name",
    },
    {
      name: "Product",
      id: "product_id",
      filter: "sku",
      group: "sku",
    },
  ];

  let columns: Column[] = [
    {
      name: "Group",
      key: "group__" /* SIEMPRE DEBE LLAMARSE ASI */,
      id:"group__",
      show:true,
    

      computedTotals: () => ""
    },
    {
      /* COMPUTADA */
      name: "cw_so",
      key: "cw_so",
      id: "cw_so",
      show:true,
    },
    {
      /* COMPUTADA */
      name: "lw_so",
      key: "lw_so",
      id: "lw_so",
      show:true,
    },
    {
      /* COMPUTADA */
      name: "cy_so",
      key: "cy_so",
      id: "cy_so",
      show:true,
    },
    {
      /* COMPUTADA */
      name: "ly_so",
      key: "ly_so",
      id: "ly_so",
      show:true,
    },
    {
      /* COMPUTADA */
      name: "YoY GR%",

      style: (row?: any) => {

        const comp = ((row?.cy_so - row?.ly_so) / row?.ly_so) * 100;
        if (comp === Infinity) return {};
        else if (comp >= 0) return { color: "green" }
        else if (comp < 0) return { color: "red" }
        else { return {} }
      },
      formatter: (v: any) => {
        return v.toFixed(1) + "%" || 0;
      },
      computedTotals: (c?: object) => {
        return (computedRow(c)); //.toFixed(1) + "%";
      },
      key: "yoy_gr",
      id: "yoy_gr",
      show:true,
      computed: (row? : any) => {
        if (!row) return 0
        return row.ly_so === 0
          ? 0
          : (computedRow(row)); //.toFixed(1);
      },

    },
  ];

  return <div className="rootz">
    <PivotTable columns={columns} initialGroups={initGroupsPivot} PivotService={getPivotService} isStatic={false}></PivotTable>
  </div>
};


