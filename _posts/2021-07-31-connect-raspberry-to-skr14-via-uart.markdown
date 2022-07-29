---
layout: post
title: "Raspberry PI 4 in Anycubic i3 Mega einbauen"
date: 2021-07-31 17:00:00 +0200
categories: ["3D-Printing"]
---
Kurze Anleitung wie man ein Raspberry Pi 4 via UART mit dem SKR 1.4 Turbo verbindet und anschliessend ueber das Anycubic Netzteil mithilfe eines LM2596 StepDownConverter mit Strom versorgt wird.

## Kommunikation zwischen Raspberry PI und SKR 1.4 per UART
1. Zunaechst wird der Raspberry PI auf die UART Kommunikation vorbereitet. Hierfuer muss in der `/boot/config.txt` folgende Zeile hinzugefuegt werden:
    ```conf
    dtoverlay=pi3-miniuart-bt
    ```
2. Anschliessend wird die `/boot/cmdline.txt` des Raspberry PIs angepasst. Hierbei muss die serielle Konsolenausgabe zur Frequenz `115200` entfernt werden. Also `console=serial0,115200` aus der `/boot/cmdline.txt` loeschen und speichern.
3. Klippers `printer.cfg` muss auf den seriellen Eingang umgeschaltet werden. Hierfuer muss der `[mcu]`-Block der `printer.cfg` wie folgt angepasst werden:
    ```conf
    [mcu]
    serial: /dev/ttyAMA0
    baud: 250000
    restart_method: command
    ```
4. Verkabelung vom Raspberry PI zum SKR 1.4:
    ![SKR_14_RASPBERRY_PI_UART_CONNECT](/assets/images/2021-07-31_SKR1_4-Raspberry-PI-UART-Connection.png)

5. Fuer das SKR 1.4 muss die Firmware neukompeliert werden, da sich die serielle Steuerung geaendert hat. Hierfuer wird `make menuconfig` wie folgt konfiguriert und anschliessend auf das SKR 1.4 uebertragen.
    ```
    [*] Enable extra low-level configuration options
        Micro-controller Architecture (LPC176x (Smoothieboard))  --->
        Processor model (lpc1769 (120 MHz))  --->
    [*] Target board uses Smoothieware bootloader
    [ ] Use USB for communication (instead of serial)
    (250000) Baud rate for serial port
    [ ] Specify a custom step pulse duration
    ()  GPIO pins to set at micro-controller startup
    ```


## Stromversorgung des Raspberry PI mit einem LM2596 StepDown Converter
Der Raspberry PI kann per StepDown-Converter direkt an einen 12V Anschluss des Anycubic Netzteils angeschlossen werden.

1. Hierfuer wird zunaechst ein Kabel (+5V / GND) an den Power-In Anschluss des Raspberry PIs geloetet. GND wird an TP12 und +5V an TP1 geloetet:
   ![Raspberry_PI_LOETSTELLE](/assets/images/2021-08-01_pi-powerin.png) 
2. Anschliessend wird ein 12V Ausgang an den LM2596 angeschlossen, dieser per Stellschraube auf eine Ausgangsspannung von 5V eingestellt und der Ausgang mit dem Raspberry PI verbunden. Die folgende Grafik zeigt die Verbindung:
   ![Raspberry_PI_POWERCOMPLETE](/assets/images/2021-08-01_pi-power-complete.png)

## Raspberry PI in Anycubic Gehaeuse verbauen
Der Raspberry PI sowie das SKR 1.4 wurde mittels einem [SKR 1.4 & Raspberry PI Adapter (thingiverse.com/thing:4919461)](https://www.thingiverse.com/thing:4919461) im Gehaeuse des Anycubics eingebaut. Die Nachfolgende Grafik veranschaulicht den Aufbau. Hierbei sollte dieser eigtl. noch einmal angepasst werden, da fuer die SD Karte des SKR1.4 kein Platz mehr bleibt sowie keine Halterung fuer einen Luefter vorhanden ist.
    ![Raspberry PI & SKR1.4 Adapter](/assets/images/2021-07-31_I3_MEGA_S_SKR1_4_MOUNT.png)

Fertig.
