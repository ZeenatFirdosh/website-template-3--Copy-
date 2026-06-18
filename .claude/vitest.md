### Build and Setup for Wasm-bindgen Non-Cyclic Example

Source: https://github.com/vitest-dev/vitest/blob/main/test/unit/src/wasm/wasm-bindgen-no-cyclic/README.md

These commands install project dependencies, build the wasm-bindgen example, and outline post-build steps for correct module resolution, including copying package files and configuring package.json.

```sh
npm i
npm run build
# then
# 1. copy `examples/hello_world/pkg` to this directory
# 2. add { "type": "module" } to `package.json`
#    (this will be automatically included after https://github.com/rustwasm/wasm-pack/pull/1061)
```

--------------------------------

### Example global setup file in Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/learn/setup-teardown.md

An example of a global setup file (`test/setup.js`) that extends the `expect` API with custom matchers. This code runs once before all test files.

```js
// This runs before every test file
import { expect } from 'vitest'
import { customMatchers } from './custom-matchers.js'

expect.extend(customMatchers)
```

--------------------------------

### Generate and Serve HTML Report UI (Example)

Source: https://github.com/vitest-dev/vitest/blob/main/packages/ui/CONTRIBUTING.md

An example demonstrating how to first generate an HTML report and then start the UI dev server to view and develop it from a specific directory.

```bash
pnpm -C packages/ui test:ui --reporter=html --run
HTML_REPORT_DIR="$PWD/packages/ui/html" pnpm -C packages/ui dev:client
```

--------------------------------

### Use beforeAll for Suite Setup in Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/hooks.md

This example uses `beforeAll` to set up mock data once before all tests in the suite begin.

```ts
import { beforeAll } from 'vitest'

beforeAll(async () => {
  await startMocking() // called once before all tests run
})
```

--------------------------------

### Define Global Setup and Teardown Functions (JavaScript)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/config/globalsetup.md

Illustrates two patterns for defining global setup and teardown: using named `export` functions or a `default` function that returns the teardown logic. The `setup` function receives the `project` object.

```js
export function setup(project) {
  console.log('setup')
}

export function teardown() {
  console.log('teardown')
}
```

```js
export default function setup(project) {
  console.log('setup')

  return function teardown() {
    console.log('teardown')
  }
}
```

--------------------------------

### Configure Multiple Browser Instances in Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/config/browser/instances.md

This example demonstrates how to define multiple browser setups within the `browser.instances` array, showing how individual instance configurations inherit options from the root `test.browser` configuration.

```typescript
export default defineConfig({
  test: {
    setupFile: ['./root-setup-file.js'],
    browser: {
      enabled: true,
      testerHtmlPath: './custom-path.html',
      instances: [
        {
          // will have both setup files: "root" and "browser"
          setupFile: ['./browser-setup-file.js'],
          // implicitly has "testerHtmlPath" from the root config // [!code warning]
          // testerHtmlPath: './custom-path.html', // [!code warning]
        },
      ],
    },
  },
})
```

--------------------------------

### Initialize Vitest Browser Mode

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/browser/index.md

Use the `vitest init browser` command for an easier setup, which installs required dependencies and creates browser configuration.

```npm
npx vitest init browser
```

```yarn
yarn exec vitest init browser
```

```pnpm
pnpx vitest init browser
```

```bun
bunx vitest init browser
```

--------------------------------

### Repeating Setup for Each Test with Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/learn/setup-teardown.md

Use beforeEach and afterEach to ensure each test starts with a clean, known state, preventing mutations from one test affecting subsequent tests.

```js
import { afterEach, beforeEach, expect, test } from 'vitest'

let items

beforeEach(() => {
  items = ['apple', 'banana', 'cherry']
})

afterEach(() => {
  items = []
})

test('items starts with 3 fruits', () => {
  expect(items).toHaveLength(3)
})

test('can add an item', () => {
  items.push('date')
  expect(items).toHaveLength(4)
  // afterEach will reset items for the next test,
  // so this mutation won't leak into other tests
})
```

--------------------------------

### One-Time Setup and Teardown for a Test File with Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/learn/setup-teardown.md

Use beforeAll and afterAll to perform expensive setup operations once before all tests in a file, and clean up once after all tests complete.

```js
import { afterAll, beforeAll, expect, test } from 'vitest'

let db

beforeAll(async () => {
  db = await connectToDatabase()
})

afterAll(async () => {
  await db.close()
})

test('can query users', async () => {
  const users = await db.query('SELECT * FROM users')
  expect(users.length).toBeGreaterThan(0)
})

test('can query products', async () => {
  const products = await db.query('SELECT * FROM products')
  expect(products.length).toBeGreaterThan(0)
})
```

--------------------------------

### Install Vitest Dependencies and Build Packages

Source: https://github.com/vitest-dev/vitest/blob/main/AGENTS.md

Commands to set up the Vitest development environment, including installing dependencies, building packages, and installing Playwright browsers for browser features.

```bash
pnpm install
```

```bash
pnpm build
```

```bash
npx playwright install --with-deps
```

--------------------------------

### Define Global Setup and Teardown in Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/lifecycle.md

The `setup` function runs once before all tests, and `teardown` runs once after all tests. Use `project.provide` to share data with tests.

