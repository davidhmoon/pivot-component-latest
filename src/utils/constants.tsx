import { Column, Coordinates } from './interfaces';
export const size_page = 50;
export const boardColumns = [
    {
        name: 'Group',
        key: 'group__' /* SIEMPRE DEBE LLAMARSE ASI */,
        id: 'group__' /* SIEMPRE DEBE LLAMARSE ASI */,
        show: true,
    },
    {
        /* COMPUTADA */
        name: 'cw_so',
        key: 'cw_so',
        id: 'cw_so',
        show: false,
    },
    {
        /* COMPUTADA */
        name: 'lw_so',
        key: 'lw_so',
        id: 'lw_so',
        show: true,
    },
    {
        /* COMPUTADA */
        name: 'cy_so',
        key: 'cy_so',
        id: 'cy_so',
        show: true,
    },
    {
        /* COMPUTADA */
        name: 'LY SO',
        key: 'ly_so',
        id: 'ly_so',
        show: true,
    },
    {
        /* COMPUTADA */
        name: 'YoY GR%',

        style: (row?: any) => {
            const comp = ((row?.cy_so - row?.ly_so) / row?.ly_so) * 100;
            if (comp === Infinity) return { color: 'green' };
            else if (comp >= 0) return { color: 'green' };
            else if (comp < 0) return { color: 'green' };
            else {
                return { color: 'green' };
            }
        },
        formatter: (v: any) => {
            return v.toFixed(1) + '%' || 0;
        },
        computedTotals: () => {
            return 10; //.toFixed(1) + "%";
        },
        key: 'yoy_gr',
        id: 'yoy_gr',
        show: true,
        computed: (row: any) => {
            return row?.ly_so === 0 ? 0 : 10; //.toFixed(1);
        },
    },
];

export const boardGroups = [
    {
        name: 'Group',
        key: 'group__' /* SIEMPRE DEBE LLAMARSE ASI */,
        style: () => 'min-width:250px;',
        headerStyle: () => 'min-width:250px;',
        totalStyle: () => 'min-width:250px;',

        computedTotals: () => '',
    },
    {
        /* COMPUTADA */
        name: 'cw_so',
        key: 'cw_so',
    },
    {
        /* COMPUTADA */
        name: 'lw_so',
        key: 'lw_so',
    },
    {
        /* COMPUTADA */
        name: 'cy_so',
        key: 'cy_so',
    },
    {
        /* COMPUTADA */
        name: 'ly_so',
        key: 'ly_so',
    },
    {
        /* COMPUTADA */
        name: 'YoY GR%',

        style: (row?: any) => {
            const comp = ((row?.cy_so - row?.ly_so) / row?.ly_so) * 100;
            if (comp === Infinity) return { color: 'green' };
            else if (comp >= 0) return { color: 'green' };
            else if (comp < 0) return { color: 'green' };
            else {
                return null;
            }
        },
        formatter: (v: any) => {
            return v.toFixed(1) + '%' || 0;
        },
        computedTotals: (c: any) => {
            return ((c?.cy_so - c?.ly_so) / c?.ly_so) * 100 || 0; //.toFixed(1) + "%";
        },
        key: 'yoy_gr',
        computed: (row: any) => {
            return row?.ly_so === 0 ? 0 : ((row?.cy_so - row?.ly_so) / row?.ly_so) * 100 || 0; //.toFixed(1);
        },
    },
];
export const boardRow = {
    point_of_sale_country: 17,
    country__name: 'NICARAGUA',
    group__: 'NICARAGUA',
    cy_so: 7709,
    ly_so: 21517,
    cw_so: 999999999,
    lw_so: 563,
    yoy_gr: 10,
    aggrupation: '17$$NICARAGUA',
};

export const boardTotals = [
    {
        cy_so: 463242,
        ly_so: 463449,
        cw_so: 16387,
        lw_so: 21786,
        group__: '',
        yoy_gr: 10,
    },
];

