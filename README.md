# Devcamper-api-ts

_devcamper-api project from Brad Traversy https://github.com/bradtraversy/devcamper-api but written with Typescript_

## Usage

Rename "env.env" to "env" and update the values/settings to your own

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

```
# Destroy all data
npm run seeder -- -d

# Import all data
npm run seeder -- -i
```
