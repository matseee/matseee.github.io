---
layout: post
title:  "Marlin 20X PID Tuning"
date:   2021-05-13 03:03:00 +0200
categories: 3D-Printing
---
Kurze Anleitung wie ein PID-Tuning des Hotends durchgefuehrt wird.

Vorraussetzungen:
- Octoprint (oder eine andere Software die Zugriff auf das Terminal ermoeglicht)

1. Falls das Hotend Heiss ist, abkuehlen!
1. Aktuelle PID Werte auslesen (und notieren!) `M503`
   `PXX.XX IX.XX DXX.XX`
1. PID Autotune starten `M303 E0 S230 C8` (`S` = Zieltemperatur, `C` = Versuchs-Zyklen)
1. Neuen PID Werte speichern: `M301 PXX.XX IX.XX DXX.XX`
1. EEPROM mit `M500` speichern
1. Drucker neustarten und mit `M503` verifizieren, dass die neuen Werte gespeichert wurden

Fertig.