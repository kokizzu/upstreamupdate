#!/usr/bin/env ruby

=begin
gem install json
=end

require 'json'

PWD = Dir.pwd

def runcmd cmd
  puts cmd
  res = `#{cmd}`
  puts res
  return res
end

UPSTREAM_KEY = 'upstream_key' # change on js also if this changed
SSH_URL_KEY = 'ssh_url'
DEFAULT_BRANCH_KEY = 'default_branch'
HTML_URL_KEY = 'html_url'
PULL_UPSTREAM_RES_KEY = 'upstream_pull_result'
MERGE_UPSTREAM_RES_KEY = 'upstream_merge_result'

DBNAME = 'repolist.json'
rawJson = File.read(DBNAME)
jsonMap = JSON.load(rawJson)
jsonMap.sort_by{ rand() }.each do |k,v|
  Dir.chdir PWD
  if Dir.exist?"../#{k}"
    Dir.chdir "../#{k}"
  else 
    Dir.chdir '..'
    runcmd "git clone --depth 1 #{v[SSH_URL_KEY]}"
    next unless Dir.exists? "#{k}"
    Dir.chdir "#{k}"
  end
  upstream = v[UPSTREAM_KEY]
  upstream ||= ''
  if upstream == ''
    cacheFile = "/tmp/#{k}.html"
    runcmd "curl '#{v[HTML_URL_KEY]}' > '#{cacheFile}'" unless File.exist? cacheFile
    upstream = runcmd "cat #{cacheFile} | grep 'forked from' | cut -d '>' -f 2 | cut -d '<' -f 1"
    upstream.strip!
  end
  
  runcmd "git fetch"
  next if upstream == ''
  
  runcmd "git remote remove upstream"
  runcmd "git remote add upstream 'git@github.com:#{upstream}.git'"
  v[PULL_UPSTREAM_RES_KEY] = runcmd "git pull upstream #{v[DEFAULT_BRANCH_KEY]}"
  # TODO: maybe check upstream branch names first?
  v[MERGE_UPSTREAM_RES_KEY] = runcmd "git merge --no-edit upstream/#{v[DEFAULT_BRANCH_KEY]}" 
  runcmd "git push"
  
  # save state
  puts "saving #{upstream}"
  v[UPSTREAM_KEY] = upstream
  jsonMap[k] = v
  Dir.chdir PWD
  rawJson = jsonMap.to_json
  File.write(DBNAME,rawJson)
end

# simpler aproach if already cloned
# for branch in $(git ls-remote --heads upstream|sed 's#^.*refs/heads/##'); do git push origin refs/remotes/upstream/$branch:refs/heads/$branch; done