```ts
export function setup(project) {
  // Runs once before all tests
  console.log('Global setup')

  // Share data with tests
  project.provide('apiUrl', 'http://localhost:3000')
}

export function teardown() {
  // Runs once after all tests
  console.log('Global teardown')
}
```

--------------------------------

### Use beforeEach for Test Setup in Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/hooks.md

This example demonstrates using `beforeEach` to clear mocks and add test data before each test execution.

```ts
import { beforeEach } from 'vitest'

beforeEach(async () => {
  // Clear mocks and add some testing data before each test run
  await stopMocking()
  await addUser({ name: 'John' })
})
```

--------------------------------

### Install OpenTelemetry Browser Packages

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/open-telemetry.md

Install the necessary OpenTelemetry SDK for web tracing and OTLP trace exporter for browser environments.

```shell
npm i @opentelemetry/sdk-trace-web @opentelemetry/exporter-trace-otlp-proto
```

--------------------------------

### Install @vitest/browser-preview Package

Source: https://github.com/vitest-dev/vitest/blob/main/packages/browser-preview/README.md

Install the browser preview package as a development dependency using npm, yarn, or pnpm.

```sh
npm install -D @vitest/browser-preview
```

```sh
yarn add -D @vitest/browser-preview
```

```sh
pnpm add -D @vitest/browser-preview
```

--------------------------------

### Configure HTTP Request Mocking with MSW in Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/mocking/requests.md

Use this setup in a Vitest setup file to mock HTTP GET requests. It initializes an MSW server, defines a handler for a specific endpoint, and manages server lifecycle (start, close, reset handlers) for test isolation.

```js
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  // ...
]

export const restHandlers = [
  http.get('https://rest-endpoint.example/path/to/posts', () => {
    return HttpResponse.json(posts)
  }),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
```

--------------------------------

### Install OpenTelemetry Node.js Packages

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/open-telemetry.md

Install the necessary OpenTelemetry SDK, auto-instrumentations, and OTLP trace exporter for Node.js environments.

```shell
npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-proto
```

--------------------------------

### Install Vitest Browser Preview Provider

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/browser/index.md

Manually install the `@vitest/browser-preview` package to use the `preview` provider for viewing how tests look in the browser.

```npm
npm install -D vitest @vitest/browser-preview
```

```yarn
yarn add -D vitest @vitest/browser-preview
```

```pnpm
pnpm add -D vitest @vitest/browser-preview
```

```bun
bun add -D vitest @vitest/browser-preview
```

--------------------------------

### Provide Data from Global Setup to Tests (TypeScript)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/config/globalsetup.md

Demonstrates how to pass serializable data from `globalSetup.ts` to test files. Use `project.provide` in the setup and `inject` from `vitest` in tests to access the provided context.

```ts
import { inject } from 'vitest'

inject('wsPort') === 3000
```

```ts
import type { TestProject } from 'vitest/node'

export default function setup(project: TestProject) {
  project.provide('wsPort', 3000)
}

declare module 'vitest' {
  export interface ProvidedContext {
    wsPort: number
  }
}
```

--------------------------------

### Start HTML Report UI Dev Server (Generic)

Source: https://github.com/vitest-dev/vitest/blob/main/packages/ui/CONTRIBUTING.md

Starts the UI development server for static HTML reports, requiring a path to the generated report directory.

```bash
HTML_REPORT_DIR=<path-to-html-report-dir> pnpm -C packages/ui dev:client
```

--------------------------------

### Accessing Extended Fixtures in Vitest `beforeAll` and `afterAll` Hooks

Source: https://github.com/vitest-dev/vitest/blob/main/docs/blog/vitest-4-1.md

This example shows how `file` and `worker` contexts are passed to `beforeAll` and `afterAll` hooks, allowing access to extended fixtures like `db` for setup and teardown operations scoped to the file.

```ts
import { test as baseTest } from 'vitest'

const test = baseTest
  .extend('config', { scope: 'file' }, () => loadConfig())
  .extend('db', { scope: 'file' }, ({ config }) => createDatabase(config.port))

test.beforeAll(async ({ db }) => {
  await db.migrateUsers()
})

test.afterAll(async ({ db }) => {
  await db.deleteUsers()
})
```

--------------------------------

### Installing DOM Environment for Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/features.md

Shows how to install `happy-dom` or `jsdom` as a DOM environment for Vitest tests.

```bash
$ npm i -D happy-dom
```

```bash
$ npm i -D jsdom
```

--------------------------------

### Using `provide` in Global Setup Files

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/advanced/test-project.md

The `provide` method is available within global setup files to make values accessible to tests, especially when the public API is not suitable.

```js
export default function setup({ provide }) {
  provide('wsPort', 3000)
}
```

--------------------------------

### Register Hooks in a Vitest Setup File

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/lifecycle.md

Setup files execute before each test file in the same worker process. They are used to initialize global state or register hooks like `afterEach`.

```ts
import { afterEach } from 'vitest'

// Runs before each test file
console.log('Setup file executing')

// Register hooks that apply to all tests
afterEach(() => {
  cleanup()
})

```

--------------------------------

### Example Import Duration Breakdown Output

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/profiling-test-performance.md

An example of the console output showing module import durations, highlighting slow modules and their contribution to total load time.

