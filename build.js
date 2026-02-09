/**
 * Build Script — Assembles index.html from index.template.html + section files.
 *
 * Usage:  node build.js
 *
 * Finds <!-- @include path/to/file.html --> directives in the template
 * and replaces each one with the contents of the referenced file,
 * indented to match the directive's position.
 */

const fs = require('fs');
const path = require('path');

const TEMPLATE = 'index.template.html';
const OUTPUT = 'index.html';
const INCLUDE_RE = /^(\s*)<!--\s*@include\s+([\w./-]+)\s*-->\s*$/;

const template = fs.readFileSync(path.join(__dirname, TEMPLATE), 'utf8');

const result = template.split('\n').map(line => {
    const match = line.match(INCLUDE_RE);
    if (!match) return line;

    const indent = match[1];          // leading whitespace of the directive
    const filePath = match[2];        // e.g. sections/hero/hero.html
    const fullPath = path.join(__dirname, filePath);

    if (!fs.existsSync(fullPath)) {
        console.error(`ERROR: Include file not found: ${filePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(fullPath, 'utf8').trimEnd();

    // Indent every line of the included file to match the directive
    // (skip indentation for blank lines to avoid trailing whitespace)
    const indented = content.split('\n').map(l => l.length ? indent + l : '').join('\n');

    return indented;
}).join('\n');

fs.writeFileSync(path.join(__dirname, OUTPUT), result, 'utf8');

console.log(`Built ${OUTPUT} from ${TEMPLATE}`);
console.log(`  Sections included: ${(template.match(INCLUDE_RE) || []).length || template.split('\n').filter(l => INCLUDE_RE.test(l)).length}`);
