/// <reference path="../../ext.d.ts" />

Ext.define(`Pluton.Application`, {
  extend: `Ext.app.Application`,
  name: `Pluton`,
  launch() {
    const login = (Ext.widget as (a: string, b: any) => void)(`login`, {
    })
    console.log(`Login> Widget=%o`, login)
  },
})