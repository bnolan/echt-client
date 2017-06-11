# Echt Client

[![CircleCI](https://circleci.com/gh/bnolan/echt-client.svg?style=svg&circle-token=c21a0d12bacd0d145ec76336424d901e163d7123)](https://circleci.com/gh/bnolan/echt-client)


Selfie app with face recognition.
Relies on https://github.com/bnolan/echt-server

## Installation

Globally install [react-native](https://facebook.github.io/react-native/docs/getting-started.html).

Run `yarn`

## Usage

 * `yarn run ios`: Build for iOS and run in simulator

Adjust the server address in the `jsCodeLocation` variable in `ios/AppDelegate.m`
if you want to run a local development server, rather than serving the JavaScript bundle from S3.
Note that by default it's using [CodePush](https://microsoft.github.io/code-push/)
when the app is bundled for a device, and `localhost` when running in a simulator.
This assumes that you run `yarn run server` in the [echt-server](https://github.com/bnolan/echt-server) repo locally.

At the moment, you need to adjust the `Build Setting > Development Team` assignments in XCode to get
the app building (it's hardcoded to Ben's).

  LC_ALL=C find ios/Echt.xcodeproj/* -type f -exec sed -i "" "s/DWB7DKRZ7D/Y9AF3JTNBU/g" {} \;

## Debugging

The app uses local storage on the device/simulator, e.g. to
remember the current user between reloads. In order to reset store
data, you need to open the debugger, switch to the `debuggerWorker.js` process,
and call `__store.clear()`
([instructions](https://corbt.com/posts/2015/12/19/debugging-with-global-variables-in-react-native.html)).
