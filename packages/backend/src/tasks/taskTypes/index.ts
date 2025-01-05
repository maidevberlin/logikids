import { TaskTypeRegistry } from '../utils/registry';
import { multipleChoiceType } from './multipleChoice';
import { yesNoType } from './yesNo';

export function initializeTaskTypes() {
  const registry = TaskTypeRegistry.getInstance();
  registry.register(multipleChoiceType);
  registry.register(yesNoType);
}

export {
  multipleChoiceType,
  yesNoType
}; 