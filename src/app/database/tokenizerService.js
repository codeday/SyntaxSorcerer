// Function to extract important tokens from a Tree-sitter syntax tree
export function extractTokens(tree) {
    const tokens = [];
  
    function traverseNode(node) {
      if (!node) return; // Ensure the node exists
  
      switch (node.type) {
        case 'function_declaration':
          tokens.push({
            type: 'function',
            name: node.childForFieldName('name') ? node.childForFieldName('name').text : 'anonymous',
            params: node.childForFieldName('parameters') ? node.childForFieldName('parameters').children.map(param => param.text) : [],
          });
          break;
        case 'class_declaration':
          tokens.push({
            type: 'class',
            name: node.childForFieldName('name') ? node.childForFieldName('name').text : 'anonymous',
          });
          break;
        case 'method_definition':
          tokens.push({
            type: 'method',
            class: node.parent && node.parent.type === 'class_declaration' ? node.parent.childForFieldName('name') ? node.parent.childForFieldName('name').text : 'anonymous' : null,
            name: node.childForFieldName('name') ? node.childForFieldName('name').text : 'anonymous',
            params: node.childForFieldName('parameters') ? node.childForFieldName('parameters').children.map(param => param.text) : [],
          });
          break;
        case 'variable_declarator':
          tokens.push({
            type: 'variable',
            name: node.childForFieldName('name') ? node.childForFieldName('name').text : 'anonymous',
            value: node.childForFieldName('value') ? node.childForFieldName('value').text : 'undefined',
          });
          break;
        case 'variable_declaration':
          const declarations = node.childForFieldName('declarations') ? node.childForFieldName('declarations').children.map(declarator => {
            const nameNode = declarator.childForFieldName('name');
            const valueNode = declarator.childForFieldName('value');
            return {
              type: 'variable',
              name: nameNode ? nameNode.text : 'anonymous',
              value: valueNode ? valueNode.text : 'undefined',
            };
          }) : [];
          tokens.push({
            type: 'variable_declaration',
            declarations,
          });
          break;
        case 'expression_statement':
          const expression = node.namedChildren.find(child => child.type === 'call_expression');
          if (expression) {
            const calleeNode = expression.namedChildren.find(child => child.type === 'member_expression' || child.type === 'identifier');
            const argsNode = expression.namedChildren.find(child => child.type === 'arguments');
  
            tokens.push({
              type: 'statement',
              action: 'call',
              callee: calleeNode ? calleeNode.text : 'unknown',
              arguments: argsNode ? argsNode.namedChildren.map(arg => arg.text) : [],
            });
          }
          break;
        case 'import_statement':
          const importClause = node.childForFieldName('import_clause');
          const specifiers = importClause ? importClause.namedChildren.map(child => child.type === 'import_specifier' ? { type: 'specifier', name: child.text } : null).filter(Boolean) : [];
          const sourceNode = node.childForFieldName('source');
          const source = sourceNode ? sourceNode.text : 'unknown';
  
          tokens.push({
            type: 'import',
            specifiers,
            source,
          });
          break;
        case 'export_statement':
          const exportSpecifiers = node.namedChildren.filter(child => child.type === 'export_specifier').map(child => child.childForFieldName('name') ? child.childForFieldName('name').text : 'anonymous');
          tokens.push({
            type: 'export',
            specifiers: exportSpecifiers,
          });
          break;
        case 'block':
          node.namedChildren.forEach(traverseNode);
          break;
        case 'comment':
          tokens.push({ type: 'comment', text: node.text });
          break;
        default:
          break;
      }
  
      node.namedChildren.forEach(traverseNode);
    }
  
    traverseNode(tree.rootNode);
  
    return tokens;
}  