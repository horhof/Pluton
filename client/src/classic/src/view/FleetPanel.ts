interface FleetPanel extends Ext.grid.IGridPanel {
  bind: { store: string }
  controller: string
  viewModel: string
}

(Ext.define as (a: string, b: FleetPanel) => void)(`Pluton.view.FleetPanel`, {
  extend: `Ext.grid.Panel`,
  bbar: [
    { xtype: `button`, text: `Refresh`, handler: `onClickRefresh` },
    { xtype: `button`, text: `Create`, handler: `onClickCreate` },
  ],
  bind: {
    store: `{store}`,
  },
  columns: {
    defaults: {
      align: `left`,
      width: 100,
    },
    items: [
      {
        dataIndex: `planetName`,
        renderer: function(_: any, __: any, record: Fleet) {
          try {
            // @ts-ignore
            return record.get(`planet`).name as string
          }
          catch (err) {
            return ``
          }
        },
        text: `Planet`,
        width: 200,
      },
      {
        align: `center`,
        dataIndex: `index`,
        editor: `textfield`,
        renderer: function(value: number) {
          value = Number(value)
          switch (value) {
            case 1:
              return `1st`
            case 2:
              return `2nd`
            case 3:
              return `3rd`
            default:
              return `${value}th`
          }
        },
        text: `Index`,
        width: 75,
      },
      {
        dataIndex: `name`,
        editor: `textfield`,
        text: `Name`,
        width: 200,
      },
      {
        align: `center`,
        dataIndex: `mobile`,
        editor: `checkboxfield`,
        text: `Mobile?`,
        width: 75,
      },
      {
        align: `center`,
        dataIndex: `moving`,
        text: `Moving?`,
        width: 75,
      },
      {
        dataIndex: `target_planet_id`,
        text: `Target`,
        width: 150,
        renderer: function(value: number) {
          return (value) ? value : `None`
        },
      },
      {
        dataIndex: `ticks_remaining`,
        text: `ETA`,
      },
    ],
  },
  controller: `fleet`,
  plugins: [
    { ptype: 'cellediting', clicksToEdit: 2 },
  ],
  listeners: {
    edit: function() {
      this.store!.sync()
    },
  },
  requires: [
    `Pluton.store.Fleet`,
    `Pluton.view.FleetVc`,
    `Pluton.view.FleetVm`,
  ],
  selModel: 'cellmodel',
  title: `Fleets`,
  viewModel: `fleet`,
  // Should be alias?
  xtype: `fleetpanel`,
})