export const boardRows = [
    {
        point_of_sale_country: 17,
        country__name: 'NICARAGUA',
        cy_so: 7709,
        ly_so: 21517,
        cw_so: 601,
        lw_so: 563,
        aggrupation: '17$$NICARAGUA',
    },
    {
        point_of_sale_country: 10,
        country__name: 'COSTA RICA',
        cy_so: 60959,
        ly_so: 102618,
        cw_so: 2576,
        lw_so: 2235,
        aggrupation: '10$$COSTA RICA',
    },
    {
        point_of_sale_country: 24,
        country__name: 'VENEZUELA',
        cy_so: 2382,
        ly_so: 5345,
        cw_so: 0,
        lw_so: 0,
        aggrupation: '24$$VENEZUELA',
    },
    {
        point_of_sale_country: 11,
        country__name: 'ECUADOR',
        cy_so: 0,
        ly_so: 8254,
        cw_so: 0,
        lw_so: 0,
        aggrupation: '11$$ECUADOR',
    },
    {
        point_of_sale_country: 16,
        country__name: 'JAMAICA',
        cy_so: 6975,
        ly_so: 0,
        cw_so: 0,
        lw_so: 1460,
        aggrupation: '16$$JAMAICA',
    },
    {
        point_of_sale_country: 13,
        country__name: 'GUATEMALA',
        cy_so: 198736,
        ly_so: 164933,
        cw_so: 7242,
        lw_so: 9149,
        aggrupation: '13$$GUATEMALA',
    },
    {
        point_of_sale_country: 12,
        country__name: 'EL SALVADOR',
        cy_so: 64729,
        ly_so: 59555,
        cw_so: 2637,
        lw_so: 2307,
        aggrupation: '12$$EL SALVADOR',
    },
    {
        point_of_sale_country: 21,
        country__name: 'REPUBLICA DOMINICANA',
        cy_so: 45336,
        ly_so: 30634,
        cw_so: 0,
        lw_so: 2643,
        aggrupation: '21$$REPUBLICA DOMINICANA',
    },
    {
        point_of_sale_country: 15,
        country__name: 'HONDURAS',
        cy_so: 60012,
        ly_so: 54912,
        cw_so: 2643,
        lw_so: 2761,
        aggrupation: '15$$HONDURAS',
    },
    {
        point_of_sale_country: 18,
        country__name: 'PANAMA',
        cy_so: 16404,
        ly_so: 15681,
        cw_so: 688,
        lw_so: 668,
        aggrupation: '18$$PANAMA',
    },
];

export const queries_rmf = {
    market: {
        table: 'market_share',
        groupsBy: 'point_of_sale_country$country__name',
        query: {
            joins: [
                {
                    how: 'left',
                    other: 'weeks',
                    on: ['year', 'week'],
                },
                {
                    how: 'left',
                    other: 'pos',
                    on: ['site_id'],
                },
                {
                    how: 'left',
                    other: 'products',
                    on: ['sku'],
                },
            ],

            data: [
                {
                    // drop: ['point_of_sale_country'],
                    // rename: {
                    //     id_right: 'point_of_sale_country',
                    // },
                    filter: "pl.col('division__value')=='AV'",
                    groupby: {
                        mso_cy_so:
                            "pl.col('amount').filter(pl.col('week_object_id')>=week_range['fwoy']).sum()",
                        mso_ly_so:
                            "pl.col('amount').filter((pl.col('week_object_id')>=week_range['fwoy']-52)&(pl.col('week_object_id')<=week_range['to']-52)).sum().fill_null(0)",
                    },

                    with_columns: [
                        "pl.when(pl.col('mso_ly_so')!=0).then((100*(pl.col('mso_cy_so')-pl.col('mso_ly_so'))/pl.col('mso_ly_so'))).otherwise(0).round(1).alias('mso_gr')",
                    ],

                    sort: { by: 'mso_cy_so', descending: true },
                },
            ],
            totals: {
                mso_cy_so: "pl.col('mso_cy_so').sum()",
                mso_ly_so: "pl.col('mso_ly_so').sum()",
            },
        },
    },

    weekly: {
        table: 'weeklysales',
        groupsBy: 'point_of_sale_country$country__name',
        query: {
            joins: [
                {
                    how: 'left',
                    other: 'weeks',
                    on: ['year', 'week'],
                },
                {
                    how: 'left',
                    other: 'pos',
                    on: ['site_id'],
                },
            ],
            data: [
                {
                    filter: "pl.col('division__value')=='AV'",
                    groupby: {
                        cy_so: "pl.col('sold_units').filter(pl.col('week_object_id')>=week_range['fwoy']).sum()",
                        ly_so: "pl.col('sold_units').filter((pl.col('week_object_id')>=week_range['fwoy']-52)&(pl.col('week_object_id')<=week_range['to']-52)).sum().fill_null(0)",
                    },
                    with_columns: [
                        "pl.when(pl.col('ly_so')!=0).then((100*(pl.col('cy_so')-pl.col('ly_so'))/pl.col('ly_so'))).otherwise(0).round(1).alias('gr')",
                    ],
                    sort: { by: 'cy_so', descending: true },
                },
            ],
            totals: {
                cy_so: "pl.col('cy_so').sum()",
                ly_so: "pl.col('ly_so').sum()",
            },
        },
    },
    pos_counter: {
        table: 'pos',
        query: {
            data: [
                {
                    filter: "(pl.col('status')==1) & (pl.col('is_rmf')==1) & ((pl.col('universeAV')>=1)| (pl.col('grade_av')=='A') | (pl.col('grade_av')=='B')| (pl.col('grade_av')=='C')| (pl.col('grade_av')=='D'))",
                    groupby: {
                        universe: "pl.col('universeAV').filter(pl.col('universeAV')>=1).sum()",
                        av_A: "pl.col('site_id').filter(pl.col('grade_av')=='A').count()",
                        av_B: "pl.col('site_id').filter(pl.col('grade_av')=='B').count()",
                        av_C: "pl.col('site_id').filter(pl.col('grade_av')=='C').count()",
                        av_D: "pl.col('site_id').filter(pl.col('grade_av')=='D').count()",
                    },
                    with_columns: [
                        "(pl.col('universe')-(pl.col('av_A')+pl.col('av_B')+pl.col('av_C')+pl.col('av_D'))).alias('pending')",
                    ],

                    sort: { by: 'universe', descending: true },
                },
            ],
            totals: {
                universe: "pl.col('universe').sum()",
                av_A: "pl.col('av_A').sum()",
                av_B: "pl.col('av_B').sum()",
                av_C: "pl.col('av_C').sum()",
                av_D: "pl.col('av_D').sum()",
                pending: "pl.col('pending').sum()",
            },
        },
    },
};

