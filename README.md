To build project: npm run postinstall
To start server: npm run serve

To import Product Catalog data from spreadsheet:

CURRENT DESIGN IN POSTGRES:
prepare UNSPSC spreadsheet (Data tab has a 'Remove Duplicates' feature that helps)

To populate Commodity table:
run `ruby ./lib/commodity_import.rb` locally

To push local db to Heroku:
heroku pg:push postgres://localhost/tonicapi_development postgresql-corrugated-38351

OLDER DESGN:
Dev DB:
psql=# COPY unspsc_nodes(id,cat_name,created_at,updated_at) FROM '/Users/byofuel/code/misc-tonicmart/UNSPSC/UNSPSC-EXPORT-8digit.csv' DELIMITER ',' CSV;
psql=# COPY commodities(commodity_name,id,created_at,updated_at) FROM '/Users/byofuel/code/misc-tonicmart/UNSPSC/UNSPSC-COMM-EXPORT.csv' DELIMITER ',' CSV;

Prod DB Heroku:
heroku pg:credentials provides string for connecting to the heroku db outside of heroku's tools
(host name is not guaranteed to remain constant)

plug credentials into this BASH command: (based on https://gist.github.com/jboesch/5605747)
PGPASSWORD=pw psql -h ec2-54-243-253-17.compute-1.amazonaws.com -U xbncgknuihxenu d7f1r434o2or6o -c "\copy unspsc_nodes(id,cat_name,created_at,updated_at) FROM '/Users/byofuel/code/misc-tonicmart/UNSPSC/UNSPSC-EXPORT.csv' DELIMITER ',' CSV"

ORIGINAL DESIGN:
last two columns should be product description and price
columns before the last two represent the tree branches product is categorized under
copy the spreadsheet data into https://shancarter.github.io/mr-data-converter/, with output as JSON- Row Arrays
paste the results into index.es6, preloadedState.rawCatalog =