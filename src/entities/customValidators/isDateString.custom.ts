import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator'
import * as moment from 'moment'

@ValidatorConstraint()
class IsDateStringConstraints implements ValidatorConstraintInterface {
  private readonly val: (inp: string, format: string) => boolean
  constructor() {
    this.val = (inp: string, format: string) => moment(inp, format).isValid()
  }
  validate(textThatShouldBeDate: string, args: ValidationArguments): boolean {
    // would be NaN when failing and that is falsy else a number(timestamp)
    return (
      this.val(textThatShouldBeDate, 'MM/DD/YYYY') ||
      this.val(textThatShouldBeDate, 'DD/MM/YYYY')
    )
  }

  defaultMessage(args: ValidationArguments): string {
    const { property } = args
    return `${property} should be in format DD/MM/YYYY or DD-MM-YYYY`
  }
}

export function IsDateStringCustom(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    // object -> will be the class you are using this decrator in
    registerDecorator({
      target: object.constructor,
      propertyName, // the name of the prop this decrator have been place on top of it
      options: validationOptions, // from @dec({...})
      validator: IsDateStringConstraints,
      async: false,
    })
  }
}
