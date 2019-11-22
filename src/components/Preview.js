import React from "react";

import marked from "marked";

export const Preview = ({ id, document, onPublish }) => {
  return (
    <div className="document">
      <div className="editor">
        <iframe
          src={`https://gun-editor.nmaro.now.sh?document=${id}`}
          frameBorder="0"
        />
        <div className="controls">
          <button onClick={onPublish}>Publish</button>
        </div>
      </div>
      <div className="preview">
        <span>preview</span>
        <h1>{document.title}</h1>
        <div
          className="markdown"
          dangerouslySetInnerHTML={{
            __html: marked(document.atoms.map(atom => atom.atom).join(""), {
              sanitize: true
            })
          }}
        />
      </div>
      <div className="public">
        <span>
          <a href={`https://gun-pages.nmaro.now.sh?page=${id}`}>public</a>
        </span>
        <h1>{document.title}</h1>
        <div
          className="markdown"
          dangerouslySetInnerHTML={{
            __html: marked(document.content || "", {
              sanitize: true
            })
          }}
        />
      </div>
    </div>
  );
};
