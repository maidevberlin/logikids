import 'reflect-metadata';
import { container } from 'tsyringe';
import { router, protectedProcedure } from '../trpc';
import { conceptsInputSchema } from './schemas';
import { ConceptsController } from './controller';

const getController = () => container.resolve(ConceptsController);

export const conceptsRouter = router({
  get: protectedProcedure.input(conceptsInputSchema).query(async ({ input }) => {
    return getController().getConcepts(input);
  }),
});
