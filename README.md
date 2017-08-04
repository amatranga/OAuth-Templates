# OAuth Templates

Basic templates for OAuth. Currently supports:

- Facebook OAuth
- Google OAuth

## Table of Contents

1. [Usage](#usage)
2. [Requirements](#requirements)
3. [Development](#development)
   - [Installing Dependencies](#installing-project-dependencies)
   - [Starting your Environment](#starting-your-environment)

## Usage

OAuth-Templates is intended to provide a starting point for OAuth. 


## Requirements

- Node 7.10.x
- Mongo 3.4

## Development

### Installing Project Dependencies

After forking the repo...

```
git clone https://github.com/[YOUR_GITHUB_HANDLE]/OAuth-Templates.git
cd OAuth-Templates
npm install
```

### Starting your Environment

First, make sure MongoDB is running. From your terminal:

```
cd /path/to/your/MongoDB
Mongod.exe
```

Now, rename auth.example.js to auth.js, and add in your keys. Once you have
done that, in your terminal, from the root of your OAuth-Template directory:

```
npm start:<OAuth_provider>
```

*Note* Windows users may have to run:

```
npm run start:<OAuth_provider>
```

OAuth-Templates launches on port 3000 by default.
