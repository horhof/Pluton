Ext.define(`Pluton.view.Main`, {
  controller: `main`,
  defaults: {
    bodyPadding: 20,
    tabConfig: {
      plugins: `responsive`,
      responsiveConfig: {
        wide: {
          iconAlign: `left`,
          textAlign: `left`,
        },
        tall: {
          iconAlign: `top`,
          textAlign: `center`,
          width: 120,
        },
      },
    },
  },
  extend: `Ext.tab.Panel`,
  header: {
    layout: {
      align: `stretchmax`,
    },
    title: {
      bind: {
        text: `{name}`,
      },
      flex: 0,
    },
    iconCls: `fa-th-list`,
  },
  items: [
    {
      title: `Fleets`,
      iconCls: `fa-plane`,
      items: [
        {
          /** classic/src/view/FleetPanel.ts */
          xtype: `fleetpanel`,
        },
      ],
    },
    {
      title: `Users`,
      iconCls: `fa-user`,
      items: [
        {
          /** classic/src/view/UserPanel.ts */
          xtype: `userpanel`,
        },
        {
          columns: [
            { text: `Name`, dataIndex: `name` },
            { text: `Email`, dataIndex: `email` },
          ],
          store: `player`,
          title: `Current player`,
          xtype: `gridpanel`,
        }
      ],
    },
  ],
  requires: [
    `Ext.plugin.Viewport`,
    `Ext.window.MessageBox`,
    `Pluton.view.MainVm`,
    `Pluton.view.MainVc`,
    `Pluton.view.UserPanel`,
  ],
  responsiveConfig: {
    tall: {
      headerPosition: `top`
    },
    wide: {
      headerPosition: `left`
    },
  },
  tabBarHeaderPosition: 1,
  tabBar: {
    flex: 1,
    layout: {
      align: `stretch`,
      overflowHandler: `none`
    },
  },
  tabRotation: 0,
  titleRotation: 0,
  ui: `navigation`,
  viewModel: `main`,
  //xtype: `app-main`,
})