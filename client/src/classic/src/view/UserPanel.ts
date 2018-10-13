interface UserPanel extends Ext.grid.IGridPanel {
  bind: { store: string }
  controller: string
  viewModel: string
}

(Ext.define as (a: string, b: UserPanel) => void)(`Pluton.view.UserPanel`, {
  extend: `Ext.grid.Panel`,
  bbar: [
    { xtype: `button`, text: `Refresh`, handler: `onClickRefresh` },
    { xtype: `button`, text: `Create`, handler: `onClickCreate` },
  ],
  bind: {
    store: `{store}`,
  },
  columns: [
    { text: `ID`, dataIndex: `id` },
    {
      align: `left`,
      dataIndex: `name`,
      editor: `textfield`,
      text: `Name`,
      width: 300,
    },
    { text: `Email`, dataIndex: `email`, align: `left`, width: 200 },
  ],
  controller: `user`,
  listeners: {
    edit: function() {
      this.store!.sync()
    },
    select: `onClickUser`,
  },
  plugins: [
    { ptype: 'cellediting', clicksToEdit: 2 },
  ],
  requires: [
    `Pluton.store.User`,
    `Pluton.view.UserVc`,
    `Pluton.view.UserVm`,
  ],
  title: `Users`,
  viewModel: `user`,
  // Should be alias?
  xtype: `userpanel`,
})