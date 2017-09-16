# Echt Client

[![CircleCI](https://circleci.com/gh/bnolan/echt-client.svg?style=svg&circle-token=c21a0d12bacd0d145ec76336424d901e163d7123)](https://circleci.com/gh/bnolan/echt-client)


Selfie app with face recognition.
Relies on https://github.com/bnolan/echt-server

## Installation

Globally install [react-native](https://facebook.github.io/react-native/docs/getting-started.html).

Run `yarn`

## Development

### Simulator Use

Use `yarn run ios` to build for iOS and run in simulator.
The simulator will automatically used the bundle served at `localhost` by the process.
Adjust the server address in the `jsCodeLocation` variable in `ios/AppDelegate.m`
if you want to run a different server.

### Fixtures

Given the signup steps involved, it's hard to recreate an exact state
to reach a particular view (e.g. having two users signed for for an "add friends" dialog).
You can define fixtures in `state/fixtures.js`.
They are activated through the `fixtures` key in `config.js`,
mapping to keys in the `state/fixtures.js` exports.

Example: Loads `state/fixtures/add-friend.js`.

```json
{
  "fixtures": "addFriend"
}
```

Note that the fixtures are tied to the UAT stage,
since they reference image assets in S3.
Fixtures only last for the current "session",
and aren't persisted in the local device store.
They'll prevent network access, so things will get weird
if you try to actually use the app with fixtures - they're mostly geared
for design iterations rather than end-to-end shortcuts.

### Deploy to device

To run the app on a phone in debug mode, you need to open `ios/Echt.xcodeproj`
in XCode, attach a device to your machine, and do a build for that device.
When using the app on a phone, the bundle is served from [CodePush](https://microsoft.github.io/code-push/).

At the moment, you need to adjust the `Build Setting > Development Team` assignments in XCode to get
the app building (it's hardcoded to Ben's).

  LC_ALL=C find ios/Echt.xcodeproj/* -type f -exec sed -i "" "s/DWB7DKRZ7D/Y9AF3JTNBU/g" {} \;
  LC_ALL=C find ios/Echt.xcodeproj/* -type f -exec sed -i "" "s/io.echt.Echt/io.echt.Ingo/g" {} \;

### Running a local endpoint

By default, API calls will be made to the configured AWS API Gateway.
You can adjust this in `config.js`, and run a local server through
`yarn run server` in the [echt-server](https://github.com/bnolan/echt-server) repo.

## Release

### App bundles

This is the actual app that gets submitted to the app stores (iOS only at the moment).

TODO Describe process

### JavaScript bundles

The application logic lives in JavaScript, and can be released
separately from the app bundle through [CodePush](https://microsoft.github.io/code-push/).
You'll need to be added to the CodePush project as a collaborator first.

Call `yarn run release-uat` and `yarn run release-prod`.
This will upload the currently built bundle to the CodePush service.
Since the app is configured to check for a bundle on each resume,
the code should be available seconds after publishing.

You can check CodePush update behaviour by running it in [debug mode](https://microsoft.github.io/code-push/docs/cli.html#link-5).
This only works on the iOS simulator at the moment.
There's no known way to determine update behaviour on a device.

## Debugging

The app uses local storage on the device/simulator, e.g. to
remember the current user between reloads. In order to reset store
data, you need to open the debugger, switch to the `debuggerWorker.js` process,
and call `__store.clear()`
([instructions](https://corbt.com/posts/2015/12/19/debugging-with-global-variables-in-react-native.html)).
