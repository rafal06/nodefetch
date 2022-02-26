const systeminfo = require('systeminformation');
const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');

async function main() {
    // Get system info
    const username = os.userInfo().username;
    const hostname = os.hostname();
    const osInfo = await systeminfo.osInfo();
    const cpuInfo = await systeminfo.cpu();
    const memory = Math.round((os.totalmem - os.freemem) / 1048576 ) + 'M/' + Math.round(os.totalmem / 1048576) + 'M';

    // Generate separator based on the length of username@hostname
    let separator = '';
    for(let i = 0; i < username.length + hostname.length + 1; i++) {
        separator += '-';
    }

    // Get DE name
    const de = process.env.XDG_CURRENT_DESKTOP;
    // Determine DE version checking command
    let deVerCmd;
    switch(de) {
        case 'GNOME':
            deVerCmd = 'gnome-shell --version';
            break;
        case 'KDE':
            deVerCmd = 'plasmashell --version';
            break;
        default:
            deVerCmd = '';
    }
    // Get DE version
    const deVer = execSync(deVerCmd).toString().replace( /^\D+/g, '').replace(/[\n\r]/g, '');

    // Get the ascii logo
    // Look for the files in ascii dir
    const asciiDir = fs.readdirSync('./ascii-distros', 'utf-8');
    // Check if there is a file corresponding to the current distro
    let asciiCheck = asciiDir.find(file => file === `${osInfo.logofile}.txt`);
    // If there isn't such, use the default tux ascii
    if(asciiCheck === undefined) asciiCheck = 'linux.txt';
    // Read ascii logo and convert it to array
    const asciiLogo = fs.readFileSync(`./ascii-distros/${asciiCheck}`, 'utf-8');
    const asciiLogoLines = asciiLogo.split(/\r?\n/);

    // Print the fetch
    console.log(asciiLogoLines[0] + `${username}@${hostname}`);
    console.log(asciiLogoLines[1] + separator);
    console.log(asciiLogoLines[2] + `${osInfo.distro} ${osInfo.release}`);
    console.log(asciiLogoLines[3] + osInfo.kernel);
    console.log(asciiLogoLines[4] + `${de} ${deVer}`);
    console.log(asciiLogoLines[5] + cpuInfo.brand);
    console.log(asciiLogoLines[6] + memory);

    // Print the rest of the ascii
    for(let i = 7; i < asciiLogoLines.length - 1; i++) {
        console.log(asciiLogoLines[i]);
    }
}

main();
