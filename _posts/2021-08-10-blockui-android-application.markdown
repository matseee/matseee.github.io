---
layout: post
title: "BlockUI"
date: 2021-08-11 02:00:00 +0200
categories: ["Project"]
---
Ich hoere gerne Dokumentationen oder Podcasts auf Youtube ueber mein Android Smartphone. Ueberlicherweise trage ich dabei Kopfhoerer und beschaeftige mich dabei mit etwas anderem. Wenn ich beispielsweise die Waesche mache, befindet sich mein Smartphone in der Hosentasche und dabei kommt es oefter vor, dass meine Bewegungen das Touchdisplay des Handys beruehren und ein anderes Video startet. Nachdem mir dies einige Male passiert ist, habe ich nach einer App gesucht, welche die Toucheingaben sperrt. Ich habe auch eine funktionierende App gefunden, jedoch war diese mit Werbung ueberladen. Aus diesem Grund habe ich mich entschieden eine eigene App zu entwickeln. Im folgenden will ich das Grundprinzip der [BlockUI](https://github.com/matseee/block-ui) App erlaeutern. 

### Grundlegeneder Aufbau
![Block-UI Overview](/assets/images/2021-08-11_blockui_overview.png)

#### MainActivity
Die MainActivity der Anwendung ueberpruft ob BlockUI die Berechtigung zum Rendern ueber anderen Apps besitzt, ansonsten wird ein Dialog mit Aufforderung zur Setzung der Berechtigung erstellt. Dieser Dialog verzweigt direkt zur entsprechenden Einstellung. Mit dem folgenden zwei Zeilen kann die Einstellungs-App des Androidsystems gestartet werden.

{% highlight kotlin %}
val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))
startActivityForResult(intent, Activity.RESULT_OK)
{% endhighlight %}

Nachdem die App wieder im Vordergrund ist, wird erneut eine Berechtigungspruefung durchgefuehrt. Faellt die Pruefung positiv aus, wird der `NotificationService` gestartet.

#### NotificationService
Der `NotificationService` erstellt eine Notification in der Android Statusbar. Ueber diese Notification kann der `OverlayService` gestartet werden, welcher die Touch-Eingaben des Smartphones blockiert.

Um die Notification zu erstellen, muss zunaechst ein Notification-Channel und anschliessend die Notification selber erstellt werden. Zuletzt wird die Notification per `startForeground()` gestartet. Folgender Quellcode erstellt einen Channel, eine Notificaiton und startet diese:


{% highlight kotlin %}
// Erstellung des Notification-Channels
val channel = NotificationChannel(getString(R.string.channel_id),
        "BLOCKUI Notification Channel",
        NotificationManager.IMPORTANCE_DEFAULT)
(getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(channel)

// onClick-Intent. Wird gestartet wenn die Notification geclickt wird.
val notificationIntent = Intent(this, BlockUIService::class.java)
val pendingIntent = PendingIntent.getService(this, 0, notificationIntent, 0)

// Erstellung der Notification
//  -- Channel-ID muss mit der Channel-ID von oben uebereinstimmen
val notification = NotificationCompat.Builder(this, getString(R.string.channel_id))
        .setContentTitle(getString(R.string.app_name))
        .setContentText(getString(R.string.app_desc))
        .setSmallIcon(R.drawable.ic_launcher_foreground)
        .setContentIntent(pendingIntent)
        .build()

startForeground(101, notification)
{% endhighlight %}

Damit ein Vordergrund-Service gestartet werden kann, muessen folgende Berechtigungen in der `AndroidManifest.xml` hinzuegefuegt werden:

{% highlight xml %}
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
{% endhighlight %}


#### BlockUIService
Dieser Service wird gestartet, sobald die Notification angeklickt wird. Im Grunde erstellt der Service eine Durchsichtige View ueber den gesamten Bildschirm und verhindert somit, dass die Touch-Eingaben die darunterliegende Anwendung erreicht. Damit die Anwendung ueber andere Anwendung rendern kann, muss die Berechtigung `Draw over other Apps` aktiviert sein und in der `AndroidManifest.xml` folgende Berechtigung enthalten sein:

{% highlight xml %}
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
{% endhighlight %}


Die View wird mithilfe des [`WindowManager`](https://developer.android.com/reference/android/view/WindowManager?hl=en) erstellt und ueber die andere App gezeichnet. Der Code zur Erstellung der View sieht wie folgt aus:

{% highlight kotlin %}
// WindowManager ermitteln
windowManager =
    applicationContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager?

// View-Layout Parameter fuer die Renderung vorbereiten
val layoutParams =
        WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
                WindowManager.LayoutParams.FLAG_FULLSCREEN and WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                PixelFormat.TRANSLUCENT
        )

layoutParams.gravity = Gravity.TOP or Gravity.RIGHT
layoutParams.x = 0
layoutParams.y = 0

// Layout laden und auspacken
val inflater =
        baseContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
viewOverlay = inflater.inflate(R.layout.overlay, null)

// ...
// Button-Handler usw.
// ...

// Rendern der View
windowManager!!.addView(viewOverlay, layoutParams)
{% endhighlight %}


Die View enthaelt standardmaesig ausschliessend ein `Unlock`-Button, welcher eine Nummer-Feld oeffnet. Per Eingabe des generierten und dargestellten 4-stelligen Pins wird die View wieder geloescht. 
