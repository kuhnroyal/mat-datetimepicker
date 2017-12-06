# Material Datetimepicker for @angular/material 5.0.0

The datetimepicker is taken from [Promact/md2](https://github.com/Promact/md2) and modified to use @angular/material as base and added theming support.

Like the @angular/material datepicker it contains a native-datetime-adapter as well as a moment-datetime-adapter.

### Installation  - Not published on the npm registry (yet)!
Install:
```
yarn install @mat-datetimepicker/core
```
And for the moment adapter:
```
yarn install @mat-datetimepicker/moment
``` 

### Performing a local build
```
yarn install
yarn build
``` 

### Using the local build in some project
```
cd my-project
``` 
Add the dependencies to your `package.json`:
```
"dependencies": {
    "@mat-datetimepicker/core": "5.0.0-rc.3-1",
    "@mat-datetimepicker/moment": "5.0.0-rc.3-1",
}
```
Link the local built modules:
```
yarn link "@mat-datetimepicker/core"
yarn link "@mat-datetimepicker/moment"
``` 

### Import  & configuration
Basically the same way the @angular/material datepicker is configured and imported.

```
imports: [
  ...
  MatDatepickerModule,
  // use this if you want to use native javascript dates and INTL API if available
  // MatNativeDatetimeModule,
  MatMomentDatetimeModule,
  MatDatetimepickerModule
]
```

@see [src/app/app.module.ts](src/app/app.module.ts)

### Usage
```
<form [formGroup]="group">
  <mat-form-field>
    <mat-placeholder>Start DateTime</mat-placeholder>
    <mat-datetimepicker-toggle [for]="datetimePicker" matSuffix></mat-datetimepicker-toggle>
    <mat-datetimepicker #datetimePicker type="datetime" openOnFocus="true" timeInterval="5"></mat-datetimepicker>
    <input matInput formControlName="start" [matDatetimepicker]="datetimePicker" required autocomplete="false">
  </mat-form-field>
</form>
```
### Theming
```
@import '~@mat-datetimepicker/core/datetimepicker/datetimepicker-theme.scss';

// Using the $theme variable from the pre-built theme you can call the theming function
@include mat-datetimepicker-theme($theme);
```
@see [src/styles.scss](src/styles.scss)

