// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// @ts-nocheck

declare global {
  namespace Cypress {
    interface Chainable {
      selection(fn: any): Chainable;
      setSelection(subject: string, query?: string | object, endQuery?: any[]): Chainable;
      // setCursor(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;
      // setCursorBefore(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;
      // setCursorAfter(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;
    }
  }
}

// eslint-disable-next-line consistent-return
function getTextNode(el: Node, match?: string | object) {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  if (!match) {
    return walk.nextNode();
  }

  let node;
  // eslint-disable-next-line no-cond-assign
  while ((node = walk.nextNode())) {
    if (node.wholeText.includes(match)) {
      return node;
    }
  }
}

function setBaseAndExtent(...args: (Node | null | undefined)[]) {
  const document = args[0] && args[0].ownerDocument;
  document.getSelection().removeAllRanges();
  document.getSelection().setBaseAndExtent(...args);
}

Cypress.Commands.add('selection', { prevSubject: true }, (subject, fn) => {
  cy.wrap(subject).trigger('mousedown').then(fn).trigger('mouseup');

  cy.document().trigger('selectionchange');
  return cy.wrap(subject);
});

Cypress.Commands.add('setSelection', { prevSubject: true }, (subject, query, endQuery) =>
  // eslint-disable-next-line max-statements
  cy.wrap(subject).selection(($el: any[]) => {
    if (typeof query === 'string') {
      const anchorNode = getTextNode($el[0], query);
      const focusNode = endQuery ? getTextNode($el[0], endQuery) : anchorNode;
      const anchorOffset = anchorNode.wholeText.indexOf(query);
      const focusOffset = endQuery
        ? focusNode.wholeText.indexOf(endQuery) + endQuery.length
        : anchorOffset + query.length;
      setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
    } else if (typeof query === 'object') {
      const el = $el[0];

      const anchorNode = getTextNode(el.querySelector(query.anchorQuery));
      const anchorOffset = query.anchorOffset || 0;
      const focusNode = query.focusQuery
        ? getTextNode(el.querySelector(query.focusQuery))
        : anchorNode;
      const focusOffset = query.focusOffset || 0;
      setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
    }
  })
);

// Low level command reused by `setCursorBefore` and `setCursorAfter`, equal to `setCursorAfter`
// Cypress.Commands.add('setCursor', { prevSubject: true }, (subject, query, atStart) => {
//   return cy.wrap(subject).selection($el => {
//     const node = getTextNode($el[0], query);
//     const offset = node.wholeText.indexOf(query) + (atStart ? 0 : query.length);
//     const document = node.ownerDocument;
//     document.getSelection().removeAllRanges();
//     document.getSelection().collapse(node, offset);
//   });
//   // Depending on what you're testing, you may need to chain a `.click()` here to ensure
//   // further commands are picked up by whatever you're testing (this was required for Slate, for example).
// });

// Cypress.Commands.add('setCursorBefore', { prevSubject: true }, (subject, query) => {
//   cy.wrap(subject).setCursor(query, true);
// });

// Cypress.Commands.add('setCursorAfter', { prevSubject: true }, (subject, query) => {
//   cy.wrap(subject).setCursor(query);
// });

export {};