export const queries_glp = {
    delayCountry: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:arrival__group',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                    fields: ['arrival__group'],
                },
            ],
            data: [
                {
                    filter: 'delayeddays > 0',
                    groupby: {
                        distinct_po_count: 'COUNT(DISTINCT po_no)',
                    },
                },
            ],
        },
    },

    delayProductGroup: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:divisionname',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                    fields: ['arrival__group'],
                },
            ],
            data: [
                {
                    filter: 'delayeddays > 0',
                    groupby: {
                        distinct_po_count: 'COUNT(DISTINCT po_no)',
                    },
                },
            ],
        },
    },
    delayToCustomer: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:shiptocustomer',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                    fields: ['arrival__group'],
                },
            ],
            data: [
                {
                    filter: 'delayeddays > 0',
                    groupby: {
                        distinct_po_count: 'COUNT(DISTINCT po_no)',
                    },
                },
            ],
        },
    },
    leadTimeProductGroup: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:divisionname',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                    fields: ['arrival__group'],
                },
            ],
            data: [
                {
                    groupby: {
                        avg_lead_time:
                            "AVG(DATE_DIFF('day', port_atddate, (CASE WHEN port_atadate IS NOT NULL THEN port_atadate ELSE port_etadate END)))",
                    },
                },
            ],
        },
    },
    leadTimeFactory: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:sitefromname',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                    fields: ['arrival__group'],
                },
            ],
            data: [
                {
                    groupby: {
                        avg_lead_time:
                            "AVG(DATE_DIFF('day', port_atddate, (CASE WHEN port_atadate IS NOT NULL THEN port_atadate ELSE port_etadate END)))",
                    },
                },
            ],
        },
    },
    leadTimeToCustomer: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:shiptocustomer',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                    fields: ['arrival__group'],
                },
            ],
            data: [
                {
                    groupby: {
                        avg_lead_time:
                            "AVG(DATE_DIFF('day', port_atddate, (CASE WHEN port_atadate IS NOT NULL THEN port_atadate ELSE port_etadate END)))",
                    },
                },
            ],
        },
    },
    leadTimePort: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:discharging__port$latitude$longitude',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.portcoordinades',
                    fields: ['latitude', 'longitude'],
                    on: 'discharging__port',
                },
            ],
            data: [
                {
                    groupby: {
                        avg_lead_time:
                            "AVG(DATE_DIFF('day', port_atddate, (CASE WHEN port_atadate IS NOT NULL THEN port_atadate ELSE port_etadate END)))",
                        latitude: 'latitude',
                        longitude: 'longitude',
                    },
                },
            ],
        },
    },
    mainTable: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:po_sku$cntr_truckno',
        query: {
            datasource: 'ATHENA',

            joins: [
                {
                    how: 'left',
                    other: 'glp.contract',
                    on: ['pol__code', 'dest__code', 'carrier'],
                },
                {
                    how: 'left',
                    other: 'glp.carrier_shipping',
                    on: 'shipping__brand__origin',
                },
                {
                    how: 'left',
                    other: 'glp.portcoordinades',
                    on: 'discharging__port',
                },
            ],

            data: [
                {
                    //     "with_columns": [
                    //         "contract_lty23-historicleadtime as gap"
                    //     ],
                },
            ],
        },
    },

    totalMainTable: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:po_sku$cntr_truckno',
        query: {
            datasource: 'ATHENA',
            data: [
                {
                    select: ['count(*) as totals'],
                },
            ],
        },
    },
};

