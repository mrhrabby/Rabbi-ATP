
import { GitHubConfig } from '../types';

export const pushToGitHub = async (config: GitHubConfig, content: any) => {
  const { token, owner, repo, path, branch } = config;
  
  if (!token || !owner || !repo) {
    console.error("GitHub configuration is incomplete");
    return false;
  }

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const jsonContent = JSON.stringify(content, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));

    // 1. Get current file SHA (required for update)
    const getResponse = await fetch(`${url}?ref=${branch}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let sha = "";
    if (getResponse.status === 200) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }

    // 2. Update or Create file
    const putResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Admin Update: ${new Date().toLocaleString()}`,
        content: base64Content,
        sha: sha || undefined,
        branch: branch
      })
    });

    if (putResponse.ok) {
      console.log("GitHub Sync Successful");
      return true;
    } else {
      const errorData = await putResponse.json();
      console.error("GitHub Sync Failed:", errorData.message);
      return false;
    }
  } catch (error) {
    console.error("Error syncing with GitHub:", error);
    return false;
  }
};
