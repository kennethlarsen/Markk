var fs = require('fs');
const folderToStart = "src/";
const folderToOutput = "build";
var unified = require('unified')
var markdown = require('remark-parse')
var vfile = require('to-vfile')


async function traverseFiles() {
  try {
    const files = await fs.promises.readdir(folderToStart);
    console.log(files);

    for (const file of files) {
      const output = unified()
        .use(markdown)
        .parse(vfile.readSync(`${folderToStart}${file}`));

      const fileName = file.split('.').slice(0, -1).join('.')
      output.children.forEach((child) => {
        if (child.type === 'code') {
          fs.appendFileSync(`build/${fileName}.html`, child.value, function (err) {
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

traverseFiles();
