echo.
echo BE deploy started...
echo.
call npm run build
ssh ubuntu@130.61.169.112 "pm2 stop mbr; rm -r /www/mbr/dist; mkdir /www/mbr/dist"
scp -r ./dist/* ubuntu@130.61.169.112:/www/mbr/dist
scp ./package.json ubuntu@130.61.169.112:/www/mbr
scp ./package-lock.json ubuntu@130.61.169.112:/www/mbr
ssh ubuntu@130.61.169.112 "cd /www/mbr; npm i; pm2 start mbr"
echo.
echo BE deploy finished.
echo.
pause
	