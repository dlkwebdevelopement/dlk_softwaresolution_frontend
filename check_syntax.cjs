const { buildSync } = require('esbuild');
const path = require('path');

try {
  buildSync({
    entryPoints: [path.join(__dirname, 'src/components/Navbar.jsx')],
    write: false,
    loader: { '.jsx': 'jsx' },
  });
  console.log("Navbar.jsx is syntactically correct!");
} catch (e) {
  console.error("Syntax Error found inside Navbar.jsx:");
  console.error(e.message);
}
