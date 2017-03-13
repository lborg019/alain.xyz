Introducing **Fig**, an open source project offering high quality home improvement products and services. 

Creating a physical product today has never been easier, there's so many tools and resources available to bring ideas to market. 

### Engineering

- [Blender](https://www.blender.org/) - **Open Source** | 3D CAD software

- [Altium](http://www.altium.com/altium-designer/overview) - **$120 per Year** | Curcuit Board CAD

### IOT Computers

- [Raspberry Pi](https://www.amazon.com/CanaKit-Raspberry-Micro-Supply-Listed/dp/B01C6FFNY4/ref=pd_lpo_147_tr_t_3?_encoding=UTF8&psc=1&refRID=DTKWYDD6P2ZJSTQF5JMM) - **$41** | A low powered linux computer, with USB, Bluetooth, Wifi, and HDMI I/O, plus 32 GPIO pins.

- [Omega](https://onion.io/store/) - **$19** | A similar device to the Pi, but smaller and cheaper.

#### Videos

- [EEV Blog](https://www.youtube.com/channel/UC2DjFE7Xf11URZqWBigcVOQ) - A blog detailing the idiosyncrasies of being an electrical engineer. 

- [GreatScott!](https://www.youtube.com/user/greatscottlab) - a variety of custom electrical engineering projects. 

## Fig Table

For a long time I wanted a standing desk that I would be able to control from the command line:

```bash
# Move the table down 4cm
fig-table -4
```

To do this, I built a CLI that runs through a Node.js module:

### Client CLI

```js
#!/usr/bin/env node

const process = require('process');
const http = require('http');
const fs = require('fs');


var helpMessage =
  `
fig-table Node.js CLI

Usage:
    fig-table <number>            Move table up by x centemeters
    fig-table [options]

Options:
    -h, --help                    Display this message
    -v, --version                 Print version info and exit
    -c, --config <ip-address>     Configure the app with a unique ip.`;

// Map of regex key to command function.
const commandMap = {

  '--help': () => {
    console.log(helpMessage)
  },

  '-h': () => commandMap['--help'](),

  '--version': () => {
    console.log(JSON.parse(fs.readFileSync('../package.json').version));
  },

  '-v': () => commandMap['--version'](),

  '--config': (args) => {
    if (args.length > 0 && args[1].match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/))
      return console.error('Error: Please enter a valid IPv4 address.');

    fs.writeFileSync('./config.json', JSON.stringify({ ip: args[0] }), { encoding: 'utf8' });

  },

  '-c': () => commandMap['--config'](),

  '(?:\d*\.)?\d+': (args) => {

    if (!fs.existsSync('./config.json'))
      return console.error('Error: Please configure application first (e.g. fig-table -c 255.255.255.255)');

    var {ip} = JSON.parse(fs.readFileSync('./config.json'));

    var postData = JSON.stringify({
      'vector': args[0],
      'time': 100
    });

    var options = {
      hostname: ip,
      port: 80,
      path: '/api',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    var req = http.request(options, (res) => {

      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        console.log(`${chunk}`);
      });
    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });

    // write data to request body
    req.write(postData);
    req.end();
  }

}


// Start Processing Command Line Arguments

for (var i = 0; i < process.argv.length; i++) {

  // Check if there's a key in the Command Map 
  // that matches the command line argument
  var match = Object.keys(commandMap).reduce(
    (prev, cur) => prev | RegExp(cur).exec(process.argv[i]),
    null);

  if (match) {
    match([...process.argv].splice(0, i-1));
    break;
  }
  else if (i === process.argv.length - 1) {
    commandMap['-h']();
  }
}
```

### Server

For a server, I decided to use Rust since this would allow me to easily build a binary for the Pi's ARM Linux architecture with one command:

```bash
cargo build --target=aarch64-unknown-linux-gnu
```

From there, deploying is as easy as:

```bash
# Download the server binary
wget http://github.com/alaingalvan/fig-standing-desk/raw/server/dist/fig-table-server
# Change the permissions to make it executable
sudo chmod 777 ./fig-table-server
# Run it
./fig-table-server
```

And you could go further by making the program a service that runs at startup, setting up a docker instance to periodically listen to github and download the latest server from the master branch automatically, hot swap servers.