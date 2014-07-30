# gpatent

nodejs module for downloading  google patents

[![build status](https://secure.travis-ci.org/mzorn/google-patent.png)](http://travis-ci.org/mzorn/google-patent)

## Installation

This module is installed via npm:

``` bash
$ npm install gpatent
```

## Example Usage

``` js
var gPatent = require('google-patent');

```

### get (name, path)

``` js
gPatent.get('US1234567') // downloads patent to process.cwd()
gPatent.get('US1234567', '..') // downloads patent to ..
gPatent.get('US1234567', '../patents') // downloads patent to ../patents
```

### pull (name, path, prior_art_folder_name)

``` js
gPatent.pull('US1234567') // downloads patent to process.cwd(), cited patents to prior_art_patents
gPatent.get('US1234567', '..', 'prior') // downloads patent to .., cited patents to ../prior
```
