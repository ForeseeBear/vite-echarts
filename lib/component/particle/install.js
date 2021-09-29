import particleModel from './ParticleModel';
import particleView from './ParticleView';
export function install(registers) {
  registers.registerComponentModel(particleModel);
  registers.registerComponentView(particleView);
}
