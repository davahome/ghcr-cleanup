# Clean up the registry of an organization


## Delete all untagged images of the organization package "ghcr.io/davahome/example"

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
                uses: davahome/ghcr-cleanup@v1
                with:
                    token: ${{ secrets.DELETE_PACKAGES_TOKEN }}
                    package: example
                    owner: orgs/davahome # Owner can be an organization as well (but has to be prefixed with "orgs/" then)

                    # Configure cleanup of untagged versions
                    delete_untagged: 1
                    keep_versions_untagged: 0
```

## Delete images of the organization package "ghcr.io/davahome/example" that are older than 7 days (but keep at least 5 versions)

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
                uses: davahome/ghcr-cleanup@v1
                with:
                    token: ${{ secrets.DELETE_PACKAGES_TOKEN }}
                    package: example
                    owner: orgs/davahome # Owner can be an organization as well (but has to be prefixed with "orgs/" then)

                    # Configure cleanup of tagged versions
                    minimum_days: 7
                    keep_versions: 5

                    # Configure cleanup of untagged versions
                    # Use this if you want to limit your untagged images no matter how old they are
                    #delete_untagged: 1
                    #keep_versions_untagged: 14
```
