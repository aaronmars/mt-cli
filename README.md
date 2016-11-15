## mt-cli
A command line application for querying a MindTouch site.

### Usage:
`node index.js [--host <host> --key <api_key> --secret <token>]`

#### The following options are supported to initialize the app:
- --host: The MindTouch site to connect to. EX: `http://mysite.mindtouch.us`
- --key: The API key to use for the connection to the site. Must be set up in the site's control panel integrations as a "server key".
- --secret: The secret token associated with the API key.
If these parameters are omitted, interactive prompts will request them.

### Commands
Once successfully connected, the application will accept commands to query the MindTouch site.

To see the commands supported, type `help`.
