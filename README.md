
# Poor Man's GH fork updater

since old github actions no longer work (or maybe throttled), also cannot install `gh` (it's weirdly gone after `apt install`)

## Usage

```
# update or init database "repolist.json"
node --experimental-fetch fetchforks.js

# use repolist.json to clone and update forks
./clonefetch.rb
```

## Requirement

- Nodejs 17+
- Ruby 2+