export const queries_glp_logistic = {
    leadTimeShippingCompany: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:shipping__carrier__grouping',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.carrier_shipping',
                    on: 'shipping__brand__origin',
                },
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                },
            ],
            data: [
                {
                    filter: 'port_atadate is not null',
                    groupby: {
                        shipping__carrier__grouping: 'shipping__carrier__grouping',
                        avg_lead_time:
                            "AVG(DATE_DIFF('day', port_atddate, (CASE WHEN port_atadate IS NOT NULL THEN port_atadate ELSE port_etadate END)))",
                    },
                },
            ],
        },
    },
    leadTimeDischargingPort: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:discharging__port',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                },
            ],
            data: [
                {
                    filter: 'port_atadate is not null',
                    groupby: {
                        discharging__port: 'discharging__port',
                        avg_lead_time:
                            "AVG(DATE_DIFF('day', port_atddate, (CASE WHEN port_atadate IS NOT NULL THEN port_atadate ELSE port_etadate END)))",
                    },
                },
            ],
        },
    },

    leadTimeTransportMode: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:shiptype',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                },
            ],
            data: [
                {
                    filter: 'port_atadate is not null',
                    groupby: {
                        avg_lead_time:
                            "AVG(DATE_DIFF('day', port_atddate, (CASE WHEN port_atadate IS NOT NULL THEN port_atadate ELSE port_etadate END)))",
                    },
                },
            ],
        },
    },

    leadTimeCountry: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:region_continent',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                },
                {
                    how: 'left',
                    other: 'glp.factory',
                    on: 'sitefromname',
                },
            ],
            data: [
                {
                    filter: 'port_atadate is not null',
                    groupby: {
                        avg_lead_time:
                            "AVG(DATE_DIFF('day', port_atddate, (CASE WHEN port_atadate IS NOT NULL THEN port_atadate ELSE port_etadate END)))",
                    },
                },
            ],
        },
    },

    leadTimePort: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:discharging__port$latitude$longitude',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.portcoordinades',
                    fields: ['latitude', 'longitude'],
                    on: 'discharging__port',
                },
            ],
            data: [
                {
                    groupby: {
                        avg_lead_time:
                            "AVG(DATE_DIFF('day', port_atddate, (CASE WHEN port_atadate IS NOT NULL THEN port_atadate ELSE port_etadate END)))",
                        latitude: 'latitude',
                        longitude: 'longitude',
                    },
                },
            ],
        },
    },
};

