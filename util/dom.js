export const createNode = (nodeName, props = {}, content = null) => {
  var node;

  node = document.createElement(nodeName);

  // Set class or attributes
  if (props.constructor === String)
    node.setAttribute('class', props)
  else
    for (let propName in props) {
      node[propName] = props[propName];
    }
  // Set content or child
  if (content instanceof Array)
    for (let i = 0; i < content.length; i++) {
      node.appendChild(content[i])
    }
  else
    node.textContent = content

  return node;
};