function createElementWithAttrs(elementName, attrs = {}) {
  const elem = document.createElement(elementName);
  for (const [attr, value] of Object.entries(attrs)) {
    elem.setAttribute(attr, value);
  }
  return elem;
}

function wrap(wrapper, ...elems) {
  const w = createElementWithAttrs(wrapper);
  w.replaceChildren(...elems);
  return w;
}

function tableWrap(rows) {
  return wrap("table", ...rows.map(row =>
    wrap("tr", ...row.map(cell =>
      wrap("td", cell)
    ))
  ));
}

// quick elements
const qe = {
  br: () => createElementWithAttrs("br"),
  button: (label = "", onClick = null, disabled = false) => {
    const b = createElementWithAttrs("button");
    b.replaceChildren(label);
    if (onClick) b.addEventListener("click", onClick);
    if (disabled) b.setAttribute("disabled", true);
    return b;
  },
};
