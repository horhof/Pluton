interface Login extends Ext.IPanel {
  controller: string
  viewModel: string
}

(Ext.define as (a: string, b: Login) => void)(`Pluton.view.Login`, {
  alias: [`widget.login`],
  controller: `login`,
  extend: `Ext.Panel`,
  items: [
    {
      xtype: `form`,
      bbar: [
        {
          handler: `onClickLogin`,
          text: `Login`,
          xtype: `button`,
        },
      ],
      bodyPadding: 10,
      items: [
        {
          fieldLabel: `Email`,
          name: `email`,
          xtype: `textfield`,
        },
        {
          fieldLabel: `Password`,
          name: `password`,
          xtype: `textfield`,
        },
      ],
      title: `Login`,
    },
  ],
  layout: `center`,
  plugins: `viewport`,
  requires: [
    'Ext.layout.container.Center',
  ],
  viewModel: `login`,
  // Not sure if this is even needed.
  //xtype: `app-main`,
  // Doesn't work.
  //xtype: `panel`,
})