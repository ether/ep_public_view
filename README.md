![Publish Status](https://github.com/ether/ep_public_view/workflows/Node.js%20Package/badge.svg) ![Backend Tests Status](https://github.com/ether/ep_public_view/workflows/Backend%20tests/badge.svg)

# Public Search engine indexable pad contents
Let's say you have made loads of awesome content in your pad but search engines haven't indexed it.

ep_public_view serves your pad HTML as static HTML that can be indexed by search engines.

# Usage

Visit the /public/$whateverpadid$ IE http://etherpad.com/public/test endpoint to visit the public representation of your pad.

## Example animated gif of usage if appropriate

## Installing
npm install ep_public_view

or Use the Etherpad ``/admin`` interface.

## Performance
It's advised that you cache the requests made to this endpoint in a reverse proxy such as nginx, varnish or haproxy.

## Settings
Document settings if any

## Testing
Document how to run backend / frontend tests.

### Frontend

Visit http://whatever/tests/frontend/ to run the frontend tests.

### backend

Type ``cd src && npm run test`` to run the backend tests.

## LICENSE
Apache 2.0