```bash
Import Duration Breakdown (Top 10)

Module                      Self     Total
my-test.test.ts              5ms    620ms [████████████████████]
date-fns/index.js          500ms    500ms [████████████████░░░░] # [!code error]
src/utils/helpers.ts        10ms    120ms [████████░░░░░░░░░░░░]
```

--------------------------------

### createVitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/advanced/index.md

Creates a Vitest instance without immediately starting tests or validating installed packages. It returns the same `Vitest` instance as `startVitest` and accepts CLI options, Vite overrides, and Vitest options.

```APIDOC
## createVitest

### Description
Creates a Vitest instance without immediately starting tests or validating installed packages. It returns the same `Vitest` instance as `startVitest` and accepts CLI options, Vite overrides, and Vitest options.

### Signature
```ts
function createVitest(
  options: CliOptions,
  viteOverrides: ViteUserConfig = {},
  vitestOptions: VitestOptions = {},
): Promise<Vitest>
```

### Parameters
- **options** (CliOptions) - Required - CLI arguments to configure the Vitest instance.
- **viteOverrides** (ViteUserConfig) - Optional - Complete Vite config that will take precedence over any other user-defined options. Defaults to an empty object.
- **vitestOptions** (VitestOptions) - Optional - Additional Vitest specific options. Defaults to an empty object.

### Usage Example
```js
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test', {
  watch: false,
})
```
```

--------------------------------

### start

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/advanced/vitest.md

This method initializes reporters, the coverage provider, and runs tests. It accepts string filters to match test files.

```APIDOC
## FUNCTION start

### Description
Initialize reporters, the coverage provider, and run tests. This method accepts string filters to match the test files.

### Method
FUNCTION

### Endpoint
start

### Parameters
#### Path Parameters
- **filters** (string[]) - Optional - String filters to match the test files.

### Response
#### Success Response (200)
- **TestRunResult** (Promise) - The result of the test run.
```

--------------------------------

### Wait for Server Startup with vi.waitFor

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/vi.md

This example shows how to use `vi.waitFor` to asynchronously wait for a server to become ready, retrying the check until the condition is met or the timeout expires.

```ts
import { expect, test, vi } from 'vitest'
import { createServer } from './server.js'

test('Server started successfully', async () => {
  const server = createServer()

  await vi.waitFor(
    () => {
      if (!server.isReady) {
        throw new Error('Server not started')
      }

      console.log('Server started')
    },
    {
      timeout: 500, // default is 1000
      interval: 20, // default is 50
    }
  )
  expect(server.isReady).toBe(true)
})
```

--------------------------------

### Example Module for vi.mocked (TypeScript)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/vi.md

Defines functions and an object structure to be used as examples for vi.mocked type helper demonstrations.

```ts
export function add(x: number, y: number): number {
  return x + y
}

export function fetchSomething(): Promise<Response> {
  return fetch('https://vitest.dev/')
}

export function getUser(): { name: string; address: { city: string; zip: string } } {
  return { name: 'John', address: { city: 'New York', zip: '10001' } }
}
```

--------------------------------

### Install Vitest UI Package

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/ui.md

Installs the `@vitest/ui` package as a development dependency, enabling the Vitest UI features.

```bash
npm i -D @vitest/ui
```

--------------------------------

### Example Module: increment.js (JavaScript)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/vi.md

A simple module exporting an increment function, used as the target for mocking examples.

```js
export function increment(number) {
  return number + 1
}
```

--------------------------------

### Example Output for `vitest list` Command

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/cli.md

Illustrates the default text output format when listing tests with `vitest list`.

```txt
describe > some-test
describe > some-test > test 1
describe > some-test > test 2
```

--------------------------------

### onHookStart(context: ReportedHookContext): Awaitable<void>

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/advanced/reporters.md

This method is called when any of these hooks have started running: `beforeAll`, `afterAll`, `beforeEach`, `afterEach`. If `beforeAll` or `afterAll` are started, the `entity` will be either `TestSuite` or `TestModule`. If `beforeEach` or `afterEach` are started, the `entity` will always be `TestCase`. `onHookStart` method will not be called if the hook did not run during the test run.

```APIDOC
## onHookStart

### Description
This method is called when any of these hooks have started running: `beforeAll`, `afterAll`, `beforeEach`, `afterEach`. If `beforeAll` or `afterAll` are started, the `entity` will be either `TestSuite` or `TestModule`. If `beforeEach` or `afterEach` are started, the `entity` will always be `TestCase`. `onHookStart` method will not be called if the hook did not run during the test run.

### Function Signature
```ts
function onHookStart(context: ReportedHookContext): Awaitable<void>
```

### Parameters
- **context** (ReportedHookContext) - The context object for the hook.
```

--------------------------------

### Configuring global setup files in Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/learn/setup-teardown.md

Specifies a global setup file in `vitest.config.js` using the `setupFiles` option. This file runs before any test files are collected.

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./test/setup.js'],
  },
})
```

--------------------------------

### Configuring and Using Vitest Standalone Mode with Filename Filter

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/migration.md

This example demonstrates defining a test:dev script for Vitest's standalone mode in package.json and then using it from the CLI to either start without running files or immediately run a specific test file.

```json
{
  "scripts": {
    "test:dev": "vitest --standalone"
  }
}
```

```bash
# Start Vitest in standalone mode, without running any files on start
$ pnpm run test:dev

