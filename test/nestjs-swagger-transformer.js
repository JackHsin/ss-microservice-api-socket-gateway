// eslint-disable-next-line @typescript-eslint/no-var-requires
const transformer = require('@nestjs/swagger/plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nestCli = require('../nest-cli.json');

module.exports.name = 'nestjs-swagger-transformer';
// you should change the version number anytime you change the configuration below - otherwise, jest will not detect changes
module.exports.version = 1;

const nestSwaggerOption = {};

if (
  nestCli.compilerOptions &&
  nestCli.compilerOptions.plugins &&
  nestCli.compilerOptions.plugins.length > 0
) {
  const { plugins } = nestCli.compilerOptions;
  if (plugins[0] instanceof Object) {
    const nestSwaggerPlugin = plugins.find(
      (plugin) => plugin.name === '@nestjs/swagger',
    );
    if (nestSwaggerPlugin && nestSwaggerPlugin.options) {
      Object.assign(nestSwaggerOption, nestSwaggerPlugin.options);
    }
  }
}
console.log(nestSwaggerOption);
module.exports.factory = (cs) => {
  return transformer.before(nestSwaggerOption, cs.tsCompiler.program);
};
