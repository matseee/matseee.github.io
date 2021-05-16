---
layout: post
title: "Klipper: Installation (mit Octoprint) auf dem Anycubic Mega S (Trigorilla Board 1.0)"
date: 2021-05-14 18:00:00 +0200
categories: ["3D-Printing", "klipper"]
---
Kurze Anleitung wie man Klipper auf den Anycubic Mega S mit einem Trigorilla Board 1.0 installiert/flasht. Hierfuer wird ein Raspberry PI mit [Octoprint](https://octoprint.org/download/) vorinstalliert benoetigt. **Raspberry PI muss mit dem Board per USB verbunden sein...**

## Klipper auf dem Raspberry PI installieren & Firmware auf das Trigorilla Board flashen
0. Mit dem Raspberry PI per SSH verbinden
1. System updaten (immer gut!) `sudo apt-get update` & `sudo apt-get upgrade`
2. Klipper-Projekt von Github klonen `git clone git@github.com:KevinOConnor/klipper.git`
3. Ins Klipper verzeichnis wechseln und das Installations-Skript ausfuehren `./scripts/install-octopi.sh`
4. Firmware-Build mit `make menuconfig` konfigurieren. Das Trigorilla-Board nutzt einen Atmega 2560 Chip mit 16Mhz, also
    - `Micro-controller Architecture: Atmega AVR`
    - `Processor model: atmega 2560`
    - `Processor speed: 16Mhz`
    - `Baudrate for serial port: 250000`
    - mit `Q` beenden
5. Mit `make` die Firmware bauen (sollte sich anschliessend unter `~/klipper/out/klipper.elf.hex` befinden)
6. Firmware mit [scp](https://de.wikipedia.org/wiki/Secure_Copy) auf den eigenen Rechner kopieren bspw. `scp pi@XXX.XXX.XXX.XXX:~/klipper/out/klipper.elf.hex ~/klipper.elf.hex`
7. Auf der Octoprint-Oberflaeche muss nun das Plugin [Firmware Updater](https://github.com/OctoPrint/OctoPrint-FirmwareUpdater/blob/master/README.md) installiert werden.
8. Firmware auf das Trigorilla Board flashen: `Octoprint` -> `Settings` -> `Firmware Updater` -> richtigen Serial-Port auswaehlen (`/dev/ttyUSBX`) -> zuvor kopierte Datei (`klipper.elf.hex`) auswaehlen -> `Flash from file` druecken -> es sollte eine Erfolgsmeldung kommen
9. Nun installiere das Plugin [OctoKlipper](https://plugins.octoprint.org/plugins/klipper/) in Octoprint. Nach der Installation muss Octoprint neugestartet werden. Probiert man sich nun mit dem Drucker per Octoprint zu verbinden, kommt eine Fehlermeldung das die `printer.cfg` nicht vorhanden ist.
10. Klipper speichert die Drucker-Konfiguration in einer einfachen Text-Datei; Es ist schon eine vorgefertigte Datei fuer den Anycubic i3 Mega im `config/`-Ordner vorhanden:
    - wieder per SSH auf den Raspberry
    - `cd ~/klipper`
    - `cp config/printer-anycubic-i3-mega-2017.cfg printer.cfg`
    - in der Config-Datei muss noch der richtige Serial der MCU eingestellt werden. `ls /dev/serial/by-id` zeigt alle Geraete an. Dort sollte in `USB_to_UART`-Controller angezeigt werden. In meinem Fall `usb-Silicon_Labs_CP2102_USB_to_UART_Bridge_Controller_0001-if00-port0@`. Demnach wird in der `printer.cfg` mit VIM oder nano der Parameter `[mcu]`-`serial` auf `/dev/serial/by-id/usb-Silicon_Labs_CP2102_USB_to_UART_Bridge_Controller_0001-if00-port0` (ohne das `@`) geaendert.
    - desweiteren ist in der Config die `rotation_distance` vom Extruder total falsch. Ohne Anpassung hat der Extruder bei 100mm nur ca. 15mm extrudiert. Deswegen wurde folgende Anpassung vorgenommen: `rotation_distance: 7.808`
11. Mit dem Drucker verbinden
12. Im Klipper-Tab mit `Restart`->`Host` den Klipper-Host neustarten (Hierbei wird ebenfalls die Konfiguration neu geladen).
13. Die Funktion `Get Status` sollte nun `Klipper state: Ready` ausgeben.
14. Startet den Drucker einmal neu, nach einem Host-Neustart sollte die Funktion `Get Status` wieder `Klipper state: Ready` ausgeben.
15. XY-Achse homen
16. Z-Achse homen **(direkt zum Drucker und ueberpruefen ob die Endstops funktionieren indem beide Endstops per Hand gedrueckt werden)**

## Start- und End-GCode definieren
Es ist ebenfalls sinnvoll einen Start- und Ende-GCode zu definieren. Hier werden die Schritte vor und nach dem Druck definiert. Der Vorteil hieran ist, dass Slicer-Uebergreifend Einstellungen definiert werden koennen und somit auch Einstellungen gaendert werden koennen, ohne das ein Modell neu geslict werden muss. Folgende Einstellung habe ich definiert (einfach am Ende der `printer.cfg` einfuegen):
```
[gcode_macro START_PRINT]
gcode:
    {% set BED_TEMP = params.BED_TEMP|default(85)|float %}
    {% set EXTRUDER_TEMP = params.EXTRUDER_TEMP|default(250)|float %}
    # Start bed heating
    M140 S{BED_TEMP}
    # Use absolute coordinates
    G90
    # Wait for bed to reach temperature
    M190 S{BED_TEMP}
    # Set and wait for nozzle to reach temperature
    M109 S{EXTRUDER_TEMP}
    # Home the printer
    G28
    # Set speed to 1200mm/min
    G1 F1200.0
    # Move to 5,1
    G1 X10 Y1 Z0.2
    # Prime hotend
    G1 X100 E20
    # Reset extruder position
    G92 E0.0
    # Move Y to 2
    G1 Y2
    # Prime the hotend
    G1 X10 E20
    # Reset extruder position
    G92 E0.0
    # Set speed to travel speed
    G1 F{speed_travel}

[gcode_macro END_PRINT]
gcode:
    # Turn off bed, extruder, and fan
    M140 S0
    M104 S0
    M106 S0
    # Move nozzle away from print while retracting
    G91
    G1 X-2 Y-2 E-3 F300
    # Raise nozzle by 10mm
    G1 Z10 F3000
    G90
    # Disable steppers
    M84
```

Im Slice muss jetzt nur noch als Start-GCode `START_PRINT` und als End-GCode `END_PRINT` gesetzt werden.

Fertig.