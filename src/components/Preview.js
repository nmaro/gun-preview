import React, { useEffect, useState } from "react";
import { stringify } from "qs";

import MD from "markdown-it";
import WikiLinks from "markdown-it-wikilinks";
import { getPub } from "nicks-gun-utils";

const s = (o, p) => {
  const object = {};
  for (const key of Object.keys(o)) {
    if (o[key]) {
      object[key] = o[key];
    }
  }
  const stringified = stringify(object);
  return stringified ? `${p}${stringified}` : "";
};

export const Preview = ({ id, priv, epriv, document, onPublish }) => {
  const pub = getPub(id);
  const title = document.title || id;

  const hash = s({ priv, epriv }, "#");
  const [md, setMd] = useState();
  useEffect(() => {
    const md = MD().use(
      WikiLinks({
        baseURL: `?id=${pub ? `${pub}.` : ""}`,
        uriSuffix: hash,
        makeAllLinksAbsolute: true,
        postProcessPageName: pageName => encodeURIComponent(pageName.trim())
      })
    );
    setMd(md);
  }, [id]);

  if (!md) {
    return <div>Loading...</div>;
  }

  return (
    <div className="document">
      <div className="editor">
        <iframe
          src={`https://gun-editor.nmaro.now.sh?id=${id}${hash}`}
          frameBorder="0"
        />
        <div className="controls">
          <button onClick={onPublish}>Publish</button>
        </div>
      </div>
      <div className="preview">
        <span>preview</span>
        <h1>{title}</h1>
        <div
          className="markdown"
          dangerouslySetInnerHTML={{
            __html: md.render(document.atoms.map(atom => atom.atom).join(""), {
              sanitize: true
            })
          }}
        />
      </div>
      <div className="public">
        <span>
          <a
            href={`https://gun-pages.nmaro.now.sh?id=${id}#epriv=${epriv ||
              ""}`}
            target="_blank"
          >
            public
          </a>
        </span>
        <iframe
          src={`https://gun-pages.nmaro.now.sh?id=${id}#epriv=${epriv || ""}`}
          frameBorder="0"
        />
      </div>
    </div>
  );
};
