# Enable and disable features of ghcr-cleanup

## Only delete untagged packages (keep all tagged packages)

```yaml
name: Remove untagged packages from registry
on:
    workflow_dispatch:
    registry_package:

jobs:
    delete-images:
        runs-on: ubuntu-latest
        steps:
            -   name: Delete packages
                uses: davahome/ghcr-cleanup@v1.1
                with:
                    token: ${{ secrets.DELETE_PACKAGES_TOKEN }}
                    package: example
                    owner: user

                    # Disable cleanup of tagged versions
                    delete_tagged: 0
                    
                    # Configure cleanup of untagged versions
                    delete_untagged: 1
                    keep_versions_untagged: 0
```

## Only delete tagged packages (keep all untagged packages)

```yaml
name: Remove tagged packages from registry
on:
    workflow_dispatch:
    registry_package:

jobs:
    delete-images:
        runs-on: ubuntu-latest
        steps:
            -   name: Delete packages
                uses: davahome/ghcr-cleanup@v1.1
                with:
                    token: ${{ secrets.DELETE_PACKAGES_TOKEN }}
                    package: example
                    owner: user

                    # Configure cleanup of tagged versions
                    #delete_tagged: 1 -- This is the default. You don't need to specify it explicitly
                    minimum_days: 7
                    keep_versions: 5

                    # Disable cleanup of untagged versions
                    # delete_untagged: 0 -- This is the default. You don't need to specify it explicitly
```