# Run math.test.ts immediately
$ pnpm run test:dev math.test.ts
```

--------------------------------

### Example Module with Internal Method Call

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/mocking/modules.md

Defines a module where one function (`foobar`) calls another function (`foo`) internally. This setup demonstrates a pitfall in mocking.

```ts
export function foo() {
  return 'foo'
}

export function foobar() {
  return `${foo()}bar`
}
```

--------------------------------

### Example OpenTelemetry SDK and Vitest Configuration

Source: https://github.com/vitest-dev/vitest/blob/main/docs/config/experimental.md

Demonstrates setting up a Node.js OpenTelemetry SDK with auto-instrumentations and configuring Vitest to enable OpenTelemetry using the custom SDK path.

```js
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { NodeSDK } from '@opentelemetry/sdk-node'

const sdk = new NodeSDK({
  serviceName: 'vitest',
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
})

sdk.start()
export default sdk
```

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    experimental: {
      openTelemetry: {
        enabled: true,
        sdkPath: './otel.js'
      }
    }
  }
})
```

--------------------------------

### Define Custom Browser Setups with `setupFiles` and `provide`

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/browser/multiple-setups.md

This configuration demonstrates how to define multiple instances for the same browser, each with unique `setupFiles` and `provide` values, allowing for varied test environments. The accompanying test file shows how to inject and utilize these provided values.

```typescript
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [
        {
          browser: 'chromium',
          name: 'chromium-1',
          setupFiles: ['./ratio-setup.ts'],
          provide: {
            ratio: 1,
          },
        },
        {
          browser: 'chromium',
          name: 'chromium-2',
          provide: {
            ratio: 2,
          },
        },
      ],
    },
  },
})
```

```typescript
import { expect, inject, test } from 'vitest'
import { globalSetupModifier } from './example.js'

test('ratio works', () => {
  expect(inject('ratio') * globalSetupModifier).toBe(14)
})
```

--------------------------------

### Store Snapshots in Project-Specific Directories (TypeScript)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/config/resolvesnapshotpath.md

This example demonstrates how to use the `context` parameter to store snapshots in a subdirectory named after the project, useful for multi-project setups.

```ts
import { basename, dirname, join } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    resolveSnapshotPath(testPath, snapExtension, context) {
      return join(
        dirname(testPath),
        '__snapshots__',
        context.config.name ?? 'default',
        basename(testPath) + snapExtension,
      )
    },
  },
})
```

--------------------------------

### Install @vitest/browser-webdriverio Package

Source: https://github.com/vitest-dev/vitest/blob/main/packages/browser-webdriverio/README.md

Use your preferred package manager to install the @vitest/browser-webdriverio package as a development dependency.

```sh
npm install -D @vitest/browser-webdriverio
# or
yarn add -D @vitest/browser-webdriverio
# or
pnpm add -D @vitest/browser-webdriverio
```

--------------------------------

### Using beforeEach with Cleanup Function

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/hooks.md

Illustrates how to use `beforeEach` with a return function for cleanup, suitable for simple setup and teardown tasks like connecting and disconnecting a database.

```ts
beforeEach(async () => {
  await database.connect()
  return async () => {
    await database.disconnect()
  }
})
```

--------------------------------

### Istanbul Instrumentation Example in JavaScript

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/coverage.md

This simplified example demonstrates how Istanbul instruments JavaScript code to track branch and function coverage by adding counters and global variables.

```js
// Simplified example of branch and function coverage counters
const coverage = { 
  branches: { 1: [0, 0] }, 
  functions: { 1: 0 }, 
}

export function getUsername(id) {
  // Function coverage increased when this is invoked  
  coverage.functions['1']++ 

  if (id == null) {
    // Branch coverage increased when this is invoked  
    coverage.branches['1'][0]++ 

    throw new Error('User ID is required')
  }
  // Implicit else coverage increased when if-statement condition not met  
  coverage.branches['1'][1]++ 

  return database.getUser(id)
}

globalThis.__VITEST_COVERAGE__ ||= {}
globalThis.__VITEST_COVERAGE__[filename] = coverage
```

--------------------------------

### Install Vitest Browser WebdriverIO Provider

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/browser/index.md

Install the `@vitest/browser-webdriverio` package to run tests locally using the WebDriver protocol.

```npm
npm install -D vitest @vitest/browser-webdriverio
```

```yarn
yarn add -D vitest @vitest/browser-webdriverio
```

```pnpm
pnpm add -D vitest @vitest/browser-webdriverio
```

```bun
bun add -D vitest @vitest/browser-webdriverio
```

--------------------------------

### Start Browser Mode UI Dev Server (Custom Port)

Source: https://github.com/vitest-dev/vitest/blob/main/packages/ui/CONTRIBUTING.md

Starts the UI development server for browser mode, configured to connect to a Vitest browser runner on a specified custom port.

```bash
BROWSER_DEV_PORT=63316 BROWSER_DEV=true pnpm -C packages/ui dev:client
```

--------------------------------

### Install Coverage Provider Packages

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/coverage.md

Manually install the required coverage provider package as a development dependency for either V8 or Istanbul.

```bash
npm i -D @vitest/coverage-v8
```

