---
layout: post
title:  "Klipper Installation (mit Octoprint) auf dem Anycubic Mega S (Trigorilla Board 1.0)"
date:   2021-05-14 18:00:00 +0200
categories: 3D-Printing
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
    - in der Config-Datei muss noch der richtige Serial der MCU eingestellt werden. `ls /dev` zeigt alle Geraete an, da nur ein USB-Geraet angeschlossen ist, kann einfach dieses Geraet gewaehlt werden. In meinem Fall `ttyUSB1`. Demnach wird in der `printer.cfg` mit VIM oder nano der Parameter `[mcu]`-`serial` auf `/dev/ttyUSB1` geaendert.
11. Mit dem Drucker verbinden
12. Im Klipper-Tab mit `Restart`->`Host` den Klipper-Host neustarten (Hierbei wird ebenfalls die Konfiguration neu geladen).
13. Die Funktion `Get Status` sollte nun `Klipper state: Ready` ausgeben.
14. XY-Achse homen
15. Z-Achse homen **(direkt zum Drucker und ueberpruefen ob die Endstops funktionieren indem beide Endstops per Hand gedrueckt werden)**

Fertig.