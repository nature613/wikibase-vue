# vue-template-service

(Note that the service name is currently misleading and subject to change. It
was initially a spike to create a generic vue template rendering service, but
then turned into a demo of completely decoupling the view layer from the
mediawiki stack)

## Motivation / Design Principles

- Increase cohesion: Change to a view only needs to touch a single JS file
- Reduce coupling: All dependencies on the mediawiki stack, such as l10n, are
  exposed via APIs.
- Modernize infrastructure: This introduces a build step, which allows us to
  write ES2017 instead of ES5 without losing browser compatibility (this will
  need some polyfilling and integration tests which are out of scope for the
  spike).
- Reduce development feedback cycle and developer experience: By testing in
  isolation and using modern development features like hot reladoing, we reduce
  cycle times both locally and in the continuous integration phase.
- Move towards continuous deployment: Decoupling the service will make it much
  easier to move towards adopting continuous deployment practices and deliver
  value faster.
- Remove accidental complication: We are aiming to break volatile dependencies,
  ban all global objects and remove unnecessary layers of custom abstractions
  such as the resource loader aliases, which already broke standard JS tooling
  and created hard to debug errors during this spike.
- Decrease setup cost: The Frontend can be used without a running mediawiki. The
  current spike only assumes a recent node.js installation.
- Improve Inclusivity: Moving towards are more modern stack means developers can
  contribute to the project without learning about PHP or the mediawiki stack.

## Run dev

`docker build -t vue-server .`

`docker run -p 3000:3000 -v $(pwd):/usr/src/app vue-server`