```bash
npm i -D @vitest/coverage-istanbul
```

--------------------------------

### Generate HTML Report and Start UI Development

Source: https://github.com/vitest-dev/vitest/blob/main/test/ui/README.md

These commands generate an HTML test report from a fixture project and then use the generated report directory to start the UI client for development.

```sh
pnpm -C test/ui test-fixtures --root fixtures/trace --reporter=html --ui=false --run
HTML_REPORT_DIR="$PWD/test/ui/fixtures/trace/html" pnpm -C packages/ui dev:client
```

--------------------------------

### Comprehensive example of defining multiple test tags with various options

Source: https://github.com/vitest-dev/vitest/blob/main/docs/config/tags.md

This example demonstrates defining multiple tags ('unit', 'e2e', 'flaky', 'slow', 'skip-ci') with different descriptions, timeouts, retry logic, and skip conditions based on environment variables.

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    tags: [
      {
        name: 'unit',
        description: 'Unit tests.',
      },
      {
        name: 'e2e',
        description: 'End-to-end tests.',
        timeout: 60_000,
      },
      {
        name: 'flaky',
        description: 'Flaky tests that need retries.',
        retry: process.env.CI ? 3 : 0,
        priority: 1,
      },
      {
        name: 'slow',
        description: 'Slow tests.',
        timeout: 120_000,
      },
      {
        name: 'skip-ci',
        description: 'Tests to skip in CI.',
        skip: !!process.env.CI,
      },
    ],
  },
})
```

--------------------------------

### Configure GraphQL Query Mocking with MSW in Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/mocking/requests.md

Integrate this setup into a Vitest setup file to mock GraphQL queries. It sets up an MSW server, defines a handler for a 'ListPosts' query, and includes lifecycle hooks for test management.

```js
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { graphql, HttpResponse } from 'msw'

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  // ...
]

const graphqlHandlers = [
  graphql.query('ListPosts', () => {
    return HttpResponse.json({
      data: { posts },
    })
  }),
]

const server = setupServer(...graphqlHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
```

--------------------------------

### Example TAP Test Report Output

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/reporters.md

This is an example of the output generated by the Vitest TAP reporter, following the Test Anything Protocol.

```bash
TAP version 13
1..1
not ok 1 - __tests__/test-file-1.test.ts # time=14.00ms {
    1..1
    not ok 1 - first test file # time=13.00ms {
        1..2
        not ok 1 - 2 + 2 should equal 4 # time=11.00ms
            ---
            error:
                name: "AssertionError"
                message: "expected 5 to be 4 // Object.is equality"
            at: "/root-directory/__tests__/test-file-1.test.ts:20:28"
            actual: "5"
            expected: "4"
            ...
        ok 2 - 4 - 2 should equal 2 # time=1.00ms
    }
}
```

--------------------------------

### Install @vitest/browser-playwright package

Source: https://github.com/vitest-dev/vitest/blob/main/packages/browser-playwright/README.md

Use your preferred package manager to install the browser-playwright provider as a development dependency.

```sh
npm install -D @vitest/browser-playwright
```

```sh
yarn add -D @vitest/browser-playwright
```

```sh
pnpm add -D @vitest/browser-playwright
```

--------------------------------

### Example of Creating and Running a Test Specification (TypeScript)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/advanced/test-project.md

Illustrates how to create a Vitest instance, obtain a project, create a test specification for a specific file and lines, and then run it using `vitest.runTestSpecifications`.

```ts
import { createVitest } from 'vitest/node'
import { resolve } from 'node:path/posix'

const vitest = await createVitest('test')
const project = vitest.projects[0]
const specification = project.createSpecification(
  resolve('./example.test.ts'),
  [20, 40], // optional test lines
)
await vitest.runTestSpecifications([specification])
```

--------------------------------

### Tree Reporter In-Progress Output Example

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/reporters.md

This example shows the tree reporter's output for tests currently running, including slow test indications.

```bash
 ✓ __tests__/example-1.test.ts (2) 725ms
   ✓ first test file (2) 725ms
     ✓ 2 + 2 should equal 4
     ✓ 4 - 2 should equal 2

 ❯ test/example-2.test.ts 3/5
   ↳ should run longer than three seconds 1.57s
 ❯ test/example-3.test.ts 1/5

 Test Files 2 passed (4)
      Tests 10 passed | 3 skipped (65)
   Start at 11:01:36
   Duration 2.00s
```

--------------------------------

### Installing Playwright Browsers in GitHub Actions (YAML)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/browser/visual-regression-testing.md

Workflow step to install Playwright browsers with dependencies in a GitHub Actions CI environment.

```yaml
# ...the rest of the workflow
- name: Install Playwright Browsers
  run: npx --no playwright install --with-deps --only-shell
```

--------------------------------

### Configure JUnit Reporter

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/reporters.md

Use these examples to enable the JUnit reporter either via the command line interface or by configuring `vitest.config.ts`.

```bash
npx vitest --reporter=junit
```

```ts
export default defineConfig({
  test: {
    reporters: ['junit']
  }
})
```

--------------------------------

### HTML for toBePartiallyChecked Examples

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/browser/assertions.md

This HTML provides various checkbox and role-based elements used in the `toBePartiallyChecked` assertion examples.

```html
<input type="checkbox" aria-checked="mixed" data-testid="aria-checkbox-mixed" />
<input type="checkbox" checked data-testid="input-checkbox-checked" />
<input type="checkbox" data-testid="input-checkbox-unchecked" />
<div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
<div
  role="checkbox"
  aria-checked="false"
  data-testid="aria-checkbox-unchecked"
