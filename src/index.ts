var fs = require('fs');
const folderToStart = "src/";
const folderToOutput = "build";
var unified = require('unified')
var markdown = require('remark-parse')
var vfile = require('to-vfile')
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'new', type: String },
  { name: 'build', type: Boolean }
]

const options = commandLineArgs(optionDefinitions)

if (options.build) {
  build();
}


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
      output.children.forEach((child: any) => {
        if (child.type === 'code') {
          fs.appendFileSync(`${folderToOutput}/${fileName}.html`, child.value, function (err: any) {
            if (err) throw err;
            console.log('File is created successfully.');
          });
        }
      });

    }
  }

  catch(e) {
    console.error(e);
  }
}
