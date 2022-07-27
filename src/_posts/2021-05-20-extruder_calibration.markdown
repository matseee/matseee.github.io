---
layout: post
title: "Kalibrierung des Extruders"
date: 2021-05-20 23:00:00 +0200
categories: ["3D-Printing"]
---
Kurze Anleitung wie man einen Extruder kalibriert. Hierfuer wird [Octoprint](https://octoprint.org/) oder eine aehnliche direkte Steuerungsmoeglichkeit des Druckers benoetigt.

1. Filament aus dem Hotend entfernen und so setzen, dass es eben mit dem Extruder-Ausgang abschliesst. 
2. ...
    - Marlin: Mit dem Befehl `M302 P1` die Kalte-Extrusions-Pruefung ausschalten. ([`M302`](https://marlinfw.org/docs/gcode/M302.html))
    - Klipper: Hotend aufheizen
3. Ueber die Octoprint-UI 100mm extrudieren.
4. Das extrudierte Filament messen (bspw. `104.71mm`)
5. ...
    - Marlin: `100mm / 104.71mm = 0.955018622863`
    - Klipper: `104.71mm / 100.00mm = 1.0471`
6. ...
    - Marlin: Mit `M503` den aktuellen `E` Wert auslesen. `E = alt.E x 0.955018622863`. Mit `M92 EXXX.X` wird der neue Wert gesetzt ([`M92`](https://marlinfw.org/docs/gcode/M092.html)). `M500` speichert die Anpassung im EEPROM ([`M500`](https://marlinfw.org/docs/gcode/M500.html)).
    - Klipper: Aus der `printer.cfg` den aktuellen `rotation_distance`-Wert des Extruders mal den zuvor errechneten Wert (bspw. `rotation_distance = 7.808 * 1.0471` und anschliessend auf drei Stellen runden.
7. ...
    - Marlin: Mit dem Befehl `M302 P0` die Kalte-Extrusions-Pruefung aktivieren.

Fertig.