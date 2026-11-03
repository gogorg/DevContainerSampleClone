/**
 * @name Variable names should not start with test
 * @description Finds JavaScript and TypeScript variable declarations whose names start with "test".
 * @kind problem
 * @problem.severity recommendation
 * @id training/js-test-variable-prefix
 * @tags maintainability
 */

import javascript

from VarDecl declaration
where declaration.getVariable().getName().matches("test%")
select declaration, "Variable name starts with 'test'."
