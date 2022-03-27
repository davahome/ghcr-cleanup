# Clean up the registry of an organization


## Delete all untagged images of the organization package "ghcr.io/DavaHome/example"

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
                uses: DavaHome/ghcr-cleanup@v0.5
                with:
                    packages_token: ${{ secrets.PACKAGES_TOKEN }} # The regular ${{ GITHUB_TOKEN }} is not enough. Create a separate token and store it as secret
                    package_name: example
                    owner: orgs/DavaHome # Owner can be an organization as well (but has to be prefixed with "orgs/" then)

                    # Configure cleanup of untagged versions
                    delete_untagged: 1
                    keep_untagged_versions: 0
```

## Delete images of the organization package "ghcr.io/DavaHome/example" that are older than 7 days (but keep at least 5 versions)

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
                uses: DavaHome/ghcr-cleanup@v0.5
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
