const fs = require('fs');
const readline= require('readline');

async function processBindFile(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let origin;
  let ttl;
  let previousTtl;
  let previousName;

  let records = [];
  let recordsType = ['Ns', 'A', 'CNAME', 'MX'];
  recordsType.forEach(element => {
    records[element] = [];
  });

  let soa = {};
  let soaLine = 0;
  let multiLineSoa = false;
  let containsTtl = false;

  for await (let line of rl) {
    if(line.length > 1) {
        let commentedLine = false;
        let l = line.trim().replace(/\t/g, ' ').replace(/\s/g, '');

        let commentIndex = l.indexOf(';');
        if(commentIndex != -1 && commentIndex != 0) {
            let m = l.split(';');
            l = m[0];
        } else {
            commentedLine = true;
        }

        if(!commentedLine) {
            let splitLine = l.split(' ');

            switch (splitLine[0]) {
                case '$ORIGIN':
                    origin = splitLine[1];
                    break;
                case '$TTL':
                    ttl = splitLine[1];
                    break;
                case '$INCLUDE':
                    break;
            }
        }
    }
  }

}
processBindFile(process.argv.slice(2)[0]);