export const queries_glp_monitoring = {
    avgEtaContinent: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:region_continent',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                },
                {
                    how: 'left',
                    other: 'glp.factory',
                    on: 'sitefromname',
                },
            ],
            data: [
                {
                    filter: '((po_no is not null ) and port_atadate is not null and ((count_deta = 0 and count_detd <> 0) or (count_deta <> 0 and count_detd = 0) or (count_deta <> 0 and count_detd <> 0)) and (so is not null))',
                    groupby: {
                        region_continent: 'region_continent',
                        avg_eta: 'AVG(count_deta)',
                    },
                },
            ],
        },
    },
    avgEtaProductGroup: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:divisionname',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                },
                {
                    how: 'left',
                    other: 'glp.factory',
                    on: 'sitefromname',
                },
            ],
            data: [
                {
                    filter: '((po_no is not null ) and port_atadate is not null and ((count_deta = 0 and count_detd <> 0) or (count_deta <> 0 and count_detd = 0) or (count_deta <> 0 and count_detd <> 0)) and (so is not null))',
                    groupby: {
                        divisionname: 'divisionname',
                        avg_eta: 'AVG(count_deta)',
                    },
                },
            ],
        },
    },
    leadTimeDischargingPort: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:discharging__port',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                },
            ],
            data: [
                {
                    filter: '((po_no is not null ) and ((count_deta = 0 and count_detd <> 0) or (count_deta <> 0 and count_detd = 0) or (count_deta <> 0 and count_detd <> 0)) and (so is not null))',
                    groupby: {
                        discharging__port: 'discharging__port',
                        avg_lead_time: 'AVG(count_deta)',
                    },
                },
            ],
        },
    },
    leadTimeShippingCompany: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:shipping__carrier__grouping',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.carrier_shipping',
                    on: 'shipping__brand__origin',
                },
                {
                    how: 'left',
                    other: 'glp.countrygroups',
                    on: 'finalctry',
                },
            ],
            data: [
                {
                    filter: '((po_no is not null ) and ((count_deta = 0 and count_detd <> 0) or (count_deta <> 0 and count_detd = 0) or (count_deta <> 0 and count_detd <> 0)) and (so is not null))',
                    groupby: {
                        shipping__carrier__grouping: 'shipping__carrier__grouping',
                        avg_lead_time: 'AVG(count_deta)',
                    },
                },
            ],
        },
    },
    etdTimePort: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:discharging__port$latitude$longitude',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.portcoordinades',
                    fields: ['latitude', 'longitude'],
                    on: 'discharging__port',
                },
            ],
            data: [
                {
                    filter: '((po_no is not null ) and ((count_deta = 0 and count_detd <> 0) or (count_deta <> 0 and count_detd = 0) or (count_deta <> 0 and count_detd <> 0)) and (so is not null))',
                    groupby: {
                        count_deta: 'AVG(count_deta)',
                        discharging__port: 'discharging__port',
                        latitude: 'latitude',
                        longitude: 'longitude',
                    },
                },
            ],
        },
    },
    mainTable: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:po_sku$cntr_truckno',
        query: {
            datasource: 'ATHENA',

            joins: [
                {
                    how: 'left',
                    other: 'glp.carrier_shipping',
                    on: 'shipping__brand__origin',
                },
                {
                    how: 'left',
                    other: 'glp.portcoordinades',
                    on: 'discharging__port',
                },
            ],
            //if eta=1 y etd = 1 create alert = 1 else alert = 0
            data: [
                {
                    filter: '((po_no is not null ) and ((count_deta <> 0 or count_detd <> 0)) and (so is not null))',
                    // "with_columns": [
                    //     "contract_lty23-historicleadtime as gap"
                    // ],
                },
            ],
        },
    },

    totalMainTable: {
        table: 'glp-shipmentoptimized',
        groupsBy: 'groups:po_sku$cntr_truckno',
        query: {
            datasource: 'ATHENA',
            data: [
                {
                    filter: '((po_no is not null ) and ((count_deta <> 0 or count_detd <> 0)) and (so is not null))',
                    select: ['count(*) as totals'],
                },
            ],
        },
    },
};

