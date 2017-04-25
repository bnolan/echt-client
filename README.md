# Echt Client

Selfie app with face recognition.
Relies on https://github.com/bnolan/echt-server

## Installation

Globally install [react-native](https://facebook.github.io/react-native/docs/getting-started.html).

Run `yarn`

## Usage

 * `yarn run ios`: Build for iOS and run in simulator

Adjust the server address in the `jsCodeLocation` variable in `ios/AppDelegate.m`
if you want to run a local development server, rather than serving the JavaScript bundle from S3.
Note that by default it's using [CodePush]

At the moment, you need to adjust the `Build Setting > Development Team` assignments in XCode to get
the app building (it's hardcoded to Ben's).

  LC_ALL=C find ios/Echt.xcodeproj/* -type f -exec sed -i "" "s/DWB7DKRZ7D/Y9AF3JTNBU/g" {} \;
  LC_ALL=C find ios/Echt/AppDelegate.m -type f -exec sed -i "" "s/10.0.0.136/192.168.1.14/g" {} \;
