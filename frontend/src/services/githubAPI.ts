
import { Octokit } from "@octokit/rest";

const GITHUB_USERNAME = 'jeonghyeonme';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// Function to get all repositories for the user
async function getAllRepositories() {
  const repos = await octokit.paginate(octokit.repos.listForUser, {
    username: GITHUB_USERNAME,
    type: 'owner',
  });
  return repos;
}

export const githubAPI = {
  // Get total number of stars on all repositories
  getTotalStars: async () => {
    const repos = await getAllRepositories();
    const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    return totalStars;
  },

  // Get total number of commits in the last year
  getCommitCountThisYear: async () => {
    const repos = await getAllRepositories();
    let totalCommits = 0;

    for (const repo of repos) {
      try {
        const { data: commitActivity } = await octokit.repos.getCommitActivityStats({
          owner: GITHUB_USERNAME,
          repo: repo.name,
        });
        
        if (commitActivity && Array.isArray(commitActivity)) {
          const commitsThisYear = commitActivity.reduce((acc, week) => acc + week.total, 0);
          totalCommits += commitsThisYear;
        }
      } catch (error) {
        // Some repos might not have stats available (e.g., empty repos)
        // console.warn(`Could not get commit activity for ${repo.name}:`, error);
      }
    }
    return totalCommits;
  },

  // Get commit activity for the last 6 months for the chart
  getCommitActivityForChart: async () => {
    const repos = await getAllRepositories();
    const monthlyCommits = new Array(6).fill(0);
    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const today = new Date();
    
    // Get the last 6 months, including the current month
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);
      return { year: d.getFullYear(), month: d.getMonth() };
    }).reverse();

    for (const repo of repos) {
      try {
        const { data: commitActivity } = await octokit.repos.getCommitActivityStats({
          owner: GITHUB_USERNAME,
          repo: repo.name,
        });

        if (commitActivity && Array.isArray(commitActivity)) {
          for (const week of commitActivity) {
            const weekDate = new Date(week.week * 1000);
            const weekYear = weekDate.getFullYear();
            const weekMonth = weekDate.getMonth();

            const monthIndex = lastSixMonths.findIndex(m => m.year === weekYear && m.month === weekMonth);

            if (monthIndex !== -1) {
              monthlyCommits[monthIndex] += week.total;
            }
          }
        }
      } catch (error) {
        // console.warn(`Could not get commit activity for ${repo.name}:`, error);
      }
    }

    return lastSixMonths.map((m, i) => ({
      month: monthNames[m.month],
      commits: monthlyCommits[i],
    }));
  },
};
