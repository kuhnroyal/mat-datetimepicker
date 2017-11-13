var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from "@angular/core";
import { MatMomentDateModule, MomentDateModule } from "@angular/material-moment-adapter";
import { MAT_DATETIME_FORMATS, DatetimeAdapter } from "@mat-datetimepicker/core";
import { MomentDatetimeAdapter } from "./moment-datetime-adapter";
import { MAT_MOMENT_DATETIME_FORMATS } from "./moment-datetime-formats";
export * from "./moment-datetime-adapter";
export * from "./moment-datetime-formats";
var MomentDatetimeModule = (function () {
    function MomentDatetimeModule() {
    }
    MomentDatetimeModule = __decorate([
        NgModule({
            imports: [MomentDateModule],
            providers: [
                {
                    provide: DatetimeAdapter,
                    useClass: MomentDatetimeAdapter
                }
            ]
        })
    ], MomentDatetimeModule);
    return MomentDatetimeModule;
}());
export { MomentDatetimeModule };
var MatMomentDatetimeModule = (function () {
    function MatMomentDatetimeModule() {
    }
    MatMomentDatetimeModule = __decorate([
        NgModule({
            imports: [MomentDatetimeModule, MatMomentDateModule],
            providers: [{ provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS }]
        })
    ], MatMomentDatetimeModule);
    return MatMomentDatetimeModule;
}());
export { MatMomentDatetimeModule };
//# sourceMappingURL=index.js.map