/>
<input type="checkbox" data-testid="input-checkbox-indeterminate" />
```

--------------------------------

### HTML Navigation Structure Example

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/browser/aria-snapshots.md

This HTML snippet demonstrates a basic navigation menu with ARIA labels, which is used as an example for ARIA snapshot testing.

```html
<nav aria-label="Main">
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
```

--------------------------------

### Verbose Reporter Default Output Example

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/reporters.md

This example shows the default output of the verbose reporter, listing each test case upon completion.

```bash
✓ __tests__/file1.test.ts > first test file > 2 + 2 should equal 4 1ms
✓ __tests__/file1.test.ts > first test file > 4 - 2 should equal 2 1ms
✓ __tests__/file2.test.ts > second test file > 1 + 1 should equal 2 1ms
✓ __tests__/file2.test.ts > second test file > 2 - 1 should equal 1 1ms

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
```

--------------------------------

### Basic Vitest Test Execution with startVitest (JavaScript)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/advanced/index.md

Demonstrates how to start and close Vitest tests using the `startVitest` API.

```js
import { startVitest } from 'vitest/node'

const vitest = await startVitest()

await vitest.close()
```

--------------------------------

### HTML for `toBeEmptyDOMElement` Examples

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/browser/assertions.md

HTML elements demonstrating various states (empty, not empty, with whitespace, with comment) for testing with `toBeEmptyDOMElement`.

```html
<span data-testid="not-empty"><span data-testid="empty"></span></span>
<span data-testid="with-whitespace"> </span>
<span data-testid="with-comment"><!-- comment --></span>
```

--------------------------------

### Start Playwright Server with Docker Compose

Source: https://github.com/vitest-dev/vitest/blob/main/docs/config/browser/playwright.md

Run this command in your terminal to start the Playwright server defined in `docker-compose.yml` in detached mode.

```sh
docker compose up -d
```

--------------------------------

### Setting up Chrome for WebdriverIO in GitHub Actions (YAML)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/browser/visual-regression-testing.md

GitHub Actions step using `browser-actions/setup-chrome` to install a specific Chrome version for WebdriverIO tests.

```yaml
# ...the rest of the workflow
- uses: browser-actions/setup-chrome@v1
  with:
    chrome-version: 120
```

--------------------------------

### Implement onInit and onTestRunStart in a Custom Reporter

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/advanced/reporters.md

Demonstrates how to implement the onInit method to store the Vitest instance and use it in subsequent lifecycle methods like onTestRunStart to access configuration details.

```ts
import type { Reporter, TestSpecification, Vitest } from 'vitest/node'

class MyReporter implements Reporter {
  private vitest!: Vitest

  onInit(vitest: Vitest) {
    this.vitest = vitest
  }

  onTestRunStart(specifications: TestSpecification[]) {
    console.log(
      specifications.length,
      'test files will run in',
      this.vitest.config.root,
    )
  }
}

export default new MyReporter()
```

--------------------------------

### Example .vitest Directory Structure for Artifacts

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/advanced/reporters.md

Illustrates the recommended directory structure within the `.vitest` folder for custom reporters to store their artifacts, ensuring proper co-location and `.gitignore` management.

```ansi
.vitest
│
├── yaml-reporter
│   ├── results.yaml
│   └── summary.yaml
│
└── junit-reporter
    └── report.xml
```

--------------------------------

### Install Unreleased Vitest Commit via pkg.pr.new

Source: https://github.com/vitest-dev/vitest/blob/main/CONTRIBUTING.md

Install a specific unreleased Vitest commit from the main branch or a PR using 'pkg.pr.new' for testing purposes.

```bash
npm i https://pkg.pr.new/vitest@{commit}
```

--------------------------------

### HTML Login Form Example

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/browser/aria-snapshots.md

This HTML snippet provides a basic login form with ARIA labels for inputs and a button, serving as an example for ARIA snapshot testing.

```html
<form aria-label="Log In">
  <input aria-label="Email" />
  <input aria-label="Password" type="password" />
  <button>Submit</button>
</form>
```

--------------------------------

### Install Vitest Browser Playwright Provider

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/browser/index.md

Install the `@vitest/browser-playwright` package to run tests in CI and locally, leveraging Playwright for parallel execution.

```npm
npm install -D vitest @vitest/browser-playwright
```

```yarn
yarn add -D vitest @vitest/browser-playwright
```

```pnpm
pnpm add -D vitest @vitest/browser-playwright
```

```bun
bun add -D vitest @vitest/browser-playwright
```

--------------------------------

### Dot Reporter Passing Output Example

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/reporters.md

This example shows the minimal output of the dot reporter for a passing test suite, with one dot per test.

```bash
....

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  12:34:32
   Duration  1.26s (transform 35ms, setup 1ms, collect 90ms, tests 1.47s, environment 0ms, prepare 267ms)
