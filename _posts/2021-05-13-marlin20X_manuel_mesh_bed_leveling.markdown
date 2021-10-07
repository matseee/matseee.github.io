---
layout: post
title: "Marlin 20X: Manuelles Mesh-Bed-Leveling"
date: 2021-05-13 03:45:00 +0200
categories: ["3D-Printing", "marlin"]
---
Kurze Anleitung wie ein Mesh-Bed-Leveling per LCD Input mit der Marlin 2.0.X durchgefuehrt wird.

1. Druckbett aufheizen
1. Druckbett manuell leveln
1. `Print` -> `Special menu` -> `Mesh bed leveling`
1. `Start mesh leveling` (Der Drucker sollte sich homen und anschliessend zur ersten Mesh-Position fahren)
1. Position leveln
1. `Next position`
1. Position leveln (solange wiederholen bis alle Positionen fertig sind)
1. `Save EEPROM`
1. Drucker neustarten
1. Im Slicer-Programm muss nun das Mesh-Bed definiert werden, hierzu muessen die Befehle `M501` und `M420 S1` direkt nach dem Homing der Z-Achse ausgefuehrt werden:
    ```
    ...
    G28 Z0      ; Home Z
    M501        ; Load all saved settings from EEPROM
    M420 S1     ; Set bed level state (S = Enabled [1] / Disabled [0])
    ...
    ```
1. Mit dem Befehl `G29 T` kann das aktuelle Mesh ausgegeben werden:
   ```
   Send: G29 T
    Recv: Mesh Bed Leveling OFF
    Recv: 5x5 mesh. Z offset: 0.00000
    Recv: Measured points:
    Recv:         0        1        2        3        4
    Recv:  0 +0.00000 +0.01000 +0.04000 +0.03000 +0.02000
    Recv:  1 +0.00000 +0.02000 +0.06000 +0.03000 +0.01000
    Recv:  2 -0.03000 +0.00000 +0.02000 +0.02000 -0.01000
    Recv:  3 -0.04000 -0.03000 -0.02000 -0.03000 -0.03000
    Recv:  4 +0.01000 -0.02000 -0.01000 -0.01000 +0.01000
    Recv: 
    Recv: X:0.00 Y:0.00 Z:0.00 E:0.00 Count X:0 Y:0 Z:0
    Recv: ok
   ```

Fertig.
