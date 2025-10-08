![React Native](other/banner.png)

# Open Wise TimeTable
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
![Expo](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/MrDog210/Open-WTimeTable?style=for-the-badge)
![GitHub Repo stars](https://img.shields.io/github/stars/MrDog210/Open-WTimeTable?style=for-the-badge)


This is a mobile app made with react native and expo, to view data from Wise TimeTable. It supports all Wise faculties which provide a school code. Android users can install the app from app store. Due to Apple app store requirements, I am currently unable to publish it to ios app store. [There is a web version available with similar features available here.](https://mrdog210.github.io/Open-WTimeTable-Web/)

[![Get it on play store](other/play-store.svg)](https://play.google.com/store/apps/details?id=com.mrdog210.OpenWTimeTable2)

|                               |                               |                               |                               |                               |                               |
|-------------------------------|-------------------------------|-------------------------------|-------------------------------|-------------------------------|-------------------------------|
| ![](other/preview/image1.png) | ![](other/preview/image2.png) | ![](other/preview/image3.png) | ![](other/preview/image4.png) | ![](other/preview/image5.png) | ![](other/preview/image6.png) |
## Features:
Main advantage of this app over the official one is, that you can pick a separate group for each course.
- Separate selectable groups for each course
- Select lectures from multiple years and groups
- Add and edit custom lectures
- Dynamic dark/light mode
- Tablet support
- Add custom notes to lectures
- Widget support on android
- Supports every Wise TimeTable faculty with a provided school code

## Setup instructions

1. Clone the repo
2. run  ``` npm install ```
3. Duplicate ```example.env``` and rename it to ```.env``` in the root folder and enter your credentials
4. Build a dev client and install it on your device ```eas build --profile development --platform android --local```
5. ``` npx expo start ```

