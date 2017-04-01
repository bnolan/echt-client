# Echt

Selfie app with face recognition.

## Server

### Installation

In the `server/` folder, run `yarn`

### Usage

You'll need to [configure AWS access credentials](https://claudiajs.com/tutorials/installing.html). In case you're not using the default profile,
remember to set the `AWS_PROFILE` environment variable accordingly.

 * `yarn run start`: Initialise the app (not required in an existing AWS setup)
 * `yarn run release-dev`: Deploys the current code to dev
 * `yarn run test`: Run all tests (interacts with AWS resources). You can run your own "stage" via `yarn run test -- --stage=<my-stage>` for integration tests.
 * `yarn run test`: Run unit tests
 * `yarn run logs`: View Lambda logs

### Adding policies

If you need to add a policy to the lambda:

    cd policies
    aws iam put-role-policy --role-name test-executor --policy-name access-dynamodb --policy-document file://access-dynamodb.json

To update:

    cd policies
    aws iam update-assume-role-policy --role-name test-executor --policy-name access-dynamodb --policy-document file://access-dynamodb.json

## Client

### Installation

Globally install [react-native](https://facebook.github.io/react-native/docs/getting-started.html).

In the `Echt/` folder, run `yarn`

### Usage

 * `react-native run-ios`: Build for iOS and run in simulator

Adjust the server address in the `jsCodeLocation` variable in `ios/AppDelegate.m`
if you want to run a local development server, rather than serving the JavaScript bundle from S3.

At the moment, you need to adjust the `Build Setting > Development Team` assignments in XCode to get
the app building (it's hardcoded to Ben's).
