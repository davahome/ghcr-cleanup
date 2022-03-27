# ghcr-cleanup

A GitHub Action for cleaning up old Containers from ghcr.io

## Notes

This action uses the GitHub API to delete packages. It requires a separate token (optionally delivered as secret). This is due to limitations within GitHub
Actions ([there is no permission "packages: delete"](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)).

## Features

**Delete tagged**

This feature is enabled by default.

**Delete untagged**

To enable this feature set `delete_untagged: 1`

## Parameters

| Parameter                | Feature(s)      | Values                                                                                                                 | Default         |
|--------------------------|-----------------|------------------------------------------------------------------------------------------------------------------------|-----------------|
| `token`                  | All             | A valid token with the permissions `delete:packages` and `write:packages`                                              | None (required) |
| `package`                | All             | The name of the package itself (e.g. the `package` of `thedava/example` would be `example`)                            | None (required) |
| `owner`                  | All             | `owner` is either `user` (literally) for personal repos or `orgs/<Your Org name>` for organization repos               | None (required) |
| `keep_versions`          | Delete Tagged   | Minimum amount of versions to keep (these are usually the most recent versions - exact order is defined by GitHub Api) | `30`            |
| `minimum_days`           | Delete Tagged   | Minimum age (in days) of a tag to be deletable (younger tags will be skipped)                                          | `14`            |
| `skip_tags`              | Delete Tagged   | A comma separated list of tags to keep (e.g. `latest` or `latest,develop,build-123`)                                   | `latest`        |
| `delete_untagged`        | Delete Untagged | Set to `1` to enable deletion of untagged packages                                                                     | `0`             |
| `keep_versions_untagged` | Delete Untagged | Identical to `keep_versions` but this value is only for the deletion of untagged packages                              | `14`            |

**Restrictions:**

The values for `keep_versions` and `keep_versions_untagged` should not be 100 or greater. Otherwise, this action won't delete anything right now.

## Example

**Delete images of the personal user package "ghcr.io/thedava/example" that are older than 14 days (but keep at least 30 versions)**

```yaml
name: Cleanup Registry
on:
    workflow_dispatch:
    registry_package:

jobs:
    delete-images:
        runs-on: ubuntu-latest
        steps:
            -   name: Delete images older than 14 days (but keep at least 30 versions)
                uses: DavaHome/ghcr-cleanup@v0.5
                with:
                    token: ${{ secrets.DELETE_PACKAGES_TOKEN }}
                    package: example
                    owner: user

                    # Configure cleanup of tagged versions
                    minimum_days: 14
                    keep_versions: 30

                    # Configure cleanup of untagged versions
                    delete_untagged: 1
                    keep_versions_untagged: 14
```

For more examples visit https://github.com/davahome/ghcr-cleanup/tree/main/docs



## Token permission requirements

* read:packages
* write:packages
* delete:packages
