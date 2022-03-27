# Use a matrix to delete multiple packages

If you have multiple packages in your repository you may want to clear all packages at once. You can achieve this by using a matrix


## Delete multiple packages in the same repository

```yaml
name: Cleanup Registry
on:
    workflow_dispatch:
    registry_package:
        
concurrency:
    group: delete-images

jobs:
    delete-images:
        runs-on: ubuntu-latest
        strategy:
            fail-fast: false
            matrix:
                package: [ "example-1", "example-2", "example-3" ]
        steps:
            -   name: Delete images older than 7 days (but keep at least 5 versions)
                uses: DavaHome/ghcr-cleanup@v0.5
                with:
                    token: ${{ secrets.DELETE_PACKAGES_TOKEN }}
                    package: ${{ matrix.package }}
                    owner: orgs/DavaHome

                    # Configure cleanup of tagged versions
                    minimum_days: 7
                    keep_versions: 50

                    # Configure cleanup of untagged versions
                    delete_untagged: 1
                    keep_versions_untagged: 5
```


## Delete multiple packages from multiple repository

The provided token needs access to all those defined repositories

```yaml
name: Cleanup Registry
on:
    workflow_dispatch:
    registry_package:
        
concurrency:
    group: delete-images

jobs:
    delete-images:
        runs-on: ubuntu-latest
        strategy:
            fail-fast: false
            matrix:
                include:
                    - package: "example"
                      owner: "orgs/organization1"
                      
                    - package: "example2"
                      owner: "orgs/organization1"
                      
                    - package: "example"
                      owner: "orgs/organization2"
        steps:
            -   name: Delete images older than 7 days (but keep at least 5 versions)
                uses: DavaHome/ghcr-cleanup@v0.5
                with:
                    token: ${{ secrets.DELETE_PACKAGES_TOKEN }}
                    package: ${{ matrix.package }}
                    owner: ${{ matrix.owner }}

                    # Configure cleanup of tagged versions
                    minimum_days: 7
                    keep_versions: 50

                    # Configure cleanup of untagged versions
                    delete_untagged: 1
                    keep_versions_untagged: 5
```