```

--------------------------------

### Reusable Test Setup with onTestFinished in Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/hooks.md

Encapsulate resource setup and cleanup logic within a helper function using `onTestFinished` to promote reusability across multiple tests.

```ts
// this can be in a separate file
function getTestDb() {
  const db = connectMockedDb()
  onTestFinished(() => db.close())
  return db
}

test('performs a user query', async () => {
  const db = getTestDb()
  expect(
    await db.query('SELECT * from users').perform()
  ).toEqual([])
})

test('performs an organization query', async () => {
  const db = getTestDb()
  expect(
    await db.query('SELECT * from organizations').perform()
  ).toEqual([])
})
```

--------------------------------

### Initialize Vitest Project Configuration

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/cli.md

Sets up project configuration for Vitest. Currently supports initializing browser-specific settings.

```bash
vitest init browser
```

--------------------------------

### Start Vitest UI Dev Server (Default Port)

Source: https://github.com/vitest-dev/vitest/blob/main/packages/ui/CONTRIBUTING.md

Starts the UI development server for `@vitest/ui` features, configured to align with the default API port (3023).

```bash
VITE_PORT=3023 pnpm -C packages/ui dev:client
```

--------------------------------

### Configure WebSocket Event Mocking with MSW in Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/mocking/requests.md

Implement this setup in a Vitest setup file to mock WebSocket connections and events. It establishes an MSW server, defines a handler for 'connection' events, and includes lifecycle hooks for test management.

```js
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { ws } from 'msw'

const chat = ws.link('wss://chat.example.com')

const wsHandlers = [
  chat.addEventListener('connection', ({ client }) => {
    client.addEventListener('message', (event) => {
      console.log('Received message from client:', event.data)
      // Echo the received message back to the client
      client.send(`Server received: ${event.data}`)
    })
  }),
]

const server = setupServer(...wsHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
```

--------------------------------

### Example of Using matchesTestGlob (TypeScript)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/advanced/test-project.md

Demonstrates how to use `matchesTestGlob` to check if a file is a test file, including an example of providing source code for in-source test validation.

```ts
import { createVitest } from 'vitest/node'
import { resolve } from 'node:path/posix'

const vitest = await createVitest('test')
const project = vitest.projects[0]

project.matchesTestGlob(resolve('./basic.test.ts')) // true
project.matchesTestGlob(resolve('./basic.ts')) // false
project.matchesTestGlob(resolve('./basic.ts'), () => `
if (import.meta.vitest) {
  // ...
}
`) // true if `includeSource` is set
```

--------------------------------

### Assert notIncludeOrderedMembers in Vitest

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/assert.md

Use this assertion to verify that a `subset` array is not included in a `superset` array in the same order, starting from the first element of the superset, using strict equality. This snippet shows examples where the order or content differs.

```ts
import { assert, test } from 'vitest'

test('assert.notIncludeOrderedMembers', () => {
  assert.notIncludeOrderedMembers([1, 2, 3], [2, 1], 'not include ordered members')
  assert.notIncludeOrderedMembers([1, 2, 3], [2, 3], 'not include ordered members')
})
```

--------------------------------

### Configure Vitest with Browser Preview Provider (TypeScript)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/config/browser/preview.md

Install `@vitest/browser-preview` and specify its `preview` export in `test.browser.provider` to run tests in a real browser. Configure the target browser using the `instances` array.

```typescript
import { preview } from '@vitest/browser-preview'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      provider: preview(),
      instances: [{ browser: 'chromium' }]
    }
  }
})
```

--------------------------------

### Conditionally Execute Setup Logic with `TestRunner.matchesTags` (TypeScript)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/test-tags.md

Use this snippet to conditionally execute expensive setup logic, such as seeding a database, only when tests matching specific tags are included by the `--tags-filter`.

```ts
import { beforeAll, TestRunner } from 'vitest'

beforeAll(async () => {
  // Seed database when "vitest --tags-filter db" is used
  if (TestRunner.matchesTags(['db'])) {
    await seedDatabase()
  }
})
```

--------------------------------

### Example of Using getProvidedContext (TypeScript)

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/advanced/test-project.md

Demonstrates how to create a Vitest instance, provide global and project-specific context, and retrieve the combined context object using `getProvidedContext`.

```ts
import { createVitest } from 'vitest/node'

const vitest = await createVitest('test')
vitest.provide('global', true)
const project = vitest.projects.find(p => p.name === 'custom')
project.provide('key', 'value')

// { global: true, key: 'value' }
const context = project.getProvidedContext()
```

--------------------------------

### HTML Button Example for toHaveStyle

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/browser/assertions.md

An example HTML button with inline styles, used to demonstrate the `toHaveStyle` matcher's ability to check CSS properties.

```html
<button
  data-testid="delete-button"
  style="display: none; background-color: red"
>
  Delete item
</button>
```

--------------------------------

### HTML Form Example for toHaveFormValues

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/browser/assertions.md

An example HTML form demonstrating various input types, including text, password, and checkbox, used to test the `toHaveFormValues` matcher.

```html
<form data-testid="login-form">
  <input type="text" name="username" value="jane.doe" />
  <input type="password" name="password" value="12345678" />
  <input type="checkbox" name="rememberMe" checked />
  <button type="submit">Sign in</button>
