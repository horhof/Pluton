/// <reference path="../node_modules/@types/extjs/index.d.ts" />

declare namespace Ext {
  export namespace data {
    export interface IModel extends Model {
    }
  }
  export namespace app {
    export interface IViewModel extends Ext.IBase {
      data: { [key: string]: any }
    }
    export interface IViewController extends Ext.app.IController {
    }
  }
}