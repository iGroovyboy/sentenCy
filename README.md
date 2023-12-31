# sentenCy

A web-based annotation tool designed for preparing text data for AI training, specifically for attaching custom named entities (*tagging words* in terms of the app).

Originally made to be used alon with [spaCy](https://spacy.io/).

Latest working build: https://igroovyboy.github.io/sentenCy/

## Usage
Begin by loading or pasting your text data on the "Sources" page.
Enter or import JSON tag data and optionally define hotkeys for more manual control.
Annotate your text line by line by clicking or selecting words and tags.
Open the prepared data as a CSV.

## Disclaimer
This is a free and experimental tool, provided without any warranties.

## Getting Started
To run the project locally, follow these steps:

1. create copy of `.env.example` and rename it to `.env`
```sh
cp .env.example .env
```


2. install packages
```sh
yarn
```

3. build app
```sh
yarn build
```
