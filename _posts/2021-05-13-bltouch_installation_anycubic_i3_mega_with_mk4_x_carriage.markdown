---
layout: post
title:  "BLTouch Installation auf einem Anycubic i3 Mega mit MK4 X-Carriage E3D V5 "
date:   2021-05-13 07:35:00 +0200
categories: 3D-Printing
---
Kurze Zusammenfassung wie man einen BLTouch mit Marlin 2.0.X ([Knutwurst 1.1.9](https://github.com/knutwurst/Marlin-2-0-x-Anycubic-i3-MEGA-S)) auf einem Anycubic i3 Mega mit [MK4 X-Carriage](https://www.thingiverse.com/thing:3537449) E3D V5 einrichtet.

## Firmware update / Hardware anschliessen
1. Firmware flashen ([Knutwurst 1.1.9](https://github.com/knutwurst/Marlin-2-0-x-Anycubic-i3-MEGA-S)) **Firmware default laden & EEPROM speichern**
1. [BL Touch anschliessen](https://github.com/knutwurst/Marlin-2-0-x-Anycubic-i3-MEGA-S/wiki/BLTouch-Installation-(deutsch))
1. Testweise einmal starten; der BLTouch sollte leuchten und ein paar mal im Sekundentakt ausfahren

## Konfiguration des BLTouch
Um das Autoleveling zu benutzen muessen zunaechst die richtigen Offsets des BLTouch in Marlin eintragen werden. Hierbei muss nur das Z-Offset ermittelt werden. X/Y werden im MK4 X-Carriage Projekt (X=+29, Y=-15) vorgegeben. Fuer die Ermittlung des Z-Offsets muessen folgende Schritte durchgefuehrt werden (**alles mit aufgeheizten Druckbett**):

1. Manuell Leveln
1. `G28` zum Homen ([G28](https://marlinfw.org/docs/gcode/G028.html))
1. `G90` absolute Positionen aktivieren ([G90](https://marlinfw.org/docs/gcode/G090.html))
1. `G1 Z10` zur Z-Position 10mm fahren ([G1](https://marlinfw.org/docs/gcode/G000-G001.html))
1. `G1 X40 Y40 F4000` zur ersten Mesh Position fahren
1. `M280 P0 S10` BLTouch Servo ausfahren ([M280](https://marlinfw.org/docs/gcode/M280.html))
1. `G91` relative Positionen aktivieren ([G91](https://marlinfw.org/docs/gcode/G091.html))
1. Mit `G1 Z-X.XX` die Position (auf 0.01 genau) herausfinden an dem der Sensor ausloest (Blinken); bei zu schnellem herunterfahren kann der BLTouch mit `M280 P0 S160` und anschliessendem `M280 P0 S10` wieder zurueckgesetzt werden.
1. Punkt gefunden? Dann mit `M280 P0 S160` den BLTouch zuruecksetzen und die Z-Achse nicht mehr bewegen
1. `M114` die aktuelle Position ausgeben und speichern ([M114](https://marlinfw.org/docs/gcode/M114.html))
1. `G90` absolute Positionen aktivieren
1. Hotend zur aktuellen Position des BLTouch bewegen; `G1 X69 Y25 F4000` X=40+29; Y=40-25
1. `G91` relative Positionen aktivieren
1. Mit dem `G1 Z-X.XX` Befehl die Z-Position herausfinden, an dem ein Kassenbon sich nicht mehr unter der Duese bewegen laesst.
1. `M114` die aktuelle Position ausgeben und speichern
1. `Z-Offset = BLTouch-Z-Pos - Duese-Z-Pos`
1. Die XYZ-Offsets des BLTouch koennen nun mit `M851 X29 Y-15 Z-X.XX` gesetzt werden ([M851](https://marlinfw.org/docs/gcode/M851.html))
1. `M500` zum schreiben des EEPROM ([M500](https://marlinfw.org/docs/gcode/M500.html))

Prinzipell wars das, jetzt kann per LCD oder GCode Befehlen das automatische Bed-Leveling durchgefuehrt werden.

Per GCode:
```
G28     ;home
G29     ;auto mesh leveling
M500    ;save to EEPROM
```

PS: Damit das Mesh in deinen Drucken auch benutzt wird, muss im Start-GCode entweder mit `M420 S1` ([M420](https://marlinfw.org/docs/gcode/M420.html)) das aktuelle Mesh aktiviert oder nachdem Homeing ein neues Mesh per `G29` ([G29](https://marlinfw.org/docs/gcode/G029-abl-bilinear.html)) erzeugt werden. 