</form>
```

--------------------------------

### start Function Signature

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/advanced/vitest.md

This function signature shows how to initialize reporters, coverage, and run tests, accepting optional string filters.

```ts
function start(filters?: string[]): Promise<TestRunResult>
```

--------------------------------

### Render Components with Framework Packages

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/browser/index.md

Examples for rendering components from Vue, Svelte, React, and Lit using their respective `vitest-browser-*` packages and performing assertions on the rendered output.

```ts
import { render } from 'vitest-browser-vue'
import Component from './Component.vue'

test('properly handles v-model', async () => {
  const screen = await render(Component)

  // Asserts initial state.
  await expect.element(screen.getByText('Hi, my name is Alice')).toBeInTheDocument()

  // Get the input DOM node by querying the associated label.
  const usernameInput = screen.getByLabelText(/username/i)

  // Type the name into the input. This already validates that the input
  // is filled correctly, no need to check the value manually.
  await usernameInput.fill('Bob')

  await expect.element(screen.getByText('Hi, my name is Bob')).toBeInTheDocument()
})
```

```ts
import { render } from 'vitest-browser-svelte'
import { expect, test } from 'vitest'

import Greeter from './greeter.svelte'

test('greeting appears on click', async () => {
  const screen = await render(Greeter, { name: 'World' })

  const button = screen.getByRole('button')
  await button.click()
  const greeting = screen.getByText(/hello world/iu)

  await expect.element(greeting).toBeInTheDocument()
})
```

```tsx
import { render } from 'vitest-browser-react'
import Fetch from './fetch'

test('loads and displays greeting', async () => {
  // Render a React element into the DOM
  const screen = render(<Fetch url="/greeting" />)

  await screen.getByText('Load Greeting').click()
  // wait before throwing an error if it cannot find an element
  const heading = screen.getByRole('heading')

  // assert that the alert message is correct
  await expect.element(heading).toHaveTextContent('hello there')
  await expect.element(screen.getByRole('button')).toBeDisabled()
})
```

```ts
import { render } from 'vitest-browser-lit'
import { html } from 'lit'
import './greeter-button'
```

--------------------------------

### Structure a test using Arrange, Act, Assert pattern

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/learn/testing-in-practice.md

This example demonstrates the 'Arrange, Act, Assert' pattern for structuring tests, where data is set up, the action is performed, and the result is checked. Each test should focus on a single behavior.

```js
test('removes an item from the list', () => {
  // Set up
  const list = new ShoppingList()
  list.add('milk')
  list.add('bread')

  // Act
  list.remove('milk')

  // Check
  expect(list.getItems()).toEqual(['bread'])
})
```

--------------------------------

### Using `using` with `vi.spyOn` for Automatic Cleanup

Source: https://github.com/vitest-dev/vitest/blob/main/docs/blog/vitest-3-2.md

This example demonstrates using the `using` keyword with `vi.spyOn` to automatically call `mockRestore` when the block exits, ensuring proper cleanup of spied methods.

```ts
it('calls console.log', () => {
  using spy = vi.spyOn(console, 'log').mockImplementation(() => {})
  debug('message')
  expect(spy).toHaveBeenCalled()
})

// console.log is restored here
```

--------------------------------

### Example of Console Logs During Vitest Collection

Source: https://github.com/vitest-dev/vitest/blob/main/docs/api/advanced/test-suite.md

This example illustrates which console logs are captured during test suite collection (e.g., `describe` block, `beforeAll`) versus those within `test` functions.

```ts
describe('suite', () => {
  console.log('included') // [!code highlight]

  beforeAll(() => {
    console.log('included') // [!code highlight]
  })

  test('test', () => {
    console.log('not included') // [!code error]
  })
})
```

--------------------------------

### Start Vitest Browser Mode Backend

Source: https://github.com/vitest-dev/vitest/blob/main/packages/ui/CONTRIBUTING.md

Initiates a Vitest server in browser mode, providing the backend state for browser-mode UI development.

```bash
pnpm -C packages/ui test:ui --ui --open=false
```

--------------------------------

### Install @vitest/web-worker

Source: https://github.com/vitest-dev/vitest/blob/main/packages/web-worker/README.md

Use a package manager to add `@vitest/web-worker` as a development dependency to your project.

```bash
# with npm
npm install -D @vitest/web-worker
```

```bash
# with pnpm
pnpm install -D @vitest/web-worker
```

```bash
# with yarn
yarn add --dev @vitest/web-worker
```

--------------------------------

### Scoping Setup and Teardown Hooks with Vitest describe

Source: https://github.com/vitest-dev/vitest/blob/main/docs/guide/learn/setup-teardown.md

Define beforeEach hooks inside describe blocks to apply setup and teardown logic only to the tests within that specific block, allowing for different test contexts.

```js
import { beforeEach, describe, expect, test } from 'vitest'

describe('math operations', () => {
  let value

  beforeEach(() => {
    value = 0
  })

  test('can add', () => {
    value += 5
    expect(value).toBe(5)
  })

  test('can subtract', () => {
    value -= 3
    expect(value).toBe(-3) // value was reset to 0 by beforeEach
  })
})

describe('string operations', () => {
  let text

  beforeEach(() => {
    text = 'hello'
  })

  test('can uppercase', () => {
    expect(text.toUpperCase()).toBe('HELLO')
  })
})
```