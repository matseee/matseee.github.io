---
layout: post
title: "Machine Learning"
date: 2021-10-12 00:00:00 +0200
categories: ["Machine-Learning"]
---
Diese Kategorie widmet sich dem Thema der schwachen künstlichen Intelligenz, welche schon in unseren täglichen Alltag gefunden hat.
Es hat mich schon immer interessiert, wie man es hinbekommen kann dass Machinen lernen.
Die Relität ist, dass Machinen lange noch nicht über die kogintiven Fähigkeiten eines Menschens verfügen, aber nichts desto trotz sehr schwierige Probleme lösen können.

Ich bin jetzt aktuell dabei mich in die Thematik einzuarbeiten und möchte hier mein gesammeltes Wissen verewigen.

{% for post in site.categories.Machine-Learning %}
{% if post.title == "Machine Learning" %}
{% else %}
1. [{{ post.title }}]({{ post.url }})
{% endif %}
{% endfor %}

To be continued ...