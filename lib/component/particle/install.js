// import { use } from '../../extension';
// import { install as installParticle } from './installParticle';

// export function install(registers) {
//   use(installParticle);
// }
import particleModel from './particleModel';
import particleView from './particleView';
export function install(registers) {
  registers.registerComponentModel(particleModel);
  // registers.registerComponentView(particleView);
}
