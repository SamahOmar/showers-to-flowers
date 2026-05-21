# Showers to Flowers

An interactive browser game inspired by the phrase "April showers bring May flowers."

The player moves a rain cloud left and right, waters a plant, and grows it from a seed into a flower. The project is built as a small Django app with modular frontend JavaScript, static assets, templates, and regression tests.

## Tech Stack

- Python
- Django
- HTML templates
- CSS
- Vanilla JavaScript ES modules
- Django `TestCase`

## Current Features

- Keyboard-controlled cloud movement with left and right arrow keys
- Continuous rain generation tied to the cloud position
- Plant growth state machine
- Growth progress bar with ARIA progressbar attributes
- Bloom and overwatered states
- Cutscene and ambient sky effects
- Favicon and static asset handling
- Regression tests for key game behavior

## Project Structure

```text
showers_to_flowers_game/
  manage.py
  showers_to_flowers_game/
    settings.py
    urls.py
  game/
    models.py
    views.py
    urls.py
    tests.py
    templates/game/
      base.html
      index.html
      game.html
      cutscene.html
    static/game/
      css/style.css
      img/favicon.svg
      js/
        game.js
        constants.js
        cloud-controller.js
        plant-controller.js
        growth-bar.js
        rain-engine.js
        cutscene.js
        confetti.js
        ambient-clouds.js
```

## Frontend Architecture

The browser game logic is split into ES modules:

- `game.js`: entrypoint that boots the game after `DOMContentLoaded`
- `constants.js`: shared thresholds, labels, and rain settings
- `cloud-controller.js`: keyboard input and cloud position
- `plant-controller.js`: growth state, plant stage rendering, bloom/overwatered events
- `growth-bar.js`: progress bar UI updates
- `rain-engine.js`: raindrop lifecycle, collision with plant, splash effects
- `cutscene.js`: opening animation sequence
- `confetti.js`: bloom celebration effect
- `ambient-clouds.js`: background cloud effects

This keeps each module focused and makes the code easier to test, debug, and extend.

## Backend Responsibilities

Django currently handles:

- Serving the main game page
- Composing templates
- Serving static assets during development
- Routing `/favicon.ico`
- Defining a `GameSession` model for session data
- Running characterization, accessibility, model, and regression tests

## Growth Rules

The plant growth thresholds are centralized in `constants.js`:

- `0`: seed
- `40`: sprout
- `100`: bloom
- `110`: overwatered
- `120`: maximum internal growth cap

The flower only appears when the progress bar reaches full growth.

## Run Locally

From the repository root:

```powershell
cd showers_to_flowers_game
..\.venv\Scripts\python.exe manage.py runserver
```

Then open:

```text
http://127.0.0.1:8000/
```

## Run Tests

From `showers_to_flowers_game/`:

```powershell
..\.venv\Scripts\python.exe manage.py test
```

Current suite coverage includes:

- Main page rendering
- Required game DOM elements
- Static file discovery
- Favicon route
- Accessibility-related markup
- `GameSession` model behavior
- Growth logic regression tests
- JavaScript module layout checks

## Engineering Highlights

- Modular frontend design using ES modules
- Regression tests for previously fixed game bugs
- Clear growth thresholds instead of magic values spread across the code
- Accessible progress bar semantics
- Separation between Django templates, static CSS, and browser game logic
- Static asset cache busting through script query versions
- Server-side tests that protect the public page contract

## Future Improvements

- Add browser-level tests with Playwright
- Record completed sessions through an API endpoint
- Add a score or completion summary screen
- Add mobile/touch controls
- Improve game session persistence and analytics
- Add CI with GitHub Actions
- Add linting/formatting with Ruff for Python and a JavaScript linter
