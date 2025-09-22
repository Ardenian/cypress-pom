interface IConstructor<T> {
  new (): T;

  // Or enforce default constructor
  // new (): T;
}

function activator<T extends CyArrayLikeElement>(type: IConstructor<T>): T {
  return new type();
}

interface CyArrayLikeElement {
  selector: string;
}

class Test implements CyArrayLikeElement {
  selector: string = "";
  constructor() {}
}

export class CyArrayLike<T extends CyArrayLikeElement> {
  private readonly hostSelector: string;

  constructor(hostSelector: string) {
    this.hostSelector = hostSelector;
  }

  // get(index: number): Cypress.Chainable<T> {
  //   return cy
  //     .get(this.hostSelector)
  //     .eq(index)
  //     .then(($el) => {
  //       return cy.wrap(activator<T>(typeof T));
  //     });
  // }
}

const arrayLike: Test = activator<Test>(Test);
