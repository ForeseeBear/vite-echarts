
import lightModel from './LightModel';
import lightView from './LightView';
export function install(registers) {
  registers.registerComponentModel(lightModel);
  registers.registerComponentView(lightView);
}
