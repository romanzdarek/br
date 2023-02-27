echo .
echo BE deploy started...
echo .
call npm run build
:: make zip file
tar.exe -C dist -a -cvf dist.zip .
ssh ubuntu@130.61.169.112 "pm2 stop mbr; rm -r /www/mbr/dist; mkdir /www/mbr/dist"
:: scp -r ./dist/* ubuntu@130.61.169.112:/www/mbr/dist
scp ./dist.zip ubuntu@130.61.169.112:/www/mbr
scp ./package.json ubuntu@130.61.169.112:/www/mbr
scp ./package-lock.json ubuntu@130.61.169.112:/www/mbr
ssh ubuntu@130.61.169.112 "unzip /www/mbr/dist.zip -d /www/mbr/dist; rm /www/mbr/dist.zip; cd /www/mbr; npm i; pm2 start mbr"
del dist.zip
echo .
echo BE deploy finished.
echo .
pause
