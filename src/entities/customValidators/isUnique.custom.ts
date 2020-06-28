import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator'
import Container from 'typedi'
import { BaseService } from '../../services/base.service'

export function IsUniqueCustom(
  validationOptions?: ValidationOptions,
  service?: Function
) {
  return (object: object, propertyName: string) => {
    // object -> will be the class you are using this decrator in
    registerDecorator({
      target: object.constructor,
      propertyName, // the name of the prop this decrator have been place on top of it
      options: validationOptions,
      validator: {
        async validate(toBeUnique: string, args: ValidationArguments) {
          const ser = Container.get(service) as BaseService<any>
          try {
            await ser.getById(null, { [args.property]: toBeUnique })
          } catch {
            return true
          }
          return false
        },
        defaultMessage(args: ValidationArguments): string {
          const { property } = args
          return `${property} already exists in this entity - not unique`
        },
      },
      async: true,
    })
  }
}
