# Echt

Selfie app with face recognition.

## Server

### Installation

In the `server/` folder, run `yarn`

### Tasks

You'll need to [configure AWS access credentials](https://claudiajs.com/tutorials/installing.html). In case you're not using the default profile,
remember to set the `AWS_PROFILE` environment variable accordingly.

 * `yarn run deploy`: Deploy the current code to UAT
 * `yarn run release`: Promote the current code to Production (does not deploy current code)

### Adding policies

If you need to add a policy to the lambda:

    cd policies
    aws iam put-role-policy --role-name test-executor --policy-name access-dynamodb --policy-document file://access-dynamodb.json

To update:

    cd policies
    aws iam update-assume-role-policy --role-name test-executor --policy-name access-dynamodb --policy-document file://access-dynamodb.json
