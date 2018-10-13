interface MainVc extends Ext.app.IViewController {
}

(Ext.define as (a: string, b: MainVc) => void)(`Pluton.view.MainVc`, {
  alias: [`controller.main`],
  extend: `Ext.app.ViewController`,
})

interface MainVm extends Ext.app.IViewModel {
  data: {
    name: string
  }
}

(Ext.define as (a: string, b: MainVm) => void)(`Pluton.view.MainVm`, {
  alias: [`viewmodel.main`],
  data: {
    name: `P`,
  },
  extend: `Ext.app.ViewModel`,
})