echo FE deploy started...
echo.
call npm run build
ssh ubuntu@130.61.169.112 "rm -r /www/mbr/static; mkdir /www/mbr/static"
scp -r ./dist/* ubuntu@130.61.169.112:/www/mbr/static
echo.
echo FE deploy finished. 