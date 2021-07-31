---
layout: post
title: "Raspberry PI 4 in Anycubic i3 Mega einbauen"
date: 2021-07-31 17:00:00 +0200
categories: ["3D-Printing"]
---
Kurze Anleitung wie man ein Raspberry Pi 4 via UART mit dem SKR 1.4 Turbo verbindet und anschliessend ueber das Anycubic Netzteil mithilfe eines LM2596 StepDownConverter mit Strom versorgt wird.

## Kommunikation zwischen Raspberry PI und SKR 1.4 per UART
1. Zunaechst wird der Raspberry PI auf die UART Kommunikation vorbereitet. Hierfuer muss in der `/boot/config.txt` folgende Zeile hinzugefuegt werden:
    ```
    dtoverlay=pi3-miniuart-bt
    ```
2. Anschliessend wird die `/boot/cmdline.txt` des Raspberry PIs angepasst. Hierbei muss die serielle Konsolenausgabe zur Frequenz `115200` entfernt werden. Also `console=serial0,115200` aus der `/boot/cmdline.txt` loeschen und speichern.
3. Klippers `pinter.cfg` muss auf den seriellen Eingang umgeschaltet werden. Hierfuer muss der `[mcu]`-Block der `printer.cfg` wie folgt angepasst werden:
    ```
    [mcu]
    serial: /dev/ttyAMA0
    restart_method: command
    ```
4. Verkabelung vom Raspberry PI zum SKR 1.4:
    ![SKR_14_RASPBERRY_PI_UART_CONNECT](/assets/images/2021-07-31_SKR1_4-Raspberry-PI-UART-Connection.png)


## Stromversorgung des Raspberry PI mit einem LM2596 StepDown Converter
tbd.

## Raspberry PI in Anycubic Gehaeuse verbauen
tbd.
- ![Raspberry PI & SKR1.4 Adapter](/assets/images/2021-07-31_I3_MEGA_S_SKR1_4_MOUNT.png)
- [SKR 1.4 & Raspberry PI Adapter (thingiverse.com/thing:4919461)](https://www.thingiverse.com/thing:4919461)

Fertig.