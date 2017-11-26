# escpos-print-db browser

[![Build Status](https://travis-ci.org/receipt-print-hq/escpos-printer-db-browser.svg?branch=master)](https://travis-ci.org/receipt-print-hq/escpos-printer-db-browser)

This web app presents the data in [receipt-print-hq/escpos-printer-db
](https://github.com/receipt-print-hq/escpos-printer-db/) for browsing. It is hosted online [here](https://mike42.me/escpos-printer-db).

## Build process

```bash
yarn install
./node_modules/.bin/gulp
python3 ./tools/import_database.py
```

## Hosting

The site is static, so no server-side components are required. Simply upload
`dist/` and `index.html` to the target server.

