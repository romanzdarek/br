CD /D %~dp0
cd client
call deploy.bat
echo.
cd ..
cd server
call deploy.bat