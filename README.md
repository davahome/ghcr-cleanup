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
| `packages_token`         | All             | A valid token with the permissions `delete:packages` and `write:packages`                                              | None (required) |
| `package_name`           | All             | The name of the package itself (e.g. the `package_name` of `thedava/example` would be `example`)                       | None (required) |
| `owner`                  | All             | `owner` is either `user` (literally) for personal repos or `orgs/<Your Org name>` for organization repos               | None (required) |
| `keep_versions`          | Delete Tagged   | Minimum amount of versions to keep (these are usually the most recent versions - exact order is defined by GitHub Api) | `30`            |
| `minimum_days`           | Delete Tagged   | Minimum age (in days) of a tag to be deletable (younger tags will be skipped)                                          | `14`            |
| `skip_tags`              | Delete Tagged   | A comma separated list of tags to keep (e.g. `latest` or `latest,develop,build-123`)                                   | `latest`        |
| `delete_untagged`        | Delete Untagged | Set to `1` to enable deletion of untagged packages                                                                     | `0`             |
| `keep_untagged_versions` | Delete Untagged | Identical to `keep_versions` but this value is only for the deletion of untagged packages                              | `14`            |

**Restrictions:**

The values for `keep_versions` and `keep_untagged_versions` should not be 100 or greater. Otherwise, this action won't delete anything right now.

## Examples

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
                uses: DavaHome/ghcr-cleanup@v0.4
                with:
                    packages_token: ${{ secrets.PACKAGES_TOKEN }}
                    package_name: example
                    owner: user

                    # Configure cleanup of tagged versions
                    minimum_days: 14
                    keep_versions: 30

                    # Configure cleanup of untagged versions
                    # Use this if you want to limit your untagged images no matter how old they are
                    #delete_untagged: 1
                    #keep_untagged_versions: 14
```

**Delete all untagged images of the personal user package "ghcr.io/thedava/example"**

```yaml
name: Cleanup Registry
on:
    workflow_dispatch:
    registry_package:

jobs:
    delete-images:
        runs-on: ubuntu-latest
        steps:
            -   name: Delete images older than 7 days (but keep at least 5 versions)
                uses: DavaHome/ghcr-cleanup@v0.4
                with:
                    packages_token: ${{ secrets.PACKAGES_TOKEN }} # The regular ${{ GITHUB_TOKEN }} is not enough. Create a separate token and store it as secret
                    package_name: example
                    owner: orgs/DavaHome # Owner can be an organization as well (but has to be prefixed with "orgs/" then)

                    # Configure cleanup of untagged versions
                    delete_untagged: 1
                    keep_untagged_versions: 0
```

**Delete images of the organization package "ghcr.io/DavaHome/example" that are older than 7 days (but keep at least 5 versions)**

```yaml
name: Cleanup Registry
on:
    workflow_dispatch:
    registry_package:

jobs:
    delete-images:
        runs-on: ubuntu-latest
        steps:
            -   name: Delete images older than 7 days (but keep at least 5 versions)
                uses: DavaHome/ghcr-cleanup@v0.4
                with:
                    packages_token: ${{ secrets.PACKAGES_TOKEN }} # The regular ${{ GITHUB_TOKEN }} is not enough. Create a separate token and store it as secret
                    package_name: example
                    owner: orgs/DavaHome # Owner can be an organization as well (but has to be prefixed with "orgs/" then)

                    # Configure cleanup of tagged versions
                    minimum_days: 7
                    keep_versions: 5

                    # Configure cleanup of untagged versions
                    # Use this if you want to limit your untagged images no matter how old they are
                    #delete_untagged: 1
                    #keep_untagged_versions: 14
```

**Use a matrix to delete multiple packaages**

```yaml
name: Cleanup Registry
on:
    workflow_dispatch:
    registry_package:

jobs:
    delete-images:
        runs-on: ubuntu-latest
        strategy:
            fail-fast: false
            matrix:
                package: [ "example-1", "example-2", "example-3" ]
        steps:
            -   name: Delete images older than 7 days (but keep at least 5 versions)
                uses: DavaHome/ghcr-cleanup@v0.4
                with:
                    packages_token: ${{ secrets.PACKAGES_TOKEN }}
                    package_name: ${{ matrix.package }}
                    owner: orgs/DavaHome

                    # Configure cleanup of tagged versions
                    minimum_days: 7
                    keep_versions: 50

                    # Configure cleanup of untagged versions
                    delete_untagged: 1
                    keep_untagged_versions: 5
```

## Token permission requirements

* read:packages
* write:packages
* delete:packages
