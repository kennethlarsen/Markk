# index: Main file

This is the main (and currently only) source code file. It contains everything for Markk.

## Dependencies
First we need some libraries to handle markdown and the filesystem. `fs` and `vfile` are for file handling and `unified` and `markdown` are for handling Markdown and AST.

```js
const fs = require('fs');
const vfile = require('to-vfile')
const unified = require('unified')
const markdown = require('remark-parse')
```
## Command line arguments
Here we make sure Markk can accept command line arguments. I want to changes this since it now results in `markk --build` instead of `mark build`.

It has setup `new` as a command but that is not created yet.

```js
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'new', type: String },
  { name: 'build', type: Boolean }
]

```

Here we set the folder to start from and the folder to output. We might want to make this customizable at some point.

After this we setup the commandline library. If `markk --build` then we run `build()`.

```js
const folderToStart = "src/";
const folderToOutput = "build";
const options = commandLineArgs(optionDefinitions)

if (options.build) {
  build();
}

```

## Building

The `build` function is currently the main function. It checks if the `build/` folder exists - and creates it if not.

Then we traverese the `src/` folder, parse the markdown file and take all code blocks and move it into the final files

```js

async function build() {
  try {
    if (!fs.existsSync(folderToOutput)) {
      fs.mkdirSync(folderToOutput);
    }
    const files = await fs.promises.readdir(folderToStart);

    for (const file of files) {
      const output = unified()
        .use(markdown)
        .parse(vfile.readSync(`${folderToStart}${file}`));

      const fileName = file.split('.').slice(0, -1).join('.')
      output.children.forEach((child) => {
        if (child.type === 'code') {
          fs.appendFileSync(`${folderToOutput}/${fileName}.html`, child.value, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
          });
        }
      });

    }
  }

  catch (e) {
    console.error(e);
  }
}
```