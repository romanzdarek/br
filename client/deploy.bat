echo FE deploy started...
echo .
call npm run build
:: make zip file
tar.exe -C dist -a -cvf static.zip .
ssh ubuntu@130.61.169.112 "rm -r /www/mbr/static; mkdir /www/mbr/static"
scp ./static.zip ubuntu@130.61.169.112:/www/mbr
ssh ubuntu@130.61.169.112 "unzip /www/mbr/static.zip -d /www/mbr/static; rm /www/mbr/static.zip"
:: ssh ubuntu@130.61.169.112 "rm -r /www/mbr/static; mkdir /www/mbr/static"
ssh ubuntu@130.61.169.112 mv /www/mbr/static/js/service-worker.js /www/mbr/static/service-worker.js
del static.zip
echo .
echo FE deploy finished. 