const currentDate = new Date();
const lastDate = new Date(currentDate.getFullYear() - 1, 12, 0).toLocaleDateString('en-CA');
export const queries_glp_key_mapping = {
    key_departure_leadcalc: {
        table: 'glp-leadcalc',
        groupsBy: 'groups:departure$destination$ly_lt',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.contract',
                    on: ['pol__code', 'dest__code', 'carrier'],
                    fields: ['lt as ly_lt'],
                },
                {
                    how: 'left',
                    other: 'glp.portcountry',
                    left_on: 'departurecode',
                    right_on: 'port_code',
                    fields: ['port__country as departure'],
                },
                {
                    how: 'left',
                    other: 'glp.portcountry',
                    left_on: 'finalcode',
                    right_on: 'port_code',
                    fields: ['port__country as destination'],
                },
            ],
            data: [
                {
                    //and po_no is not null and finalctry <> 'GB' and finalctry <> 'AR'
                    filter: "(carrier <> 'DUMMY FORWARDER' and cast(historicleadtime as real)>=0)",
                    sort: { by: 'departure', ascending: 'true' },
                    groupby: {
                        avg_ly: 'avg(cast(historicleadtime as real))',
                    },
                },
            ],
        },
    },
    key_departure_shipment: {
        table: 'glp-shipmentvisibility',
        groupsBy: 'groups:departure$destination$lt',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.contract',
                    on: [
                        'pol__code',
                        'dest__code',
                        // "carrier"
                    ],
                    fields: ['lt as lt'],
                },
                {
                    how: 'left',
                    other: 'glp.portcountry',
                    left_on: 'departurecode',
                    right_on: 'port_code',
                    fields: ['port__country as departure'],
                },
                {
                    how: 'left',
                    other: 'glp.portcountry',
                    left_on: 'finalcode',
                    right_on: 'port_code',
                    fields: ['port__country as destination'],
                },
            ],
            data: [
                {
                    //
                    filter: `(port_etadate > CAST('${lastDate}' as Date) and so is not null and so <> '' and departure is not null  and destination is not null and carrier not like '%DUMMY FORWARDER%' and cast(historicleadtime as real)>=0 and finalctry <> 'GB' and finalctry <> 'AR')`,
                    sort: { by: 'departure', ascending: 'true' },
                    groupby: {
                        avg_cy: 'avg(cast(historicleadtime as real))',
                    },
                },
            ],
        },
    },
    key_departure_leadcalc_departure: {
        table: 'glp-leadcalc',
        groupsBy: 'groups:departure$ly_lt$departure_port$country_name',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.portcountry',
                    left_on: 'departurecode',
                    right_on: 'port_code',
                    fields: ['port__country as departure', 'port__name as departure_port'],
                },
                {
                    how: 'left',
                    other: 'glp.country',
                    left_on: 'departure',
                    right_on: 'code',
                    fields: ['country_name'],
                },
                // {
                //     "how": "left",
                //     "other": "glp.portcountry",
                //     "left_on": "finalcode",
                //     "right_on": "port_code",
                //     "fields": ["port__country as destination"],
                // },
                {
                    how: 'left',
                    other: 'glp.contract',
                    on: ['pol__code', 'dest__code', 'carrier'],
                    fields: ['lt as ly_lt'],
                },
            ],
            data: [
                {
                    //and po_no is not null and finalctry <> 'GB' and finalctry <> 'AR'
                    filter: "(carrier <> 'DUMMY FORWARDER' and cast(historicleadtime as real)>=0)",
                    sort: { by: 'departure', ascending: 'true' },
                    groupby: {
                        avg_ly: 'avg(cast(historicleadtime as real))',
                    },
                },
            ],
        },
    },
    key_departure_shipment_departure: {
        table: 'glp-shipmentvisibility',
        groupsBy: 'groups:departure$lt$departure_port$country_name',
        query: {
            datasource: 'ATHENA',
            joins: [
                {
                    how: 'left',
                    other: 'glp.portcountry',
                    left_on: 'departurecode',
                    right_on: 'port_code',
                    fields: ['port__country as departure', 'port__name as departure_port'],
                },
                {
                    how: 'left',
                    other: 'glp.country',
                    left_on: 'departure',
                    right_on: 'code',
                    fields: ['country_name'],
                },
                // {
                //     "how": "left",
                //     "other": "glp.portcountry",
                //     "left_on": "finalcode",
                //     "right_on": "port_code",
                //     "fields": ["port__country as destination"],
                // },
                {
                    how: 'left',
                    other: 'glp.contract',
                    on: ['pol__code', 'dest__code', 'carrier'],
                    fields: ['lt as lt'],
                },
            ],
            data: [
                {
                    //
                    filter: `(port_etadate > CAST('${lastDate}' as Date) and so is not null and so <> '' and departure is not null  and carrier not like '%DUMMY FORWARDER%' and cast(historicleadtime as real)>=0 and finalctry <> 'GB' and finalctry <> 'AR')`,
                    sort: { by: 'departure', ascending: 'true' },
                    groupby: {
                        avg_cy: 'avg(cast(historicleadtime as real))',
                    },
                },
            ],
        },
    },

    mainTable: {
        table: 'glp-shipmentvisibility',
        groupsBy: 'groups:po_sku$cntr_truckno',
        query: {
            datasource: 'ATHENA',

            joins: [
                {
                    how: 'left',
                    other: 'glp.contract',
                    on: ['pol__code', 'dest__code', 'carrier'],
                    fields: ['lt as lt'],
                },
                {
                    how: 'left',
                    other: 'glp.carrier_shipping',
                    left_on: 'carrier',
                    right_on: 'shipping__brand__origin',
                },
                {
                    how: 'left',
                    other: 'glp.portcoordinades',
                    on: 'discharging__port',
                },
                {
                    how: 'left',
                    other: 'glp.portcountry',
                    left_on: 'departurecode',
                    right_on: 'port_code',
                    fields: ['port__country as departure'],
                },
                {
                    how: 'left',
                    other: 'glp.portcountry',
                    left_on: 'finalcode',
                    right_on: 'port_code',
                    fields: ['port__country as destination'],
                },
            ],

            data: [
                {
                    // "with_columns": [
                    //     "contract_lty23-historicleadtime as gap"
                    // ],
                },
            ],
        },
    },

    totalMainTable: {
        table: 'glp-shipmentvisibility',
        groupsBy: 'groups:po_sku$cntr_truckno',
        joins: [
            {
                how: 'left',
                other: 'glp.portcountry',
                left_on: 'departurecode',
                right_on: 'port_code',
                fields: ['port__country as departure'],
            },
            {
                how: 'left',
                other: 'glp.portcountry',
                left_on: 'finalcode',
                right_on: 'port_code',
                fields: ['port__country as destination'],
            },
            {
                how: 'left',
                other: 'glp.portcoordinades',
                on: 'discharging__port',
            },
            {
                how: 'left',
                other: 'glp.carrier_shipping',
                left_on: 'shipping__brand__origin',
                right_on: 'carrier',
            },
            {
                how: 'left',
                other: 'glp.contract',
                on: ['pol__code', 'dest__code', 'carrier'],
                fields: ['lt as lt'],
            },
        ],
        query: {
            filter: `(port_etadate > CAST('${lastDate}' as Date) and so is not null and so <>'' and departure is not null  and destination is not null and carrier <> 'DUMMY FORWARDER' and cast(historicleadtime as real)>=0 and finalctry <> 'GB' and port_atadate is not null)`,
            datasource: 'ATHENA',
            data: [
                {
                    select: ['count(*) as totals'],
                },
            ],
        },
    },
};

