# delete-gae-version-action

![Build Status](https://github.com/vijayp23/delete-gae-version-action/workflows/Test%20Action/badge.svg)

This action will allow you to delete [Google App Engine](https://cloud.google.com/appengine) versions which do not receive any traffic.

## Usage
```yaml
- name: Delete GAE versions
  uses: vijayp23/delete-gae-version-action@1.0.0
  with:
    service-account: ${{ secrets.SERVICE_ACCOUNT }}
    project-id: ${{ secrets.PROJECT_ID }}
    service-name: ${{ secrets.SERVICE_NAME }}
    # Optional, default is 0
    retain-versions: 1
    # Optional, default is false
    debug: false
```
## Inputs

**Required**
* `service-account`: service account key which will be used for authentication
    *  [Create a service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)
    * Encode service account key as `base64` string 
        - `cat service-account-key.json | base64` on Linux or macOS
    * Store `base64` value in[ GitHub secret](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)

* `project-id`: GCP project id in which GAE service is available

* `service-name`: name of the GAE service

**Optional**
* `retain-versions`: number of versions to be retained (not deleted). Versions are ordered based on last deployed date. This option will allow to keep latest versions
* `debug`: test action and check version details

## Note
* You cannot delete a version of a service that is currently receiving traffic


