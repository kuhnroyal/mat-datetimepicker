# 3.0.0-beta.0 (14/12/2018)
Initial Angular/material 7.1.x version
* feat: [#54](https://github.com/kuhnroyal/mat-datetimepicker/issues/54) Angular 7 support

# 2.0.1 (10/07/2018)
* feat: [#15](https://github.com/kuhnroyal/mat-datetimepicker/issues/15) No way to change date label in popup-header
* fix: [#23](https://github.com/kuhnroyal/mat-datetimepicker/issues/23) Placeholder broken when ChangeDetection.OnPush is used
* fix: [#33](https://github.com/kuhnroyal/mat-datetimepicker/issues/33) Component fails to package with ng-packagr

# 2.0.1-beta.1 (09/07/2018)
* attempted fix: [#33](https://github.com/kuhnroyal/mat-datetimepicker/issues/33) Component fails to package with ng-packagr

# 2.0.1-beta.0 (06/07/2018)
* refactored to new angular CLI and ngPackagr

# 2.0.0 (02/07/2018)
Initial Angular/material 6 version
* chore: update to angular 6.0.7
* chore: update to angular-material 6.3.1
* chore: update to rxjs 6.2.1
* fix: [#25](https://github.com/kuhnroyal/mat-datetimepicker/issues/25)

Thanks [johankvint](https://github.com/johankvint) for the initial work in [#26](https://github.com/kuhnroyal/mat-datetimepicker/pull/26)

# 1.0.5 (02/07/2018)
* fix: [#30](https://github.com/kuhnroyal/mat-datetimepicker/pull/30)
Reformat value on blur - thanks [dzurikmiroslav](https://github.com/dzurikmiroslav)
* fix: [#31](https://github.com/kuhnroyal/mat-datetimepicker/issues/31)
([PR-#32](https://github.com/kuhnroyal/mat-datetimepicker/pull/32))
Min/Max validation not taking time into account - thanks [dzurikmiroslav](https://github.com/dzurikmiroslav)

# 1.0.4 (03/04/2018)
* chore: update to material 5.2.4 and required angular 5.2.3
* fix: [#11](https://github.com/kuhnroyal/mat-datetimepicker/issues/11)
add separate parsing formats for moment adapter
([PR-#12](https://github.com/kuhnroyal/mat-datetimepicker/pull/12)) - thanks [@benoitbzl](https://github.com/benoitbzl)
* fix: [#14](https://github.com/kuhnroyal/mat-datetimepicker/pull/14)
"touchUi" parameter throws error - thanks [@guschnwg](https://github.com/guschnwg)
* fix: disable click on month label when type = "month"
([053d5a1](https://github.com/kuhnroyal/mat-datetimepicker/commit/053d5a111e0546cfa33b79117694f4905f1777b0)) - thanks [@guschnwg](https://github.com/guschnwg)
* fix: [#10](https://github.com/kuhnroyal/mat-datetimepicker/issues/10) [#21](https://github.com/kuhnroyal/mat-datetimepicker/issues/21)
apply IE11 focus code from upstream material
([0e67e30](https://github.com/kuhnroyal/mat-datetimepicker/commit/0e67e30b2734985b8dddaa72b03bf1dff70c6b84))
* feat:
[#19](https://github.com/kuhnroyal/mat-datetimepicker/issues/19)
allow filtering on hours/minutes with "dateFilter", filter functions now take a 2nd parameter.
([6e150ee](https://github.com/kuhnroyal/mat-datetimepicker/commit/6e150eeb54a54f77c18e25f578958ee417494c0a))

# 1.0.3 (03/04/2018) NOT RELEASED
* unpublished due to wrong packaging

# 1.0.2 (14/01/2018)
* fix: [#5](https://github.com/kuhnroyal/mat-datetimepicker/issues/5) output format for initial values in reactive forms not respected
* fix: [#6](https://github.com/kuhnroyal/mat-datetimepicker/issues/6) min/max values in clock view not respected

# 1.0.1 (07/12/2017)
* fix: peerDependency version @mat-datetimepicker/core

# 1.0.0 (07/12/2017)
* chore: update to @angular/material 5.0.0
