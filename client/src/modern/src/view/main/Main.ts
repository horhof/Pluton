/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 *
 * TODO - Replace the content of this view to suit the needs of your application.
 */
Ext.define('Pluton.view.main.Main', {
  extend: 'Ext.tab.Panel',
  xtype: 'app-main',
  requires: [
    'Ext.MessageBox',
    'Pluton.view.main.MainCtrl',
    'Pluton.view.main.MainModel',
    'Pluton.view.main.List',
  ],
  controller: 'main',
  viewModel: 'main',
  defaults: {
    tab: {
      iconAlign: 'top'
    },
    styleHtmlContent: true
  },
  tabBarPosition: 'bottom',
  items: [
    {
      title: 'Home',
      iconCls: 'x-fa fa-home',
      layout: 'fit',
      // The following grid shares a store with the classic version's grid as well!
      items: [{
        xtype: 'mainlist'
      }]
    }
  ]
})
