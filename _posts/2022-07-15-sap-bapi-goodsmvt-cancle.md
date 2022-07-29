---
layout: post
title:  "SAP BAPI_GOODSMVT_CANCLE"
date: 2022-07-15 00:00:00 +0200
categories: ["Programming", "SAP"]
---
Simple code example how to use the bapi `BAPI_GOODSMVT_CANCLE` to cancle a material document.

```abap
DATA ls_headret TYPE bapi2017_gm_head_ret.

DATA ls_return  TYPE bapiret2.
DATA lt_return  LIKE TABLE OF wa_ret.
DATA lv_error   TYPE abap_boolean.
DATA lv_errmsg  TYPE string.

* Call function
CALL FUNCTION 'BAPI_GOODSMVT_CANCEL'
  EXPORTING
    materialdocument = mblnr
    matdocumentyear  = mjahr
  IMPORTING
    goodsmvt_headret = ls_headret
  TABLES
    return           = lt_return.

* Parse return table
LOOP AT lt_return INTO ls_return.
  IF ls_return-type = 'E' OR ls_return-type = 'A'.
    " Maybe log the error message  
    MESSAGE ID ls_return-id TYPE ls_return-type NUMBER ls_return-number
      WITH ls_return-message_v1 ls_return-message_v2 ls_return-message_v3 ls_return-message_v4
      INTO lv_errmsg.

    lv_error = abap_true.
  ENDIF.
ENDLOOP.

* Rollback or Commit work
IF lv_error = abap_true.
  CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
ELSE.
  CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
    EXPORTING
      wait = 'X'.
ENDIF.
```
