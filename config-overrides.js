const { override } = require("customize-cra");

module.exports = override((config) => {
  // Remove CssMinimizerPlugin to prevent PostCSS errors
  config.optimization.minimizer = config.optimization.minimizer.filter(
    (minimizer) => minimizer.constructor.name !== "CssMinimizerPlugin"
  );
  return config;
});
