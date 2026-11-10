// MSW uses import.meta.url to locate its WASM asset in Node.
module.exports = function nodeImportMeta({ types }) {
  return {
    visitor: {
      MetaProperty(path, state) {
        if (path.node.meta.name === "import") {
          path.replaceWith(types.objectExpression([
            types.objectProperty(
              types.identifier("url"),
              types.stringLiteral(require("node:url").pathToFileURL(state.filename).href),
            ),
          ]));
        }
      },
    },
  };
};
