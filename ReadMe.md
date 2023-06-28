#To run app in dev mode: 
1. Connect phone to laptop with developer mode enabled.
2. Run `adb devices` to check name of device connected.
3. Run `adb -s <device name> reverse tcp:8081 tcp:8081` to connect ports of devices.
4. go to app within project and run `npm start` and then run android by pressing 'a'.

##Alternatively
1. Turn on developer mode on your phone and enable USB debugging or connect to the same WIFI as your computer.
2. Run `npm start` and `npx expo start` in simultaneous terminals.


####APK
https://medium.com/geekculture/react-native-generate-apk-debug-and-release-apk-4e9981a2ea51
