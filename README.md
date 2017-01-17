# Jankyns

Jankyns is a docker image builder. Set up webhooks or other services to make
calls to Jankyns with repository information and Jankyns will schedule an image
build and push the image to a docker registry.

### Usage

Jankyns runs as a docker container and is configured with environment variables.
The available envvars are:

##### `ENVS`

A JSON string that represents the different build environments and essentially
authenticates a build. Build environments can be though of as templates for
builds as they are simply merged with incoming build options. You can put as
much or as little information in a build environment, but keep in mind all
builds for a given environment will have access to the information in that
environment.

```js
JSON.stringify({
  '<envId = random unguessable key>': {
    provider: 'github',
    githubToken: 'xxx',
    slackUrl: 'https://...',
    registryConfig: {
      'quay.io': {
        username: '$oauthtoken',
        password: 'xxx'
      }
    },
    variables: {
      NPM_TOKEN: 'xxx'
    }
  },
  '<envId = another random unguessable key>': {
    provider: 'vsts',
    vstsToken: 'xxx',
    registryConfig: {
      'https://registry.docker.io/v1/': {
        username: 'xxx',
        password: 'xxx'
      }
    },
    variables: {
      FOO_BAR: 'baz'
    }
  }
})
```

All of this information *can* be passed in the build request, but providing
environments allows credentials to be stored in a single spot and reused by
sharing an `envId`. In the example above, you might use the first environment to
handle GitHub webhooks, publish updates to slack, and push images to quay.io.
The second environment could be used for VSTS builds and push to the official
docker registry.

`envId`s (the keys in the object above) should be kept secret. Jankyns will only
build if a valid `envId` is provided in the build request.

##### `DOCKER_(HOST|POST|PROTOCOL|SOCKET_PATH|CA|CERT|KEY)`

Self-explanatory docker options to point Jankyns to the docker host that will be
doing the actual building. See `src/config.js` for more information.

##### `MAX_CONCURRENT_BUILDS`

The maximum number of simultaneous builds that Jankyns will send to the docker
host. Defaults to the number of cores on the machine Jankyns is running on.

##### `PUBLIC_URL`

The URL that Jankyns is exposed at. This URL will be used to generate links to
build status pages in build notifications.

##### `STORAGE_PROVIDER` (**TODO**)

Support for out-of-memory build info storage is a WIP.

### API

##### `POST /webhook/:envId`

Start a job from a webhook with a given environment. The body of the webhook
will be transformed into the correct build options by the provider code.

##### `POST /builds`

Create a new build from a request body. This endpoint expects an
`application/json` body with all of the build information the given provider
requires (except for what is already provided with by the `envId` environment). For example

```json
{
  "envId": "random unguessable key from above",
  "owner": "orgsync",
  "repo": "jankyns",
  "ref": "master"
}
```

Because the environment I've selected contains the rest of the necessary build
information, all I need to pass in this case is an `owner`, `repo`, and commit
`ref`.

##### `GET /builds/:buildId`

Show the output for a given build.
