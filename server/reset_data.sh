#!/bin/bash

rm db.sqlite3
rm -rf ./turtleapi/migrations
rm -rf ./media/*
cp -r ./turtleapi/fixtures/media/* ./media
python3 manage.py makemigrations turtleapi
python3 manage.py migrate
python3 manage.py loaddata users tokens ranks positions toppings custard_bases custards custard_toppings traits menu_items employees
