#!/bin/bash

echo "------ Running r.js optimizer on Javascript files ------"
r.js -o build.js
echo "------ Finish r.js optimizer on Javascript files ------"

echo "------ Running r.js optimizer on CSS files ------"
r.js -o cssIn=../css/layout.css out=../css/layout.min.css optimizeCss=standard
echo "------ Finish r.js optimizer on CSS files ------"

echo "------ Finish Build ------"