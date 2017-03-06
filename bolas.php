<?php
  $bombo = $_REQUEST["numeros"];
  $nbolas = count($bombo);
  $bola = rand(0,$nbolas-1);
  echo $bola;
?>