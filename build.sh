#!/bin/sh
# Rebuilds index.html (the whole app in one file) from the pieces in src/.
cd "$(dirname "$0")" && { cat src/head.html src/curriculum.js src/app.js; printf '</script>\n</body>\n</html>\n'; } > index.html
