import particleModel from './particleModel';
import particleView from './particleView';
export function install(registers) {
  registers.registerComponentModel(particleModel);
  registers.registerComponentView(particleView);
}
