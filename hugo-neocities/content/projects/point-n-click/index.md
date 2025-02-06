---
title: "Point N Click"
date: 2024-10-17T18:00:17-04:00
draft: true
---
{{< rawhtml >}}
<!-- ─│┌┐└┘├┤┬┴┼▲▼►◄╋┃━ -->
<span id="game-container">
    <p id="game-text">
        This is where game text will go. Exciting!
    </p>
    <code id="minimap"><span id="minimap-text"></span>
        <span id="screen-text"></span>
                                              <a id="nav-up" href="#">N</a>
                                              ▲
                                              ┃
                                          <a  id="nav-left" href="#">W</a>◄━━╋━━►<a  id="nav-right" href="#">E</a>
                                              ┃
                                              ▼
                                              <a  id="nav-down" href="#">S</a>
    </code>
</span>

<link rel="stylesheet" href="/point-n-click-data/style.css">
{{</ rawhtml >}}

{{< js-build >}}