export const query_glp_ports = {
    table: 'glp-knportstatus',
    groupsBy:
        'groups:code$name$isseaport$latitude$longitude$status$started$modified$comment$alert_title$status$alert_description$alert_from_date$alert_to_date$country$coun',
    query: {
        datasource: 'ATHENA',
        joins: [
            {
                how: 'left',
                other: 'glp.ports',
                on: ['latitude', 'longitude'],
                fields: ['country_code as coun'],
            },

            {
                how: 'left',
                other: 'glp.country',
                left_on: 'coun',
                right_on: 'code',
                fields: ['country_name as country'],
            },
        ],
        data: [
            {
                sort: { by: 'dt', descending: 'true' },
                groupby: {
                    dt: 'max(dt)',
                    started: 'max(started)',
                },
            },
        ],
    },
};
export const glp_ports = {
    table: 'glp-ports',
    groupsBy: 'groups:port_code$country_code',
    query: {
        datasource: 'ATHENA',
        joins: [
            {
                how: 'left',
                other: 'glp.country',
                left_on: 'country_code',
                right_on: 'code',
                fields: ['country_name as country'],
            },
        ],
    },
};
export const query_glp_main_ports = {
    table: 'glp-portcoordinades',
    groupsBy: 'groups:discharging__port$latitude$longitude$port_code',
    query: {
        datasource: 'ATHENA',
        joins: [
            {
                how: 'left',
                other: 'glp.country',
                left_on: 'country',
                right_on: 'country_name',
                fields: ['code as country_code'],
            },
            {
                how: 'left',
                other: 'glp.portcountry',
                left_on: 'discharging__port',
                right_on: 'port__name',
                fields: ['port__country as port__country, port_code'],
            },
        ],
        data: [],
    },
};
export const query_glp_last_refresh = {
    table: 'glp-knportstatus',
    groupsBy: 'groups:status',
    query: {
        datasource: 'ATHENA',
        data: [
            {
                sort: {
                    by: 'dt',
                    descending: 'DESC',
                },
                limit: 1,
                select: ['dt'],
            },
        ],
    },
};
export const query_glp_general_alerts = {
    table: 'glp-kngeneralalerts',
    groupsBy:
        'groups:latitude$longitude$alert_title$alert_description$alert_from_date$alert_to_date$country$country_code',
    query: {
        datasource: 'ATHENA',
        joins: [
            {
                how: 'left',
                other: 'glp.portcoordinades',
                on: ['latitude', 'longitude'],
                fields: ['country as coun'],
            },

            {
                how: 'left',
                other: 'glp.portcountry',
                left_on: 'coun',
                right_on: 'port__name',
                fields: ['port__country as country, port_code as country_code'],
            },
        ],
        data: [
            {
                groupby: {
                    dt: 'max(dt)',
                    alert_from_date: 'max(alert_from_date)',
                },
            },
        ],
    },
};

