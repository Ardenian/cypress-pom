interface IConstructor<T> {
  new (hostSelector: string): T;

  // Or enforce default constructor
  // new (): T;
}

function activator<T extends CyArrayLikeElement>(
  type: IConstructor<T>,
  hostSelector: string
): T {
  return new type(hostSelector);
}

interface CyArrayLikeElement {
  selector: string;
}

class Test implements CyArrayLikeElement {
  public selector: string;
  constructor(hostSelector: string) {
    this.selector = hostSelector;
  }
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

const arrayLike: Test = activator<Test>(Test, "test");
