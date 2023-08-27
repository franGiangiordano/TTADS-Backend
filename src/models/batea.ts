import mongoose from 'mongoose';
import z from 'zod';

const BateaSchema = new mongoose.Schema(
  {
   patent: {
     type: String,
     required: true,
     unique:true,
    },
  },
  {
    versionKey: false,
  }
);

const bateaSchemaValidator = z.object({
  patent: z.string({ 
    invalid_type_error: 'La patente tiene que ser de tipo string',
    required_error: 'La patente es requerida.'//,
   // validate: value => /^[A-Z0-9]{2,3}-?[A-Z0-9]{2,4}$/i.test(value) ? undefined : 'Formato de patente inválido'
  }).refine((value) => /^[A-Z0-9]{2,3}-?[A-Z0-9]{2,4}$/i.test(value),'Formato de patente inválido')
});

//IMPORTANTE: Esta expresión regular verifica que la patente conste de 2 a 3 letras mayúsculas o dígitos, seguidos opcionalmente por un guión ("-"), y luego 2 a 4 letras mayúsculas o dígitos. El modificador i al final hace que la expresión regular sea insensible a mayúsculas y minúsculas.

const validateBatea = (input: unknown) => {
  return bateaSchemaValidator.safeParse(input)
}
//module.exports = mongoose.model('Batea', BateaSchema);
const Batea = mongoose.model('Batea', BateaSchema);
export { Batea, validateBatea };
