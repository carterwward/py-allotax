# Package decisions

## Decision
Regarding the ideation below, we ended up going with ...

## Design

### Goals
1. User accessibility for the use case of integrating the graphing method in computational research.
    - This goal means ease of ease of use and ease of installation into their environment.
    - **We agree this is the main goal of the project.**
1. Maintainability
    - It is easy to make updates to the code, hopefully from its main `npm` package.
    - One realism we already foresee is that the `npm` package exists to be extensible for use cases beyond the current one--the current use case requires some tailoring to intercept the graph `svg` and save it to a file, potentially meaning we store a version of the package in this repo to make adjustments for serverless graph creation.
1. Performance
    - The graphing method runs headlessly and should be able to handle large data sets as well as be integrated into larger analyses, pipelines, parallel processing, etc.

### Options for design
1. Write the package all in JavaScript.
    - Pro: we wouldn't need to manage disparate ecosystems (Python and JavaScript).
    - Con: this route doesn't as readily acheve goal 1 as installation of of multiple environments can be a major blocker to users.
1. Write the package in Python.
    - Pro: achieves goal 1 of ease of use
    - Con: may make goal 1 of ease of installation still difficult.
- Add-on options to consider:
    1. Include any node.js library binaries in the Python library to negate a `npm` and `node.js` environment for users (assumption: ease of installation comes from Python installation being the only dependency). The difficulty with this route is that binaries for multiple OSs should be included.
        - ** We want to attempt this route first to abstract away JS ecosystem.**
    1. Make a set-up/install script so the user does not need to worry about the installation of `node`, `npm`, and packages.
    1. User Docker containers to manage the environment.
        - Pro: this would make the environment easy and consistent across all users. Users would only need to worry about a Docker installation.
            - Good option down the line.
        - Con: this is a current barrier to devs (learning and time to commit to this project)--but otherwise surmountable on the learning front.
- HTML to image options
    1. We can do this in JS or Python, but Python gives the user more control over format, and we're gearing design toward analysis in Python.
    1. Many Python libraries can do this: `imgkit`, `html2image`, `selenium`, `pyppeteer`.
        - `wkhtmltopdf` is a common dependency multiple Python libraries wrap that homebrew is deprecating--this could prevent a future difficulty for install. `imgkit` is a wrapper around this library.
        - `pyhtml2pdf` uses `selenium` and `ghostscript` to create a headless Chrome browser--some dependencies but seems reliable. Ability to install with these various dependencies will need to be tested.
    1. A good JS option is `html2canvas` but also requires a headless browser and takes away some ease of use.

## Future improvements (TODOs):
1. Continue improving the ecosystem dependencies to streamline ease of installation.
1. Extend methods to include the ability to get computed ranks and other variables of interest (data that is generated for the creation of the graph but not returned anywhere).
1. If applicable based on current decision, incorporate improvements to the main `npm` library version.
1. Add a script to parse data into the required format (see `data/test_data` for required format).