export const test_data_chart = [
    { label: 'STANDER DISTRIBUTION SALES LARGE', value: 0.215 },
    { label: 'nine', value: 0.15 },
    { label: 'eight', value: 0.5 },
    { label: 'seven', value: 0.21 },
    { label: 'six', value: 0.3 },
    { label: 'five', value: 0.4 },
    { label: 'four', value: 0.27 },
    { label: 'three', value: 0.78 },
    { label: 'two', value: 0.65 },
    { label: 'one', value: 0.98 },
];

export const test_geoCoordMap: Coordinates[] = [
    { port: '鄂尔多斯value', value: '5', lat: 12.15, lng: -81.89 },
    { port: '招远value', value: '8', lat: 10.781327, lng: -79.608266 },
    { port: '舟', value: '20', lat: 11.38, lng: -89.35 },
    { port: '齐齐哈value', value: '45', lat: 13.207216, lng: -75.985295 },
];

export const test_data_table: Column[] = [
    {
        id: 'A',
        name: 'A',
        prop: 'A',
        open: false,
        show: true,
        formatting: (v: any) => {
            return `value: ${v}`;
        },
    },
    {
        id: 'B',
        name: 'B',
        prop: 'B',
        open: false,
        show: true,
        formatting: (v: any) => <div style={{ color: 'red' }}>{v.toString()}</div>,
    },
    { id: 'C', name: 'C', prop: 'C', open: false, show: true },
    { id: 'D', name: 'D', prop: 'D', open: false, show: true },
];

export const stylesMultiSelect = {
    chips: {
        // To change css chips(Selected options)
        background: 'rgb(102, 208, 175)',
    },
    optionContainer: {
        // To change css for option container
        border: '1px solid',
        ':hover': {
            backgroundColor: '#f4f4f4', // Change this to the desired background color
        },
    },
    option: {
        // To change css for dropdown options
        color: 'black',
        ':hover': {
            background: '#f4f4f4', // Change this to the desired background color
        },
    },
};

export const max_vessel_inf = {
    table: 'glp-vessels',
    groupsBy: 'groups:ship_id$lat$lon$shipname$course$heading',
    query: {
        datasource: 'ATHENA',
        /* joins: [
            {
                how: 'left',
                other: 'glp.shipmentoptimized',
                left_on: 'ship_id',
                right_on: 'shiptocode',
                fields: ['leadtime'],
            },
        ], */
        data: [
            {
                filter: 'dt=(select max(dt) from glp.vessels)',
            },
        ],
    },
};

export const max_container_inf = {
    table: 'glp-containers',
    groupsBy: 'groups:cntr_truckno$carrier$webviewurl$last_event_description$vessel_id',
    query: {
        datasource: 'ATHENA',
        joins: [
            {
                how: 'left',
                other: 'glp.shipmentoptimized',
                left_on: 'cntr_truckno',
                right_on: 'cntr_truckno',
                fields: [
                    'po_qty',
                    'sku',
                    'shiptocustomer',
                    'port_atadate',
                    'port_etadate',
                    'leadtime',
                ],
            },
        ],
        data: [
            {
                filter: 'dt=(select max(dt) from glp.containers)',
            },
        ],
    },
};
