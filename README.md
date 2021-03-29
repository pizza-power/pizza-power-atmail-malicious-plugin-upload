# pizza-power-atmail-malicious-plugin-upload

Use this with the well known XSS in Atmail. Victim must be logged into the webmail and admin console. Host this file on your server. Create the base64 version of your plugin with the following command:

```
cat plugin.tgz | base64 -w0
```

Don't foget to change atmail to the victim's ip address or hostname. 
