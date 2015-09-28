<?php
print "idm:"; 
for ($k=0;$k<16;$k=$k+4) { 
print substr($_GET['idm'],$k,4)."-"; 
} 
print "<br>edy:"; 
for ($k=4;$k<20;$k=$k+4) { 
print substr($_GET["edy"],$k,4)."-"; 
} 

?>
