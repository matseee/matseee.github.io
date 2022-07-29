---
layout: post
title:  "SAP BAPI_GOODSMVT_CREATE"
date: 2022-07-12 00:00:00 +0200
categories: ["Programming", "SAP"]
---
Simple code example how to use the bapi `BAPI_GOODSMVT_CREATE` to create a goods movement with abap.

1. [Movement indicator (`mvt_ind`)](#movement-indicator)
1. [Goods movement code (`gm_code`)](#goods-movement-code)
1. [Movement types (`move_type`)](#movement-types)

```abap
DATA ls_header TYPE bapi2017_gm_head_01.
DATA ls_code   TYPE bapi2017_gm_code.
DATA ls_item   TYPE bapi2017_gm_item_create.
DATA lt_items  LIKE TABLE OF ls_item.

DATA ls_return TYPE bapiret2.
DATA lt_return LIKE TABLE OF ls_return.

DATA lv_error  TYPE abap_bool.
DATA lv_errmsg TYPE string.

" Fill bapi2017_gm_head_01 structure
ls_header-pstng_date        = datum.   " Booking date
ls_header-doc_date          = datum.   " Reference date
ls_header-ref_doc_no        = xblnr.   " Reference number

" Fill bapi2017_gm_item_create structure

" goods receipt for purchase order:
ls_item-po_number               = ebeln.
ls_item-po_item                 = ebelp.
ls_item-vendrbatch              = lichn.
ls_item-mvt_ind                 = 'B'.
ls_item-move_type               = '101'. " 101=gr; 102=gr storno; 
                                         " 103=gr into blocked stock; 104=gr into blocked stock storno
ls_code-gm_code                 = '01'.

" goods receipt for process order
ls_item-orderid                 = aufnr.
ls_item-mvt_ind                 = 'F'.
ls_item-move_type               = '101'. " 101=goods receipt; 102=goods receipt storno
ls_code-gm_code                 = '02'.

" goods issue for process order (reservation)
ls_item-orderid                 = aufnr.
ls_item-reserv_no               = rsnum.
ls_item-res_item                = rspos.
ls_item-res_type                = rsart.
ls_item-mvt_ind                 = ''.
ls_item-move_type               = '261'. " 261=goods issue; 262=goods issue storno
ls_code-gm_code                 = '03'.

" other values
ls_item-plant                   = werks_d.
ls_item-stge_loc                = lgort_d.
ls_item-material                = matnr.
ls_item-batch                   = charg_d.
ls_item-entry_qnt               = menge.
ls_item-entry_uom               = meins_d.
ls_item-entry_uom_iso           = isocd_unit.
ls_item-expirydate              = vfdat.
ls_item-prod_date               = hsdat.

" Multiple items are possible
APPEND ls_item TO lt_items.

" Call function
CALL FUNCTION 'BAPI_GOODSMVT_CREATE'
  EXPORTING
    goodsmvt_header  = ls_header
    goodsmvt_code    = ls_code-gm_code
    testrun          = ' '
  IMPORTING
    materialdocument = mblnr
    matdocumentyear  = mjahr
  TABLES
    goodsmvt_item    = lt_items
    return           = lt_return.

" Parse return table
LOOP AT lt_return INTO ls_return.
  IF ls_return-type = 'E' OR ls_return-type = 'A'.

    " Maybe log the error message  
    MESSAGE ID ls_return-id TYPE ls_return-type NUMBER ls_return-number
      WITH ls_return-message_v1 ls_return-message_v2 
           ls_return-message_v3 ls_return-message_v4
      INTO lv_errmsg.

    lv_error = abap_true.
  ENDIF.
ENDLOOP.

" Rollback or Commit work
IF lv_error = abap_true.
  CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
ELSE.
  CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
    EXPORTING
      wait = 'X'.
ENDIF.
```

## Movement indicator

| indicator (`mvt_ind`) | description |
|---|---|
|  | Goods movement w/o reference |
| `B` 	|  Goods movement for purchase order |
| `F` 	| Goods movement for production order | 
| `L` | Goods movement for delivery note |

## Goods movement code

| code (`gm_code`) | transaction | description | 
|---|---|---|
| `01` | MB01 | Goods receipts for purchase order |
| `02` | MB31 | Goods receipts for prod order |
| `03` | MB1A | Goods issue |
| `04` | MB1B | Transfer posting |
| `05` | MB1C | Enter Other Goods receipt |
| `06` | MB11 | Goods movement |
| `07` | MB04 | Subsequent charging for material provided |

## Movement types
### Good Receipt - 100

| type (`move_type`) | description |
| --- | --- |
| `101` | Goods receipt for purchase order |
| `103` | Goods receipt for purchase order to GR blocked stock |
| `105` | Release from the GR blocked stock for the purchase order |
| `121` | Subsequent adjustment for subcontracting |
| `122` | Return deliveries to vendor |
| `124` | Return delivery to vendor from GR blocked stock |
| `161` | Returns for purchase order |

### Good Issue - 200

| type | description |
| --- | --- |
| `201` | Goods issue for a cost center |
| `221` | Goods issue for a project |
| `251` | Goods issue for sale (without sales order) |
| `261` | Goods issue for an order |
| `281` | Goods issue for a network |
| `291` | Goods issue for any account assignment |

### Storage Location transfer - 300

| type | description |
| --- | --- |
| `301` | Plant to plant transfer in one step |
| `303` | Plant to plant transfer in two steps : stock removal |
| `305` | Plant to plant transfer in two steps : putaway |
| `309` | Transfer postings from material to material |
| `311` | Transfer of storage location to storage location in one step |
| `313` | Transfer of storage location to storage location in two steps : stock removal |
| `315` | Transfer of storage location to storage location in two steps : putaway |
| `321` | Transfer of inspection stock : unrestricted-use stock |
| `323` | Transfer of storage location to storage location : inspection stock |
| `325` | Transfer of storage location to storage location : blocked stock |
| `331` | Sample from the inspection stock |
| `333` | Sample from the unrestricted-use stock |
| `335` | Sample from the blocked stock |
| `341` | Status change of a batch (unrestricted-use to restricted) |
| `343` | Transfer of blocked stock : unrestricted-use stock |
| `349` | Transfer of blocked stock : inspection stock |
| `351` | Goods issue for a stock transport order (without shipping) |

### Special stock - 400

| type | description |
| --- | --- |
| `411` | Transfer of special stock to own stock (only for sales order stock) |
| `413` | Transfer posting to sales order stock |
| `451` | Returns from customer (without shipping) |
| `453` | Transfer of blocked stock returns to unrestricted-use stock |
| `455` | Returns stock transfer |
| `457` | Transfer of blocked stock returns to inspection stock |
| `459` | Transfer of blocked stock returns to blocked stock |

### Special Goods receipt - 500

| type | description |
| --- | --- |
| `501` | Goods receipt without purchase order : unrestricted-use stock |
| `503` | Goods receipt without purchase order : stock in quality inspection |
| `505` | Goods receipt without purchase order : blocked stock |
| `521` | Goods receipt without order : unrestricted-use stock |
| `523` | Goods receipt without order : inspection stock |
| `525` | Goods receipt without order : blocked stock |
| `531` | Goods receipt of by-products from order |
| `541` | Transfer of unrestricted-use stock to subcontracting stock |
| `543` | Consumption from subcontracting stock |
| `545` | Goods receipt of by-products from subcontracting |
| `551` | Scrapping from unrestricted-use stock |
| `553` | Scrapping from inspection stock |
| `555` | Scrapping from blocked stock |
| `557` | Issue from stock in transit (adjustment posting) |
| `561` | Initial entry of stock balances : unrestricted-use stock |
| `563` | Initial entry of stock balances : quality inspection |
| `565` | Initial entry of stock balances : blocked stock |
| `581` | Goods receipt of a by-product from network |

### Shipping - 600

| type | description |
| --- | --- |
| `601` | Goods issue for delivery |
| `603` | Goods issue for a stock transport order (shipping) with additional item |
| `605` | Goods receipt for a stock transport order (shipping) with additional item |
| `621` | Transfer of unrestricted-use stock : returnable packaging with customer (shipping) |
| `623` | Goods issue from returnable packaging with customer (shipping) |
| `631` | Transfer of unrestricted-use stock : consignment stock at customer (shipping) |
| `633` | Goods issue from consignment stock at customer (shipping) |
| `641` | Goods issue for a stock transport order (shipping) |
| `643` | Goods issue for a cross-company-code stock transport order |
| `645` | Goods issue for a cross-company-code stock transport order performed in one step (shipping) |
| `647` | Goods issue for a stock transport order performed in one step (shipping) |
| `651` | Returns from customer (shipping) |
| `653` | Returns from customer (shipping) to unrestricted-use stock |
| `655` | Returns from customer (shipping) to inspection stock |
| `657` | Returns from customer (shipping) to blocked stock |
| `661` | Returns to vendor using shipping |
| `673` | Returns for a cross-company-code stock transport order (shipping) |
| `675` | Returns for a cross-company-code stock transport order (shipping) performed in one step |

### Inventory differences - 700

| type | description |
| --- | --- |
| `701` | Inventory difference in unrestricted-use stock |
| `703` | Inventory difference in quality inspection stock (MM-IM) |
| `707` | Inventory difference in blocked stock |
| `711` | Inventory difference in unrestricted-use stock (LE-WM) |
| `713` | Inventory difference in quality inspection stock (MM-IM) |
| `715` | Inventory difference for returns |
| `717` | Inventory difference in blocked stock (LE-WM) |
