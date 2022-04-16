
/* usage: 
node --experimental-fetch fetchforks.js
*/
const fs = require('fs')
const dbName = 'repolist.json'
const upstreamKey = 'upstream_key'

let rawJson = '{}'
try {
	rawJson = fs.readFileSync(dbName, 'utf8')
} catch(e) {
	console.log(dbName+' not found, creating')
}

let repoMap = JSON.parse( rawJson || '{}')
console.log(Object.keys(repoMap).length+' loaded')

function fetchRepo(start, onComplete) {
	console.log('fetching repo page ' + start)
	fetch("https://api.github.com/users/kokizzu/repos?type=forks&per_page=100&page="+start)
	.then(response => response.json())
	.then(res=> {
		try {
			for(let row in res) {
				let repo = res[row]
				const repoName = repo.full_name.split('/')[1]
				repo[upstreamKey] = (repoMap[repoName] || {})[upstreamKey] || '';
				repoMap[repoName] = repo
			}
		} catch(e) {
			console.log(e, res.length, res);
			return onComplete()
		}
		console.log('Saving '+Object.keys(repoMap).length)
		fs.writeFileSync(dbName,JSON.stringify(repoMap,null, 2))
		if(res.length>=100) fetchRepo(start+1)
		/* example: [{
			id: 356935057,
			node_id: 'MDEwOlJlcG9zaXRvcnkzNTY5MzUwNTc=',
			name: 'alvd',
			full_name: 'kokizzu/alvd',
			private: false,
			owner: {
				login: 'kokizzu',
				id: 1061610,
				node_id: 'MDQ6VXNlcjEwNjE2MTA=',
				avatar_url: 'https://avatars.githubusercontent.com/u/1061610?v=4',
				gravatar_id: '',
				url: 'https://api.github.com/users/kokizzu',
				html_url: 'https://github.com/kokizzu',
				followers_url: 'https://api.github.com/users/kokizzu/followers',
				following_url: 'https://api.github.com/users/kokizzu/following{/other_user}',
				gists_url: 'https://api.github.com/users/kokizzu/gists{/gist_id}',
				starred_url: 'https://api.github.com/users/kokizzu/starred{/owner}{/repo}',
				subscriptions_url: 'https://api.github.com/users/kokizzu/subscriptions',
				organizations_url: 'https://api.github.com/users/kokizzu/orgs',
				repos_url: 'https://api.github.com/users/kokizzu/repos',
				events_url: 'https://api.github.com/users/kokizzu/events{/privacy}',
				received_events_url: 'https://api.github.com/users/kokizzu/received_events',
				type: 'User',
				site_admin: false
			},
			html_url: 'https://github.com/kokizzu/alvd',
			description: 'alvd = A Lightweight Vald. A lightweight distributed vector search engine works without K8s.',
			fork: true,
			url: 'https://api.github.com/repos/kokizzu/alvd',
			forks_url: 'https://api.github.com/repos/kokizzu/alvd/forks',
			keys_url: 'https://api.github.com/repos/kokizzu/alvd/keys{/key_id}',
			collaborators_url: 'https://api.github.com/repos/kokizzu/alvd/collaborators{/collaborator}',
			teams_url: 'https://api.github.com/repos/kokizzu/alvd/teams',
			hooks_url: 'https://api.github.com/repos/kokizzu/alvd/hooks',
			issue_events_url: 'https://api.github.com/repos/kokizzu/alvd/issues/events{/number}',
			events_url: 'https://api.github.com/repos/kokizzu/alvd/events',
			assignees_url: 'https://api.github.com/repos/kokizzu/alvd/assignees{/user}',
			branches_url: 'https://api.github.com/repos/kokizzu/alvd/branches{/branch}',
			tags_url: 'https://api.github.com/repos/kokizzu/alvd/tags',
			blobs_url: 'https://api.github.com/repos/kokizzu/alvd/git/blobs{/sha}',
			git_tags_url: 'https://api.github.com/repos/kokizzu/alvd/git/tags{/sha}',
			git_refs_url: 'https://api.github.com/repos/kokizzu/alvd/git/refs{/sha}',
			trees_url: 'https://api.github.com/repos/kokizzu/alvd/git/trees{/sha}',
			statuses_url: 'https://api.github.com/repos/kokizzu/alvd/statuses/{sha}',
			languages_url: 'https://api.github.com/repos/kokizzu/alvd/languages',
			stargazers_url: 'https://api.github.com/repos/kokizzu/alvd/stargazers',
			contributors_url: 'https://api.github.com/repos/kokizzu/alvd/contributors',
			subscribers_url: 'https://api.github.com/repos/kokizzu/alvd/subscribers',
			subscription_url: 'https://api.github.com/repos/kokizzu/alvd/subscription',
			commits_url: 'https://api.github.com/repos/kokizzu/alvd/commits{/sha}',
			git_commits_url: 'https://api.github.com/repos/kokizzu/alvd/git/commits{/sha}',
			comments_url: 'https://api.github.com/repos/kokizzu/alvd/comments{/number}',
			issue_comment_url: 'https://api.github.com/repos/kokizzu/alvd/issues/comments{/number}',
			contents_url: 'https://api.github.com/repos/kokizzu/alvd/contents/{+path}',
			compare_url: 'https://api.github.com/repos/kokizzu/alvd/compare/{base}...{head}',
			merges_url: 'https://api.github.com/repos/kokizzu/alvd/merges',
			archive_url: 'https://api.github.com/repos/kokizzu/alvd/{archive_format}{/ref}',
			downloads_url: 'https://api.github.com/repos/kokizzu/alvd/downloads',
			issues_url: 'https://api.github.com/repos/kokizzu/alvd/issues{/number}',
			pulls_url: 'https://api.github.com/repos/kokizzu/alvd/pulls{/number}',
			milestones_url: 'https://api.github.com/repos/kokizzu/alvd/milestones{/number}',
			notifications_url: 'https://api.github.com/repos/kokizzu/alvd/notifications{?since,all,participating}',
			labels_url: 'https://api.github.com/repos/kokizzu/alvd/labels{/name}',
			releases_url: 'https://api.github.com/repos/kokizzu/alvd/releases{/id}',
			deployments_url: 'https://api.github.com/repos/kokizzu/alvd/deployments',
			created_at: '2021-04-11T17:34:02Z',
			updated_at: '2021-06-04T13:59:23Z',
			pushed_at: '2021-06-04T13:59:20Z',
			git_url: 'git://github.com/kokizzu/alvd.git',
			ssh_url: 'git@github.com:kokizzu/alvd.git',
			clone_url: 'https://github.com/kokizzu/alvd.git',
			svn_url: 'https://github.com/kokizzu/alvd',
			homepage: '',
			size: 851,
			stargazers_count: 0,
			watchers_count: 0,
			language: 'Go',
			has_issues: false,
			has_projects: true,
			has_downloads: true,
			has_wiki: true,
			has_pages: false,
			forks_count: 0,
			mirror_url: null,
			archived: false,
			disabled: false,
			open_issues_count: 0,
			license: {
				key: 'apache-2.0',
				name: 'Apache License 2.0',
				spdx_id: 'Apache-2.0',
				url: 'https://api.github.com/licenses/apache-2.0',
				node_id: 'MDc6TGljZW5zZTI='
			},
			allow_forking: true,
			is_template: false,
			topics: [],
			visibility: 'public',
			forks: 0,
			open_issues: 0,
			watchers: 0,
			default_branch: 'main'
		}
	}] */
	});
}

fetchRepo(14);

