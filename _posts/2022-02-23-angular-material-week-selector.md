---
layout: post
title:  "Angular Material - Week selection"
date: 2022-02-23 00:35:00 +0200
categories: ["Programming"]
---
For an planing software I needed a simple solution of an week selection input.
The frontend was developed with the framework [angular](https://angular.io/) and used mainly the components of [angular material](https://material.angular.io/).
So my first intution was to look into the angular material documentation and find the right component for that specific problem.
The normal datepicker component wasn't fitting the specifica, but there was also a date range picker with an option to create its own selection strategy.
So my plan was set, create a simple date range selection strategy which I want to present to you:

```typescript
// week-selection.strategy.ts
import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {
    DateRange, MatDateRangeSelectionStrategy
} from '@angular/material/datepicker';

@Injectable()
export class WeekSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
    constructor(protected _dateAdapter: DateAdapter<D>) { }

    selectionFinished(date: D | null): DateRange<D> {
        return this._createWeekRange(date);
    }

    createPreview(activeDate: D | null): DateRange<D> {
        return this._createWeekRange(activeDate);
    }

    protected _createWeekRange(date: D | null): DateRange<D> {
        if (date) {
            // dayOfWeek 0 - 6
            const dayOfWeek = this._dateAdapter.getDayOfWeek(date);
            
            // subtract the current day of the week to get the first
            const start = this._dateAdapter.addCalendarDays(date, dayOfWeek * -1);
            
            // add the difference to get the last
            const end = this._dateAdapter.addCalendarDays(date, 6 - dayOfWeek);
            return new DateRange<D>(start, end);
        }

        return new DateRange<D>(null, null);
    }
}
```
This strategy was used as followed:
```html
<form [formGroup]="formGroup">
    <mat-form-field>
        <mat-label>Week</mat-label>
        <mat-date-range-input [rangePicker]="picker">
            <input matStartDate placeholder="Start date" formControlName="start">
            <input matEndDate placeholder="End date" formControlName="end">
        </mat-date-range-input>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-date-range-picker #picker></mat-date-range-picker>
    </mat-form-field>
</form>
```

Also do not forget to inject it in the module:

```typescript
// app.module.ts
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ...
    MatDatepickerModule,
  ],
  providers: [
    ...
    { provide: MAT_DATE_RANGE_SELECTION_STRATEGY, useClass: WeekSelectionStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
