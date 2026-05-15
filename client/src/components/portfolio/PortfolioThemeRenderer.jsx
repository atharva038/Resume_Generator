import adaptPortfolioData from "./themes/adaptPortfolioData";
import {getPortfolioTheme} from "./themes/themeRegistry";

const PortfolioThemeRenderer = ({
  portfolio,
  resume,
  projects,
  mode = "public",
  onContactClick,
  onProjectClick,
  onResumeClick,
}) => {
  const theme = getPortfolioTheme(portfolio?.themeId);
  const ThemeComponent = theme.component;
  const data = adaptPortfolioData({
    portfolio,
    resume,
    projects,
    mode,
    onContactClick,
    onProjectClick,
    onResumeClick,
  });

  return <ThemeComponent data={data} />;
};

export default PortfolioThemeRenderer;
