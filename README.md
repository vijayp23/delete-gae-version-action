# delete-gae-version-action

This action will allow you to delete [Google App Engine](https://cloud.google.com/appengine) versions which do not receive any traffic.

## Usage
```yaml
- name: Delete GAE versions
  uses: vp-ework/delete-gae-version-action@master
  with:
    service-account: ${{ secrets.SERVICE_ACCOUNT }}
    project-id: ${{ secrets.PROJECT_ID }}
    service-name: ${{ secrets.SERVICE_NAME }}
    # Optional, default is 0
    retain-versions: 1
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
* `retain-versions`: number of versions to be retained (not deleted). Versions are ordered based on last deployed date. This option will allow to keep latest versions.

## Note
* You cannot delete a version of a service that is currently receiving traffic


