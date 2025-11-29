import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { SubjectsService } from './service';
import type { SubjectsInput, SubjectsResponse } from './types';

@injectable()
export class SubjectsController {
  constructor(@inject(SubjectsService) private subjectsService: SubjectsService) {}

  getAll(input: SubjectsInput): SubjectsResponse {
    const subjects = this.subjectsService.getAll(input);
    return { subjects };
  }
}
