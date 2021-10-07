---
layout: post
title: "Klipper: BLTouch Konfiguration auf dem Anycubic Mega S (Trigorilla Board 1.0)"
date: 2021-05-16 16:00:00 +0200
categories: ["3D-Printing", "klipper"]
---
Kurze Anleitung wie man einen [BLTouch 3.1](https://www.antclabs.com/bltouch-v3) auf einem Anycubic i3 Mega S mit einem Trigorilla Board 1.0 konfiguriert. Der BLTouch ist nach [dieser Anleitung](https://github.com/knutwurst/Marlin-2-0-x-Anycubic-i3-MEGA-S/wiki/BLTouch-Installation-(deutsch)) angeschlossen. ([Zuvor war Marlin 2.0.X installiert](https://matse.work/3d-printing/2021/05/13/bltouch_installation_anycubic_i3_mega_with_mk4_x_carriage.html)). Je Nach X-Carriage koennen sich die X,Y-Offsets unterscheiden, waehlt hierbei die richtigen Offsets! Beim Start des Druckers sollte sich der BLTouch in Sekundentakt ausfahren, falls dies nicht passiert ist der BLTouch nicht richtig angeschlossen!

## BLTouch-Pins ermitteln und konfigurieren
1. Erweitern der `printer.cfg` um den `bltouch` Block.
    ```conf
    ...
    [bltouch]
    sensor_pin: ^PXX
    control_pin: PXX
    ...
    ```
2. Um den BLTouch ansteuern zu koennen, muessen die richtigen Pins konfiguriert werden. Der Control-Pin steuert das ausfahren des Arms und ist demnach ein Servo-Pin. Der Sensor-Pin ist ein Limit-Switch, ist demnach auch invertiert und wird ausgeloest sobald der BLTouch ausgeloest wird. Die Arduino-Pinbelegung muss fuer Klipper auf die Port-Definition gemappt werden. Meine Konfiguration sieht wie folgt aus:
    ![TRIGORILLA_10_PINOUT](/assets/images/2021-05-16_TRIGORILLA_10_PINOUT.png)
    Der Servo-Pin des BLTouchs hat den Arduino Pin `D11`, jener ist der Port `B5` => `control_pin: PB5` (`P` fuer Port). Der Sensor-Pin des BLTouchs ist an den Arduino Pin `D2` angeschlossen, welcher der Port `E4` ist => `sensor_pin: ^PE4`. Damit Klipper die Konfiguration des BLTouch Sensors annimmt, wird ein Z-Offset verlangt, dieses koennen wir erst einmal auf 0 stellen. In Summe ergibt das folgende Konfiguration:
    ```conf
    [bltouch]
    sensor_pin: ^PE4
    control_pin: PB5
    z_offset: 0
    ```
3. Nach einem Neustart des Hosts in Octoprint (oder Mainsail oder Fluidd) sollte der BLTouch ansteuerbar sein. Um dies zu testen, kann der BLTouch mit dem Befehl `BLTOUCH_DEBUG COMMAND=pin_down` ausgefahren und mit dem Befehl `BLTOUCH_DEBUG COMMAND=pin_up` eingefahren werden. Sollte dies nicht funktionieren, ist der Servo-Pin nicht richtig. Um den Sensor des BLTouch zu testen, wird zunaechst der Pin ausgefahren. Danach wird der Touch-Mode mit dem Befehl `BLTOUCH_DEBUG COMMAND=touch_mode` gestartet. Mit dem Befehl `QUERY_PROBE` kann der aktuelle Zustand des Sensors ausgelesen werden (Es sollte `probe: open` ausgeben). Nun kann man **vorsichtig** den BLTouch mit dem Fingernagel ausloesen. Danach sollte der Status `probe: TRIGGERED` ausgeben. Werden die Zustaende nicht korrekt erkannt, ist endweder der Sensor-Pin nicht richtig konfiguriert oder falsch angeschlossen. Abschliessend muss man den BLTouch mit dem Befehl `BLTOUCH_DEBUG COMMAND=pin_up` wieder einfahren. 

## X,Y-Offset konfigurieren
Auf meinem Anycubic i3 Mega befindet sich der [MK4 X-Carriage](https://www.thingiverse.com/thing:3537449). Dieser hat feste Werte fuer das X- und Y-Offset (X=+29, Y=-15). Fuer andere BLTouch-Halterungen muessen andere Werte gewaehlt werden. Die `printer.cfg` wird wie folgt angepasst:
```conf
[bltouch]
sensor_pin: ^PE4
control_pin: PB5
x_offset: 29
y_offset: -15
```

## Z-Offset ermitteln & konfigurieren
Um das Z-Offset zu ermitteln bietet Klipper ein Kalibrierungs-Tool. Dieses Tool misst zunaechst den Z-Abstand vom BLTouch zum Druckbett. Anschliessend wird die Nozzle auf den Punkt des BLTouch navigiert und man muss die Duese auf das Druckbett bewegen. Die Differenz dieser beiden Z-Hoehen ist das Z-Offset des BLTouch.
1. Mit `G28` den Drucker X,Y,Z-Achsen homen.
2. Den BLTouch zur Mitte des Drucksbett bewegen (`G1 X76 Y120 Z10`)
3. Kalibrierungs-Tool starten `PROBE_CALIBRATE`. Hierbei sollte der BLTouch den Abstand zum Druckbett ermitteln und die Nozzle anschliessend zum vorherigen Punkt des BLTouch bewegt werden.
4. Mit dem Befehl `TESTZ` den Abstand der Nozzle zum Druckbett ermitteln. Hierbei kann mit `TESTZ Z=-X.XX` bspw. `TESTZ Z=-0.01` der Druckkopf bewegt werden. Der Abstand sollte wie beim normalen Bed-Leveling sein. Sobald der richtige Wert gefunden wurde, kann mit dem Befehl `ACCEPT` der Z-Offset akzeptiert und anschliessend mit `SAVE_CONFIG` in der `printer.cfg` gespeichert werden.

## Mesh-Erstellen
Damit ein automatisches Mesh-Bed-Leveling durchgefuehrt werden kann, benoetigt Klipper noch die Informationen wie das Mesh aussehen soll. Diese Informationen werden im `bed_mesh`-Block der `printer.cfg` konfiguriert. Die Konfiguration ist ziemlich selbsterklaerend (ansonsten guck [hier](https://www.klipper3d.org/Bed_Mesh.html)):
```conf
[bed_mesh]
speed: 300
horizontal_move_z: 5
mesh_min: 29,2
mesh_max: 210,195
probe_count: 5,5
```

## Auto-Bed-Leveling im Start-Code einfuegen
Um das Auto-Bed-Leveling vor jedem Druck durchgefuehrt werden soll, muss im Slicer-Programm ein Befehl nach dem Homing hinzugefuegt werden. In Marlin konnte dies einfach per `G29` geschehen, Klipper kennt diesen G-Code jedoch nicht. Das Klipper Equivalent ist `BED_MESH_CALIBRATE`. Wenn du trotzdem `G29` nutzen willst, kannst du in deiner `printer.cfg` ein [G-Code Macro](https://www.klipper3d.org/G-Codes.html#g-code-macro-commands) hinterlgen.
```conf
[gcode_macro G29]
gcode:
    BED_MESH_CALIBRATE
```

Fertig.
