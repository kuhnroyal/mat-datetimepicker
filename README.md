# Material Datetimepicker for @angular/material

> **The example application is on [GitHub Pages](https://kuhnroyal.github.io/mat-datetimepicker/)!**

[![Build](https://img.shields.io/github/workflow/status/kuhnroyal/mat-datetimepicker/Test?style=flat-square)](https://github.com/kuhnroyal/mat-datetimepicker/actions/workflows/test.yaml)
[![Latest Stable Version](https://img.shields.io/npm/v/@mat-datetimepicker/core?style=flat-square)](https://www.npmjs.com/package/@mat-datetimepicker/core)
[![License](https://img.shields.io/npm/l/@mat-datetimepicker/core.svg?style=flat-square)](https://www.npmjs.com/package/@mat-datetimepicker/core)
[![NPM Downloads](https://img.shields.io/npm/dm/@mat-datetimepicker/core.svg?style=flat-square)](https://www.npmjs.com/package/@mat-datetimepicker/core)

---

The datetimepicker was initially taken from [`Promact/md2`](https://github.com/Promact/md2) and modified to
use `@angular/material`. We have also added theming support.

Like the `@angular/material` `datepicker` it contains a `native-datetime-adapter` as well as a `moment-datetime-adapter`
.

# Contents

- [Usage](#usage)
- [Development](#development)

# Usage

## Installation

Install:

```sh
npm install --save @mat-datetimepicker/core
```

And for the moment adapter:

```sh
npm install --save @angular/material-moment-adapter mat-datetimepicker/moment
```

## Setup

Basically the same way the `@angular/material` datepicker is configured and imported.

```ts
imports: [
  ...MatDatepickerModule,
  // use this if you want to use native javascript dates and INTL API if available
  // MatNativeDatetimeModule,
  MatMomentDatetimeModule,
  MatDatetimepickerModule,
];
```

@see [`src/app/app.module.ts`](src/app/app.module.ts)

## Using the component

```html
<form [formGroup]="group">
  <mat-form-field>
    <mat-placeholder>Start DateTime</mat-placeholder>
    <mat-datetimepicker-toggle
      [for]="datetimePicker"
      matSuffix
    ></mat-datetimepicker-toggle>
    <mat-datetimepicker
      #datetimePicker
      type="datetime"
      openOnFocus="true"
      timeInterval="5"
    >
    </mat-datetimepicker>
    <input
      matInput
      formControlName="start"
      [matDatetimepicker]="datetimePicker"
      required
      autocomplete="false"
    />
  </mat-form-field>
</form>
```

## Date formatting

In order to change the default input/output formats, a custom instance of `MAT_DATETIME_FORMATS` needs to be provided in
the global configuration.

Input/output formats can be changed separately for the existing datetime picker types
`date`, `month` , `datetime`and `time`.

## Accessibility

You can use the following properties to provide values for ARIA- attributes:

| Property           | Description                                                | Default          |
| ------------------ | ---------------------------------------------------------- | ---------------- |
| ariaNextMonthLabel | `aria-label` for the `Next` button in the `month` mode     | "Next month"     |
| ariaPrevMonthLabel | `aria-label` for the `Previous` button in the `month` mode | "Previous month" |
| ariaNextYearLabel  | `aria-label` for the `Next` button in the `year` mode      | "Next year"      |
| ariaPrevYearLabel  | `aria-label` for the `Previous` button in the `year` mode  | "Previous year"  |

The component supports property bindings or pipes with the aria- values.

### Native

Parsing does not work with the native adapter because the Intl.DateTimeFormat API does not provide that feature.

```ts
providers: [
  {
    provide: MAT_DATETIME_FORMATS,
    useValue: {
      parse: {},
      display: {
        dateInput: {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        },
        monthInput: {
          month: 'long',
        },
        datetimeInput: {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        },
        timeInput: {
          hour: '2-digit',
          minute: '2-digit',
        },
        monthYearLabel: {
          year: 'numeric',
          month: 'short',
        },
        dateA11yLabel: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        monthYearA11yLabel: {
          year: 'numeric',
          month: 'long',
        },
        popupHeaderDateLabel: {
          weekday: 'short',
          month: 'short',
          day: '2-digit',
        },
      },
    },
  },
];
```

@see defaults in [`native-datetime-formats.ts`](projects/core/src/adapter/native-datetime-formats.ts) \
@see Intl.DateTimeFormat
API [documentation](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)

### Moment

```ts
providers: [
  {
    provide: MAT_DATETIME_FORMATS,
    useValue: {
      parse: {
        dateInput: 'L',
        monthInput: 'MMMM',
        timeInput: 'LT',
        datetimeInput: 'L LT',
      },
      display: {
        dateInput: 'L',
        monthInput: 'MMMM',
        datetimeInput: 'L LT',
        timeInput: 'LT',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
        popupHeaderDateLabel: 'ddd, DD MMM',
      },
    },
  },
];
```

@see defaults in [`moment-datetime-formats.ts`](projects/moment/src/adapter/moment-datetime-formats.ts) \
@see moment.js [documentation](https://momentjs.com/docs/#/displaying/)

## Theming

```scss
@import '@mat-datetimepicker/core/datetimepicker/datetimepicker-theme.scss';

// Using the $theme variable from the pre-built theme you can call the theming function
@include mat-datetimepicker-theme($theme);
```

@see [src/styles.scss](src/styles.scss)

# Development

Run `npm install` in order to install all required dependencies and initialize the Git hooks. Further instructions are
available in the [`DEVELOPMENT.md`](https://github.com/kuhnroyal/mat-datetimepicker/blob/release/DEVELOPMENT.md).

**Make sure you read at
least [the "Committing" section](https://github.com/kuhnroyal/mat-datetimepicker/blob/release/DEVELOPMENT.md#committing)
before committing anything.**
