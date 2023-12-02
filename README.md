# Email Backend (Google Cloud Function)

Simple service that provides an email backend for contact forms and other applications. The services accepts HTML form data (`x-www-form-urlencoded`) and sends it to a SMTP mail server using [Nodemailer](https://nodemailer.com/smtp/). The service can be deployed as [Google Cloud Function](https://cloud.google.com/functions/?hl=en), which are usually very cheap to run.

## Basic usage

This script is written in JavaScript and requires [Node.js](https://nodejs.org/en/).

- Clone the repository: `git clone git@github.com:stekhn/email-backend-function.git`
- Navigate to to to folder: `cd email-backend-function`
- Install dependencies: `npm install`
- [Create a configuration file](#configuration-file)
- [Deploy to Google Cloud Functions](#google-cloud-deployment)

## Configuration file

Add a `.env` configuration by copying `.env.template`:

```console
cp .env.template .env
```

Open the `.env` file and add your SMTP server settings and credentials. Example:

```console
EMAIL_SMTP_HOST=smtp.my-mail-provider.com
EMAIL_SMTP_PORT=465
EMAIL_USER=my.name@my-mail-provider.com
EMAIL_PASSWORD=password123
```

This assumes, that your SMTP server can communicate securely using SSL. If your mail provider or service doesn't support SSL, you might need to update the [Nodemailer configuration](https://nodemailer.com/smtp/) in the the script ([index.js](./index.js)).

## Google Cloud deployment

These instructions assume that you already have a Google Cloud account and set up a billing account. To use the commands below, you'll need to install [gcloud](https://cloud.google.com/sdk/install) (CLI) and [link](https://cloud.google.com/sdk/docs/initializing) it to your account.

### Create project

Create a new Google Cloud project, if you don't have a project already:

```console
gcloud projects create my-project
```

Set the new project as your current project:

```console
gcloud config set project my-project
```

### Deploy function

Enable Google Cloud Functions for the current project:

```console
gcloud services enable cloudfunctions.googleapis.com
```

Select the [region](https://cloud.google.com/compute/docs/regions-zones) (data center) where your function should be deployed:

```console
gcloud config set functions/region europe-west3
```

Deploy the function as a Node.js application with an HTTP trigger:

```console
gcloud functions deploy email-backend-function \
  --region=europe-west3 \
  --runtime=nodejs18 \
  --entry-point=send \
  --trigger-http \
  --security-level=secure-always \
```

Allow public HTTP requests to the function by answering `y` (yes)):

```console
Allow unauthenticated invocations of new function [githubGreenWave]? (y/N)?
```

Setting up the functions may take a minute. Once the function is created successfully, you'll get an URL that can be used in your form or application. Example: <https://europe-west3-my-project.cloudfunctions.net/email-backend>

## Local testing

If happen to fork this repository, it might be wise to test the changes to your code on your local machine first. The best way to test the script locally is to use the included [Google Functions Framework](https://cloud.google.com/functions/docs/functions-framework).

Install the Google Functions Framework and other dependencies:

```console
npm install
```

Start the function by running:

```console
npm run start
```

This should start a local server on <http://localhost:8080>. Use the [email form](./test/form.html) in the `test` folder to validate if the function is working correctly.
