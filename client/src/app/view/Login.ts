interface LoginVc extends Ext.app.IViewController {
}

(Ext.define as (a: string, b: LoginVc) => void)(`Pluton.view.LoginVc`, {
  alias: [`controller.login`],
  extend: `Ext.app.ViewController`,
})

interface LoginVm extends Ext.app.IViewModel {
  data: {
    name: string
  }
}

(Ext.define as (a: string, b: LoginVm) => void)(`Pluton.view.LoginVm`, {
  alias: [`viewmodel.login`],
  data: {
    name: `P`,
  },
  extend: `Ext.app.ViewModel`,
})