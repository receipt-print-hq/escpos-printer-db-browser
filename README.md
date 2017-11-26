# escpos-print-db browser

[![Build Status](https://travis-ci.org/receipt-print-hq/escpos-printer-db-browser.svg?branch=master)](https://travis-ci.org/receipt-print-hq/escpos-printer-db-browser)

This is the source for the online version of the receipt printer database.

## Build process

```bash
yarn install
./node_modules/.bin/gulp
python3 ./tools/import_database.py
```

## Hosting

The site is static, so no server-side components are required. Simply upload
`dist/` and `index.html` to the target server.

