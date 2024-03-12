export interface Column {
    cellType?: string;
    id: any;
    onClick?: Function;
    valueType?: string;
    name: string;
    prop?: string; // fix duplicate property
    open?: boolean;
    key?: string; // fix duplicate property
    type?: typeof String | typeof Number | typeof Boolean | typeof Date | string;
    show: boolean;
    formatting?: (value: Number | string, row: object) => string | Array<JSX.Element> | JSX.Element;
    formatter?: (
        value: Number | string
    ) => string | Array<JSX.Element> | JSX.Element | string | number;

    // pivot table methods
    headerStyle?: () => object;
    totalStyle?: () => object;
    computedTotals?: (row?: object, data?: []) => string | Number;
    computed?: (row?: object) => string | Number;
    style?: React.CSSProperties | ((prop: any) => React.CSSProperties);
}