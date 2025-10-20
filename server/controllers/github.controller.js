import axios from "axios";

/**
 * Fetch GitHub user profile and repository data
 * @route GET /api/github/:username
 */
export const getGitHubProfile = async (req, res) => {
  try {
    const {username} = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "GitHub username is required",
      });
    }

    // Fetch user profile
    const profileResponse = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          "User-Agent": "SmartNShine-Resume-Builder",
        },
      }
    );

    const profile = profileResponse.data;

    // Fetch user repositories
    const reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          "User-Agent": "SmartNShine-Resume-Builder",
        },
      }
    );

    const repos = reposResponse.data;

    // Fetch organizations (for experience)
    let organizations = [];
    try {
      const orgsResponse = await axios.get(
        `https://api.github.com/users/${username}/orgs`,
        {
          headers: {
            "User-Agent": "SmartNShine-Resume-Builder",
          },
        }
      );
      organizations = orgsResponse.data;
    } catch (error) {
      console.log("Could not fetch organizations");
    }

    // Get top 5 repositories by stars
    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || "No description provided",
        language: repo.language || "N/A",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        topics: repo.topics || [],
      }));

    // Calculate dominant languages
    const languageCount = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });

    const dominantLanguages = Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([language, count]) => ({
        name: language,
        count: count,
        percentage: Math.round((count / repos.length) * 100),
      }));

    // Extract experience from organizations and repositories
    const experience = [];

    // Add organization experience
    organizations.forEach((org) => {
      experience.push({
        company: org.login,
        position: "Contributor",
        description: `Active contributor to ${org.login} organization`,
        logo: org.avatar_url,
        url: `https://github.com/${org.login}`,
      });
    });

    // Extract notable projects as experience (repos with >10 stars or forks)
    const notableRepos = repos
      .filter(
        (repo) =>
          !repo.fork && (repo.stargazers_count >= 10 || repo.forks_count >= 5)
      )
      .slice(0, 5);

    notableRepos.forEach((repo) => {
      experience.push({
        company: "Open Source",
        position: `${repo.name} - Creator/Maintainer`,
        description: repo.description || "Open source project",
        period: new Date(repo.created_at).getFullYear().toString(),
        highlights: [
          `⭐ ${repo.stargazers_count} stars`,
          `🔱 ${repo.forks_count} forks`,
          `Language: ${repo.language || "Multiple"}`,
        ],
        url: repo.html_url,
      });
    });

    // Extract certifications/achievements
    const achievements = [];

    // Add repository milestones as achievements
    if (repos.length >= 50) {
      achievements.push({
        title: "Prolific Open Source Contributor",
        description: `Created and maintained ${repos.length}+ public repositories`,
        date: new Date().getFullYear().toString(),
      });
    }

    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );
    if (totalStars >= 100) {
      achievements.push({
        title: "Community Recognition",
        description: `Earned ${totalStars}+ stars across projects`,
        date: new Date().getFullYear().toString(),
      });
    }

    if (profile.followers >= 50) {
      achievements.push({
        title: "Developer Influencer",
        description: `${profile.followers}+ followers on GitHub`,
        date: new Date().getFullYear().toString(),
      });
    }

    // Add language expertise badges
    if (dominantLanguages.length > 0) {
      const topLang = dominantLanguages[0];
      achievements.push({
        title: `${topLang.name} Expert`,
        description: `Primary language in ${topLang.percentage}% of projects`,
        date: new Date().getFullYear().toString(),
      });
    }

    // Structure response data
    const extractedData = {
      profile: {
        username: profile.login,
        name: profile.name || profile.login,
        avatar: profile.avatar_url,
        bio: profile.bio || "No bio available",
        location: profile.location || "Not specified",
        company: profile.company || null,
        blog: profile.blog || null,
        email: profile.email || null,
        followers: profile.followers,
        following: profile.following,
        publicRepos: profile.public_repos,
        createdAt: profile.created_at,
        githubUrl: profile.html_url,
      },
      topRepositories: topRepos,
      experience: experience,
      certifications: achievements,
      skills: {
        languages: dominantLanguages,
        totalRepos: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
      },
      stats: {
        totalRepos: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
        mostUsedLanguage: dominantLanguages[0]?.name || "N/A",
      },
    };

    res.status(200).json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error("GitHub API Error:", error.message);

    // Handle different error types
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please check the username and try again.",
      });
    }

    if (error.response?.status === 403) {
      return res.status(429).json({
        success: false,
        message: "GitHub API rate limit exceeded. Please try again later.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch GitHub data. Please try again.",
      error: error.message,
    });
  }
};
