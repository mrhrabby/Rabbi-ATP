
import { GitHubConfig } from '../types';

export const pushToGitHub = async (config: GitHubConfig, data: any) => {
  const { token, owner, repo, path } = config;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    // 1. Get the current file SHA if it exists
    let sha = "";
    const getRes = await fetch(url, {
      headers: { Authorization: `token ${token}` }
    });
    
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // 2. Prepare the content
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

    // 3. Push to GitHub
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Sync data from ContentHub Pro Admin',
        content,
        sha: sha || undefined
      })
    });

    if (!putRes.ok) {
      const error = await putRes.json();
      throw new Error(error.message || 'Failed to push to GitHub');
    }

    return true;
  } catch (error) {
    console.error("GitHub Sync Error:", error);
    throw error;
  }
};
