import BackgroundModel from "./BackgroundModel";
import BackgroundView from "./BackgroundView";

export function install(registers) {
    registers.registerComponentModel(BackgroundModel)
    registers.registerComponentView(BackgroundView)
}
