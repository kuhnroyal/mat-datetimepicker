# Material Datetimepicker for @angular/material 8.x

This is the main branch for @angular/material 8.x

You can find the Angular 5 version on the `1.x` branch. \
You can find the Angular 6 version on the `2.x` branch.

## Description

The datetimepicker is taken from [Promact/md2](https://github.com/Promact/md2) and modified to use @angular/material as base and added theming support.

Like the @angular/material datepicker it contains a native-datetime-adapter as well as a moment-datetime-adapter.

[![Travis CI](https://travis-ci.org/kuhnroyal/mat-datetimepicker.svg?branch=master)](https://travis-ci.org/kuhnroyal/mat-datetimepicker)
[![Latest Stable Version](https://img.shields.io/npm/v/@mat-datetimepicker/core.svg)](https://www.npmjs.com/package/@mat-datetimepicker/core)
[![License](https://img.shields.io/npm/l/@mat-datetimepicker/core.svg)](https://www.npmjs.com/package/@mat-datetimepicker/core)
[![NPM Downloads](https://img.shields.io/npm/dm/@mat-datetimepicker/core.svg)](https://www.npmjs.com/package/@mat-datetimepicker/core)

# Usage
## Installation
Install:
```
yarn install @mat-datetimepicker/core
```
And for the moment adapter:
```
yarn install @angular/material-moment-adapter
yarn install @mat-datetimepicker/moment
``` 

## Setup
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

## Using the component
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

## Date formatting
In order to change the default input/output formats,
a custom instance of `MAT_DATETIME_FORMATS` needs to be provided in the global configuration.

Input/output formats can be changed separately for the existing datetime picker types
`date`, `month` , `datetime`and `time`.

### Native
Parsing does not work with the native adapter because the Intl.DateTimeFormat API does not provide that feature.
```
  providers: [
    {
      provide: MAT_DATETIME_FORMATS,
      useValue: {
        parse: {},
        display: {
          dateInput: {year: "numeric", month: "2-digit", day: "2-digit"},
          monthInput: {month: "long"},
          datetimeInput: {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"},
          timeInput: {hour: "2-digit", minute: "2-digit"},
          monthYearLabel: {year: "numeric", month: "short"},
          dateA11yLabel: {year: "numeric", month: "long", day: "numeric"},
          monthYearA11yLabel: {year: "numeric", month: "long"},
          popupHeaderDateLabel: {weekday: "short", month: "short", day: "2-digit"}
      }
    }
  ]
```
@see defaults in [native-datetime-formats.ts](projects/core/src/adapter/native-datetime-formats.ts) \
@see Intl.DateTimeFormat API [documentation](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)

### Moment
```
  providers: [
    {
      provide: MAT_DATETIME_FORMATS,
      useValue: {
        parse: {
          dateInput: "L",
          monthInput: "MMMM",
          timeInput: "LT",
          datetimeInput: "L LT"
        },
        display: {
          dateInput: "L",
          monthInput: "MMMM",
          datetimeInput: "L LT",
          timeInput: "LT",
          monthYearLabel: "MMM YYYY",
          dateA11yLabel: "LL",
          monthYearA11yLabel: "MMMM YYYY",
          popupHeaderDateLabel: "ddd, DD MMM"
        }
      }
    }
  ]
```
@see defaults in [moment-datetime-formats.ts](projects/moment/src/adapter/moment-datetime-formats.ts) \
@see moment.js [documentation](https://momentjs.com/docs/#/displaying/)

## Theming
```
@import '~@mat-datetimepicker/core/datetimepicker/datetimepicker-theme.scss';

// Using the $theme variable from the pre-built theme you can call the theming function
@include mat-datetimepicker-theme($theme);
```
@see [src/styles.scss](src/styles.scss)

# Development
## Performing a local build
```
yarn install
yarn build
``` 

## Running the sample app locally
```
yarn install
yarn build
yarn start
``` 

## Using the local build in some project
```
cd my-project
``` 
Add the dependencies to your `package.json`:
```
"dependencies": {
    "@mat-datetimepicker/core": "3.0.0-beta.0",
    "@mat-datetimepicker/moment": "3.0.0-beta.0",
}
```
Link the local built modules:
```
yarn link "@mat-datetimepicker/core"
yarn link "@mat-datetimepicker/moment"
``` 
