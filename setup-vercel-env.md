# Vercel Environment Variable Setup

## Step 1: Go to your Vercel project settings
https://vercel.com/varun13125s-projects/kraft-mortgages/settings/environment-variables

## Step 2: Add new environment variable

Click "Add Variable" and enter:

**Key:** `FIREBASE_SERVICE_ACCOUNT_JSON`

**Value:** (copy the entire line below, it's all one line)
```


```

## Step 3: Select environments
Make sure to check all three boxes:
- ✅ Production
- ✅ Preview  
- ✅ Development

## Step 4: Save
Click "Save" button

## Step 5: Redeploy
After saving, you need to trigger a new deployment:
1. Go to the Deployments tab
2. Click on the three dots (...) next to the latest deployment
3. Select "Redeploy"
4. Click "Redeploy" in the dialog

## Important Notes:
- The value must be entered as ONE SINGLE LINE (no line breaks)
- Do NOT add any quotes around the value
- The JSON already contains escaped newlines (\n) for the private key
- After adding, wait 1-2 minutes for the deployment to complete

## Test the setup:
Visit: https://www.kraftmortgages.ca/api/test-firebase-simple

You should see `"hasServiceAccountJson": true` in the response.