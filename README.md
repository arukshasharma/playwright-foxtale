**Playwright E2E Automation Framework with GitHub CI/CD**
This project is a scalable **End-to-End (E2E) automation framework** built using Playwright and integrated with **GitHub Actions** for continuous testing.

Features
* Cross-browser testing (Chromium, Firefox, WebKit)
* Fast parallel execution
* Built-in HTML reports
* CI/CD pipeline using GitHub Actions
* Clean and scalable folder structure
* Debugging with Playwright Inspector

Tech Stack
* **Framework:** Playwright
* **Language:** JavaScript
* **CI/CD:** GitHub Actions

Project Structure
Bash
├── tests/              # Test specs
├── pages/              # Page Objects
├── utils/              # Utilities
├── .github/workflows/  # CI/CD pipelines
├── playwright.config   # Config file
├── package.json

 Running Tests Locally
```bash
npx playwright test
```

Run in headed mode:
```bash 
npx playwright test --headed
```

Run in UI mode:
```bash
npx playwright test --ui
```
Test Reports
```bash
npx playwright show-report
```

Allure Reporting
----------------
To generate an Allure report from Playwright results:

1. Install dependencies:

```bash
npm install --save-dev @shelex/allure-playwright @shelex/allure-commandline
```

2. Run tests to produce results in `allure-results` (Playwright reporter is preconfigured):

```bash
npm test
```

3. Generate the Allure report and open it locally:

```bash
npm run allure:generate
npm run allure:open
```

Or serve directly from results:

```bash
npm run allure:serve
```

Notes:
- Playwright is configured to write results to `allure-results` via the `@shelex/allure-playwright` reporter.
- You can attach screenshots/videos to Allure from tests using the Allure API if desired.

 CI/CD with GitHub Actions
This project uses **GitHub Actions** to automatically run tests on every push and pull request.

 Workflow Highlights:
* Runs on every `push` and `pull_request`
* Installs dependencies
* Executes Playwright tests
* Uploads test reports as artifacts

 Sample Workflow File
Create this file:

```
.github/workflows/playwright.yml
```

```yaml 
name: Playwright Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright Tests
        run: npx playwright test

      - name: Upload HTML Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

 Future Improvements
* Allure Reporting integration
* Environment-based execution (dev/staging/prod)
* Docker support
* Slack/Email notifications

 Contribution
Feel free to fork, raise issues, or submit PRs!


