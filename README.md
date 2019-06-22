# Meeting Room Traffic Lights

A simple and fun way to show the status of meeting rooms.

![Whiteboard Illustration](docs/images/meeting_lights_whiteboard.jpg)

Do meetings always run long in your company? Do you find yourself waiting outside of a meeting room wishing your coworkers would wrap it up? Do you wish there was a simple way to look at a meeting room and know if it is booked? Do you just want a fun way to spruce up your boring meeting rooms?

If so, Meeting Traffic Lights are the solution for you! Just buy some smart lightbulbs and stands, and run this app to 

## Requirements

- Meeting Rooms listed as Resources in Google Calendar ([more](https://support.google.com/a/answer/1686462))
- A Google Cloud Service Account 
    - Needs the following scopes: _calendar.readonly_, _admin.directory.resource.calendar.readonly_
    - Uses a `service_account_key.json` file
    - May require admin access to your organization's G Suite account.
- An AWS Account
    - With credentials to deploy a [serverless](https://serverless.com/) application to AWS Lambda.
- LIFX RGB Smart Lightbulbs (plus stands/lamps)
- A LIFX Api Token

## Setup

### Preparing Google Calendar

A "service account" is used to communicate with the Google Calendar API. Their [documentation](https://developers.google.com/identity/protocols/OAuth2ServiceAccount) best describes how to do this. The basic steps I took were the following:

1. Create a project in the Google APIs [dashboard](https://console.developers.google.com/apis/dashboard) to hold the service account.
1. Create the service account in the [IAM & admin](https://console.developers.google.com/iam-admin/serviceaccounts) section of your project.
1. Delegate domain-wide authority to the service account.
1. Log into the G Suite [Admin](http://admin.google.com/) section (as an admin user) to authorize the service account for API scopes. For listing calendar information, you need the _calendar.readonly_ scope: `https://www.googleapis.com/auth/calendar.readonly`. For listing users and rooms in the domain, you need the _admin.directory.user.readonly_ scope: `https://www.googleapis.com/auth/admin.directory.user.readonly`.
1. Go to the [credentials page](https://console.developers.google.com/apis/credentials) in the Google APIs dashboard for your project, click **Create credentials > Service account key**, select your service account and JSON as the key type, and click **Create**. This will download your credentials JSON file containing your private key which will be used in Google API SDKs.                                                                                                                                                                                                                                                                                                                                                                         

To connect, place your `service_account_key.json` file inside this application's _config/_ directory (it is git-ignored).

> You can test that it works by running the GoogleCalendarClient integration test: `jest GoogleCalendarClient`.

Lastly, you will need to choose a "subject" to query Google Calendar, which is the email address of a user in your organization who can see the calendars of your meeting rooms (I used mine). This is set via the `GOOGLE_CALENDAR_SUBJECT` environment variable.

### Deploying the Application

Deploys are done using [serverless](https://github.com/serverless/serverless). You just need to run the deploy command in an environment with valid AWS credentials and permissions to deploy the serverless stack to Lambda.

```bash
serverless deploy       # Deploy using serverless
```

### Configuration
You MUST put a valid Google _service_account_key.json_ file in the _config/_ directory.

The following configs are set via environment variables or a _config/local.yml_ file (see [node-config](https://github.com/lorenwest/node-config))

- GOOGLE_CALENDAR_SUBJECT 
    - (required) The email of the account to query Google Calendar.
- LIFX_TOKEN
    - (required) If using LIFX bulbs, this is required to control the lightbulbs over the itnernet. 

### Installing the Bulbs

Installing the bulbs is simple! We used the [LIFX Mini Color](https://www.lifx.com/collections/featured-products/products/lifx-mini-color-e26) bulb, and the [INJUICY](https://www.amazon.com/gp/product/B01FZKKTU0) bulb stands. The application will automatically pair rooms to bulbs based on the label you give the bulb in the [LIFX phone app](https://www.lifx.com/pages/go).

For example, we synced a bulb to our meeting room called "The Studio" (in Google Calendar) by labeling the bulb "Studio" (it matches based on substring):

![The Studio](./docs/images/studio_pic.jpg)

You also need to get a [LIFX API Token](https://api.developer.lifx.com/), which is set via the `LIFX_TOKEN` environment variable. This lets the application remotely control the bulbs.

---

## Development

#### Extending the Application

Feel free to fork the repo and add support for different bulb types or new features. 
To use different bulb types, just implement the _Bulb_ and _BulbNetwork_ interfaces (see _src/app/bulbNetworks/_). 
To use different calendar sources, implement a new calendar client with the same interface as _GoogleCalendarClient_.

#### Overriding Bulb Labels

If you are unable to map light bulb label to room name (such as when using MagicHome bulbs), you can also create a _config/local.yml_ file and set the `roomBulbLabelOverrides` property. That maps room name (key) to bulb label (value) and overrides the auto-mapping.

#### Installing on a LAN

You can also run the application from a Raspberry Pi inside of your network. This can be useful if using bulbs that can only be contolled via LAN (i.e. MagicHome bulbs).
